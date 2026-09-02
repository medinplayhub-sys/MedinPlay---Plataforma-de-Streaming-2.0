import React, { useState, useRef, useEffect } from 'react';
import {
  ContentItem,
  IPTVChannel,
  Episode,
  LiveChatMessage,
  AudioTrack,
  SubtitleTrack,
  UserProfile,
} from '../../types';
import { AIService, AICompanionResult } from '../../services/aiService';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
  RotateCcw,
  RotateCw,
  Settings,
  Sparkles,
  MessageSquare,
  Users,
  Send,
  Radio,
  Tv,
  List,
  ChevronRight,
  ShieldAlert,
  Eye,
  EyeOff,
  Zap,
  Activity,
  Check,
  X,
  Share2,
  Heart,
  Bookmark,
  Subtitles,
  Sliders,
  Flame,
  Film,
  Clapperboard,
  ArrowRight,
} from 'lucide-react';

interface StreamPlayerModalProps {
  item: ContentItem | IPTVChannel | null;
  initialEpisode?: Episode;
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  catalog?: ContentItem[];
  onPlayItem?: (item: ContentItem | IPTVChannel, episode?: Episode) => void;
  onUpdateWatchProgress?: (item: ContentItem, progressSec: number, totalSec: number) => void;
  onToggleWatchlist?: (contentId: string) => void;
  onToggleFavorite?: (contentId: string) => void;
  isFavorite?: boolean;
  isWatchlisted?: boolean;
}

// Multi-format stream detector
function getEmbedInfo(url: string) {
  if (!url) return { isEmbed: false, embedUrl: '', format: 'standard' };

  // YouTube watch, share, shorts, or embed URLs
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      isEmbed: true,
      type: 'youtube',
      format: 'YouTube 4K Ultra Stream',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isEmbed: true,
      type: 'vimeo',
      format: 'Vimeo Pro Stream',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  if (url.includes('.m3u8')) {
    return { isEmbed: false, embedUrl: '', format: 'HLS / LL-HLS Adaptive Stream' };
  }

  if (url.includes('.mpd')) {
    return { isEmbed: false, embedUrl: '', format: 'MPEG-DASH 4K Stream' };
  }

  return { isEmbed: false, embedUrl: '', format: 'Direct MP4 / WebM HEVC' };
}

