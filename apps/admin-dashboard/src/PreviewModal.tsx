import React, { useRef, useEffect } from 'react';
import { X, Play, Volume2, VolumeX } from 'lucide-react';
import { MediaItem } from './types';

interface PreviewModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ item, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mediaRef = item?.type === 'radios' ? audioRef : videoRef;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
      if (e.key === 'm') toggleMute();
      if (e.key === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoadedMetadata = () => setDuration(media.duration);
    const handleTimeUpdate = () => setCurrentTime(media.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => console.error('Error de reproducción');

    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('ended', handleEnded);
    media.addEventListener('error', handleError);

    return () => {
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('ended', handleEnded);
      media.removeEventListener('error', handleError);
    };
  }, [item]);

  const togglePlayPause = () => {
    const media = mediaRef.current;
    if (!media) return;
    if (isPlaying) media.pause();
    else media.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const media = mediaRef.current;
    if (!media) return;
    media.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const media = mediaRef.current;
    if (!media) return;
    const vol = parseFloat(e.target.value);
    media.volume = vol;
    media.muted = vol === 0;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const media = mediaRef.current;
    if (!media) return;
    media.currentTime = parseFloat(e.target.value);
  };

  const toggleFullscreen = () => {
    const media = mediaRef.current;
    if (!media) return;
    if (!document.fullscreenElement) {
      media.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!item) return null;

  const isVideo = item.type !== 'radios';

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className={`w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#372054] relative ${isFullscreen ? 'fixed inset-0 max-w-none rounded-none z-[9999]' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Player */}
        <div className="relative w-full h-full">
          {isVideo ? (
            <video
              ref={videoRef}
              src={item.streamUrl}
              className="w-full h-full object-contain"
              playsInline
              crossOrigin="anonymous"
              poster={item.backdrop || item.poster || undefined}
            />
          ) : (
            <audio
              ref={audioRef}
              src={item.streamUrl}
              className="w-full h-full"
              crossOrigin="anonymous"
            />
          )}

          {/* Overlay placeholder for audio */}
          {!isVideo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0d2e] to-[#0d0714]">
              {item.logo && (
                <img src={item.logo} alt={item.title} className="w-48 h-48 md:w-64 md:h-64 object-contain mb-6 drop-shadow-2xl" />
              )}
              <div className="text-center px-6">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{item.title}</h2>
                <p className="text-[#ffb703] text-lg font-medium">{item.frequency || 'Streaming de Radio'}</p>
                <p className="text-gray-400 text-sm mt-2">{item.country || ''}</p>
                <p className="text-gray-500 text-xs mt-4">{item.categories.join(', ')}</p>
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          <div className={`absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-3 text-white mb-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none accent-[#ffb703] cursor-pointer"
              />
              <span className="text-xs font-mono text-gray-300 w-20 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  className="p-2 bg-[#ffb703] hover:bg-amber-400 text-[#0d0714] rounded-full transition cursor-pointer"
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                  ) : (
                    <Play size={20} />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-300 hover:text-white transition cursor-pointer"
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-gray-700 rounded-full appearance-none accent-[#ffb703] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{item.type.toUpperCase()}</span>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-gray-300 hover:text-white transition cursor-pointer"
                  aria-label={isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isFullscreen ? (
                      <>
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 18h3a2 2 0 0 0 2-2V3"/>
                      </>
                    ) : (
                      <>
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                      </>
                    )}
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 bg-red-600/80 hover:bg-red-500 text-white rounded-full transition cursor-pointer"
                  aria-label="Cerrar reproductor"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Title bar for video */}
        {isVideo && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3">
              <h3 className="font-bold text-white">{item.title}</h3>
              {item.year && <span className="text-xs bg-[#372054] text-gray-300 px-2 py-0.5 rounded">{item.year}</span>}
              {item.rating && (
                <span className="flex items-center gap-1 text-xs bg-[#ffb703] text-[#0d0714] px-2 py-0.5 rounded font-bold">
                  <Star size={12} className="fill-current" /> {item.rating}
                </span>
              )}
              {item.isAdult && (
                <span className="flex items-center gap-1 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                  <ShieldAlert size={10} /> +18
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="pointer-events-auto p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition cursor-pointer"
              aria-label="Cerrar reproductor"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};