export const StreamPlayerModal: React.FC<StreamPlayerModalProps> = ({
  item,
  initialEpisode,
  isOpen,
  onClose,
  activeProfile,
  catalog = [],
  onPlayItem,
  onUpdateWatchProgress,
  onToggleWatchlist,
  onToggleFavorite,
  isFavorite = false,
  isWatchlisted = false,
}) => {
  const isIPTV = item ? 'channelNumber' in item : false;
  const isSeries = Boolean(item && !isIPTV && (item as ContentItem).type === 'series');

  // Video element & player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<any>(null);

  // Discrete Mode (+18 safety privacy blur)
  const [isDiscreteBlurred, setIsDiscreteBlurred] = useState(false);

  // Settings & Drawers
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('es-la');
  const [selectedSubtitle, setSelectedSubtitle] = useState('sub-off');
  const [selectedQuality, setSelectedQuality] = useState('Auto 4K Low-Latency');
  const [lowLatencyEnabled, setLowLatencyEnabled] = useState(true);

  // Current Episode for series
  const [currentEpisode, setCurrentEpisode] = useState<Episode | undefined>(
    initialEpisode ||
      (isSeries && item && (item as ContentItem).seasons?.[0]?.episodes?.[0]
        ? (item as ContentItem).seasons![0].episodes[0]
        : undefined)
  );

  // Live Chat state (IPTV / Live)
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    {
      id: 'c1',
      user: 'Carlos_VIP',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      badge: 'VIP',
      text: '¡Increíble la nitidez y el sonido en MedinPlay!',
      timestamp: '14:21',
    },
    {
      id: 'c2',
      user: 'Elena_Stream',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      badge: 'FAN',
      text: 'Latencia perfecta en vivo 🔥',
      timestamp: '14:22',
    },
    {
      id: 'c3',
      user: 'MedinPlay_AI',
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100',
      badge: 'AI',
      text: 'Transmisión optimizada con protocolo adaptativo WebRTC / LL-HLS (140ms).',
      timestamp: '14:22',
    },
  ]);
  const [inputChat, setInputChat] = useState('');
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'companion' | 'episodes'>(
    isIPTV ? 'chat' : isSeries ? 'episodes' : 'companion'
  );

  // AI Live Companion state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCompanionData, setAiCompanionData] = useState<AICompanionResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Real-time latency & bitrate stats HUD
  const [stats, setStats] = useState({
    latencyMs: isIPTV && item ? (item as IPTVChannel).lowLatencyMs || 140 : 120,
    bitrate: isIPTV ? '18.5 Mbps' : '24.2 Mbps',
    fps: 60,
    bufferHealth: '98%',
    droppedFrames: 0,
  });

  // Determine current video stream URL
  const currentVideoUrl = !item
    ? ''
    : isIPTV
    ? (item as IPTVChannel).streamUrl
    : currentEpisode
    ? currentEpisode.videoUrl
    : (item as ContentItem).videoUrl;

  const embedInfo = getEmbedInfo(currentVideoUrl);

  const contentTitle = !item
    ? ''
    : isIPTV
    ? (item as IPTVChannel).name
    : isSeries && currentEpisode
    ? `${(item as ContentItem).title}: T${currentEpisode.seasonNumber}E${currentEpisode.episodeNumber} "${currentEpisode.title}"`
    : (item as ContentItem).title;

  // Sequel content lookup
  const sequelItem =
    item && !isIPTV && (item as ContentItem).sequelContentId
      ? catalog.find((c) => c.id === (item as ContentItem).sequelContentId)
      : null;

  // Handle Autoplay & Listeners
  useEffect(() => {
    if (!isOpen || !item) return;

    if (videoRef.current && !embedInfo.isEmbed) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }

    // AI companion auto-fetch on mount
    fetchAiCompanionInitial();

    // Stats fluctuation simulation
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        latencyMs: Math.floor(130 + Math.random() * 25),
        fps: 60,
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [currentVideoUrl, isOpen, item]);

  const fetchAiCompanionInitial = async () => {
    setIsAiLoading(true);
    const res = await AIService.getStreamingCompanion({
      contentTitle: isIPTV ? (item as IPTVChannel).name : (item as ContentItem).title,
      contentType: isIPTV ? 'Canal en Vivo IPTV' : (item as ContentItem).type,
      currentTimestamp: formatTime(currentTime),
    });
    setAiCompanionData(res);
    setIsAiLoading(false);
  };

  const handleAskAiCompanion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    const question = aiPrompt;
    setAiPrompt('');
    const res = await AIService.getStreamingCompanion({
      contentTitle: isIPTV ? (item as IPTVChannel).name : (item as ContentItem).title,
      contentType: isIPTV ? 'Canal IPTV' : (item as ContentItem).type,
      currentTimestamp: formatTime(currentTime),
      userQuestion: question,
    });
    setAiCompanionData(res);
    setIsAiLoading(false);
  };

  // Video control helpers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 100);

      if (!isIPTV && onUpdateWatchProgress) {
        onUpdateWatchProgress(
          item as ContentItem,
          Math.floor(videoRef.current.currentTime),
          Math.floor(videoRef.current.duration || 100)
        );
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setIsPiPActive(true);
      }
    } catch (err) {
      console.warn('PiP error:', err);
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('medinplay-player-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const newMsg: LiveChatMessage = {
      id: 'chat-' + Date.now(),
      user: activeProfile.name,
      avatar: activeProfile.avatarUrl,
      badge: 'VIP',
      text: inputChat.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputChat('');
  };

  const handleReaction = (emoji: string) => {
    const newMsg: LiveChatMessage = {
      id: 'react-' + Date.now(),
      user: activeProfile.name,
      avatar: activeProfile.avatarUrl,
      text: emoji,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 4500);
    setControlsTimeout(timeout);
  };

  if (!isOpen || !item) return null;

  return (
    <div
      id="medinplay-player-container"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-200"
      onMouseMove={resetControlsTimeout}
    >
      {/* Top Header Bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
            title="Cerrar reproductor"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold tracking-wider">
                {isIPTV ? 'IPTV LIVE' : (item as ContentItem).quality || '4K UHD'}
              </span>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono font-bold">
                {embedInfo.format}
              </span>
              {isIPTV && (
                <span className="flex items-center gap-1 text-[10px] bg-red-500/90 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                  <Activity className="w-3 h-3" /> En Directo
                </span>
              )}
              {item.isAdult && (
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                  +18 ADULTO
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-md truncate max-w-md sm:max-w-xl">
              {contentTitle}
            </h2>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          {/* Discrete Mode Toggle (+18 blur safe shield) */}
          {item.isAdult && (
            <button
              onClick={() => setIsDiscreteBlurred(!isDiscreteBlurred)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isDiscreteBlurred
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40'
                  : 'bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900'
              }`}
              title="Modo Discreto Antimiradas"
            >
              {isDiscreteBlurred ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isDiscreteBlurred ? 'Modo Discreto Activo' : 'Ocultar Pantalla'}</span>
            </button>
          )}

          {/* Low Latency Engine Toggle */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black/60 border border-amber-500/30 px-3 py-1 rounded-xl text-xs text-amber-300 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono">{stats.latencyMs}ms Low-Latency</span>
          </div>

          {/* Watchlist & Favorites */}
          {!isIPTV && (
            <>
              <button
                onClick={() => onToggleFavorite?.(item.id)}
                className={`p-2 rounded-full backdrop-blur-md transition-all ${
                  isFavorite ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Favorito"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => onToggleWatchlist?.(item.id)}
                className={`p-2 rounded-full backdrop-blur-md transition-all ${
                  isWatchlisted ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Mi Lista"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </>
          )}

          {/* Settings Menu Button */}
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              showSettingsMenu ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Configuración de transmisión"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Stage & Side Panels Layout */}
      <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center">
        {/* Video Player Canvas */}
        <div
          className={`relative flex-1 w-full h-full flex items-center justify-center bg-black transition-all ${
            isDiscreteBlurred ? 'filter blur-3xl opacity-30 select-none' : ''
          }`}
          onClick={!embedInfo.isEmbed ? togglePlay : undefined}
        >
          {embedInfo.isEmbed ? (
            <iframe
              src={embedInfo.embedUrl}
              title={contentTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full max-h-screen border-0"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentVideoUrl}
              className="w-full h-full max-h-screen object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              playsInline
              crossOrigin="anonymous"
            />
          )}

          {/* Central Play/Pause Watermark Animation for HTML5 Video */}
          {!embedInfo.isEmbed && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-2xl shadow-amber-500/50 scale-110 transition-transform">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Low Latency Stats Watermark (Top Left) */}
          <div className="absolute top-16 left-4 z-20 pointer-events-none hidden md:block">
            <div className="bg-black/70 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] font-mono text-slate-300 backdrop-blur-md space-y-0.5">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>HEVC 4K • {stats.bitrate}</span>
              </div>
              <div className="text-slate-400">
                Latencia: <span className="text-emerald-400">{stats.latencyMs} ms</span> • Buffer: {stats.bufferHealth}
              </div>
            </div>
          </div>

          {/* Sequel Banner Link Overlay (If movie has a sequel linked) */}
          {sequelItem && (
            <div className="absolute bottom-24 right-6 z-30 hidden sm:block animate-in fade-in slide-in-from-right-4">
              <div className="bg-black/90 border border-amber-500/40 p-3 rounded-2xl flex items-center gap-3 shadow-2xl backdrop-blur-xl max-w-sm">
                <img
                  src={sequelItem.posterUrl}
                  alt={sequelItem.title}
                  className="w-12 h-16 rounded-xl object-cover border border-amber-500/30"
                />
                <div className="space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clapperboard className="w-3 h-3" /> Secuela Directa Disponible
                  </span>
                  <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{sequelItem.title}</h4>
                  <button
                    onClick={() => {
                      if (onPlayItem) onPlayItem(sequelItem);
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-lg text-[11px] flex items-center gap-1 transition-all"
                  >
                    <span>Ver Secuela Ahora</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel: AI Companion, Live Chat, or Episodes */}
        <div className="w-full lg:w-96 h-64 lg:h-full bg-[#0a0d16]/95 border-t lg:border-t-0 lg:border-l border-white/[0.08] backdrop-blur-2xl flex flex-col z-30">
          {/* Side Tabs Header */}
          <div className="flex items-center border-b border-white/[0.08] px-3 pt-3 gap-1">
            {isIPTV ? (
              <button
                onClick={() => setActiveSideTab('chat')}
                className={`flex-1 py-2 rounded-t-xl text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeSideTab === 'chat'
                    ? 'border-amber-400 text-amber-400 bg-white/[0.04]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat en Vivo ({isIPTV && 'liveViewers' in item && typeof item.liveViewers === 'number' ? item.liveViewers.toLocaleString() : '12,450'})
              </button>
            ) : isSeries ? (
              <button
                onClick={() => setActiveSideTab('episodes')}
                className={`flex-1 py-2 rounded-t-xl text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeSideTab === 'episodes'
                    ? 'border-amber-400 text-amber-400 bg-white/[0.04]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Episodios
              </button>
            ) : null}

            <button
              onClick={() => setActiveSideTab('companion')}
              className={`flex-1 py-2 rounded-t-xl text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeSideTab === 'companion'
                  ? 'border-amber-400 text-amber-400 bg-white/[0.04]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Asistente IA
            </button>
          </div>

          {/* Side Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
            {/* Live Chat Panel */}
            {activeSideTab === 'chat' && isIPTV && (
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 max-h-[calc(100vh-260px)]">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-xs bg-white/[0.03] p-2 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <img src={msg.avatar} alt={msg.user} className="w-4 h-4 rounded-full object-cover" />
                          <span className="font-bold text-slate-200">{msg.user}</span>
                          {msg.badge && (
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                msg.badge === 'VIP'
                                  ? 'bg-amber-500/30 text-amber-300'
                                  : msg.badge === 'AI'
                                  ? 'bg-amber-500/30 text-amber-300'
                                  : 'bg-indigo-500/30 text-indigo-300'
                              }`}
                            >
                              {msg.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Chat Quick Reactions & Input */}
                <div className="mt-2 pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-around">
                    {['🔥', '⚽', '👏', '🚀', '❤️', '😱'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="text-base hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Comentar en el chat en vivo..."
                      value={inputChat}
                      onChange={(e) => setInputChat(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* AI Streaming Companion Tab */}
            {activeSideTab === 'companion' && (
              <div className="h-full flex flex-col justify-between space-y-3">
                <div className="space-y-3 overflow-y-auto flex-1">
                  <div className="bg-gradient-to-br from-amber-950/40 to-black border border-amber-500/20 rounded-2xl p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Curiosidades y Análisis en Tiempo Real</span>
                    </div>
                    {isAiLoading ? (
                      <div className="py-6 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                        <span>Consultando inteligencia cinematográfica MedinPlay...</span>
                      </div>
                    ) : (
                      <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                        {aiCompanionData?.trivia && (
                          <div>
                            <span className="font-bold text-amber-400 block mb-0.5">Dato Curioso:</span>
                            <p className="text-slate-300 bg-white/5 p-2 rounded-xl border border-white/5">
                              {aiCompanionData.trivia}
                            </p>
                          </div>
                        )}
                        {aiCompanionData?.suggestedFollowUps && aiCompanionData.suggestedFollowUps.length > 0 && (
                          <div>
                            <span className="font-bold text-amber-400 block mb-0.5">Preguntas Sugeridas:</span>
                            <ul className="list-disc list-inside space-y-1 text-slate-400">
                              {aiCompanionData.suggestedFollowUps.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ask AI Input */}
                <form onSubmit={handleAskAiCompanion} className="flex gap-2 pt-2 border-t border-white/10">
                  <input
                    type="text"
                    placeholder="Preguntar a la IA sobre esta escena..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-amber-500 text-black font-bold rounded-xl text-xs flex items-center gap-1 hover:bg-amber-400 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                  </button>
                </form>
              </div>
            )}

            {/* Series Episodes Drawer Tab */}
            {activeSideTab === 'episodes' && isSeries && (
              <div className="space-y-3">
                {(item as ContentItem).seasons?.map((season) => (
                  <div key={season.seasonNumber} className="space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                      {season.title}
                    </h4>
                    {season.episodes.map((ep) => {
                      const isCurrent = currentEpisode?.id === ep.id;
                      return (
                        <button
                          key={ep.id}
                          onClick={() => {
                            setCurrentEpisode(ep);
                            if (videoRef.current) {
                              videoRef.current.currentTime = 0;
                              videoRef.current.play();
                            }
                          }}
                          className={`w-full text-left p-2.5 rounded-2xl text-xs flex items-center gap-2.5 transition-all ${
                            isCurrent
                              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          <img
                            src={ep.thumbnailUrl}
                            alt={ep.title}
                            className="w-16 h-10 rounded-xl object-cover shrink-0 border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold">
                              E{ep.episodeNumber}: {ep.title}
                            </p>
                            <span className="text-[10px] text-slate-400">{ep.duration}</span>
                          </div>
                          {isCurrent && <Play className="w-3.5 h-3.5 fill-current text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Floating Video Scrubber & Playback Controls Bar */}
      {!embedInfo.isEmbed && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Timeline Scrubber Bar */}
          {!isIPTV ? (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-slate-400 min-w-[45px] text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:h-2 transition-all"
              />
              <span className="text-xs font-mono text-slate-400 min-w-[45px]">
                {formatTime(duration)}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-3 bg-red-950/40 border border-red-500/20 px-3 py-1 rounded-xl text-xs text-red-300">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                <span>Transmisión en Vivo Directa</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">DVR TimeShift Habilitado</span>
            </div>
          )}

          {/* Playback Controls Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {/* Rewind / Forward 10s */}
              {!isIPTV && (
                <>
                  <button
                    onClick={() => {
                      if (videoRef.current) videoRef.current.currentTime -= 10;
                    }}
                    className="p-2 text-slate-300 hover:text-white transition-colors"
                    title="Retroceder 10s"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (videoRef.current) videoRef.current.currentTime += 10;
                    }}
                    className="p-2 text-slate-300 hover:text-white transition-colors"
                    title="Avanzar 10s"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="p-2 text-slate-300 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 hidden sm:block"
                />
              </div>
            </div>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePictureInPicture}
                className="p-2 text-slate-300 hover:text-white transition-colors hidden sm:block"
                title="Picture-in-Picture"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Pantalla Completa"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
