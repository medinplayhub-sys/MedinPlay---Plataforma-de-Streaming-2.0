import React, { useState } from 'react';
import {
  ContentItem,
  IPTVChannel,
  RadioStation,
  UserAccount,
  Season,
  Episode,
} from '../../types';
import {
  Settings,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Tv,
  Film,
  Radio,
  Users,
  Database,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Layers,
  Link,
  Clapperboard,
  Star,
  Clock,
  Tag,
  Video,
  Play,
  CheckSquare,
  Square,
} from 'lucide-react';

interface AdminDashboardProps {
  catalog: ContentItem[];
  iptvChannels: IPTVChannel[];
  radioStations: RadioStation[];
  account: UserAccount;
  onClose: () => void;
  onAddContent: (item: ContentItem) => void;
  onUpdateContent?: (item: ContentItem) => void;
  onDeleteContent: (id: string) => void;
  onAddIPTV: (channel: IPTVChannel) => void;
  onDeleteIPTV: (id: string) => void;
  onAddRadio: (station: RadioStation) => void;
  onDeleteRadio: (id: string) => void;
}

const AVAILABLE_GENRES = [
  'Ciencia Ficción',
  'Acción',
  'Misterio',
  'Drama',
  'Cyberpunk',
  'Animación',
  'Suspenso',
  'Terror',
  'Aventura',
  'Fantasía',
  'Comedia',
  'Documental',
  'Deportes',
  'Romance',
  'Crimen',
];

const AVAILABLE_RATINGS = ['G', 'PG', 'PG-13', 'TV-14', 'TV-MA', '18+', 'R'];
const AVAILABLE_QUALITIES: Array<'4K UHD' | '1080p' | '720p' | '8K HDR'> = [
  '4K UHD',
  '1080p',
  '720p',
  '8K HDR',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  catalog,
  iptvChannels,
  radioStations,
  account,
  onClose,
  onAddContent,
  onUpdateContent,
  onDeleteContent,
  onAddIPTV,
  onDeleteIPTV,
  onAddRadio,
  onDeleteRadio,
}) => {
  const isAuthorizedAdmin = account.email?.toLowerCase().trim() === 'medinplayhub@gmail.com';

  const [activeTab, setActiveTab] = useState<'analytics' | 'vod' | 'iptv' | 'radio' | 'users'>('vod');

  // VOD Creation / Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newVodTitle, setNewVodTitle] = useState('');
  const [newVodOriginalTitle, setNewVodOriginalTitle] = useState('');
  const [newVodType, setNewVodType] = useState<'movie' | 'series'>('movie');
  const [newVodGenres, setNewVodGenres] = useState<string[]>(['Ciencia Ficción', 'Acción']);
  const [newVodYear, setNewVodYear] = useState<number>(2026);
  const [newVodRating, setNewVodRating] = useState<string>('PG-13');
  const [newVodScore, setNewVodScore] = useState<number>(9.4);
  const [newVodQuality, setNewVodQuality] = useState<'4K UHD' | '1080p' | '720p' | '8K HDR'>('4K UHD');
  const [newVodDuration, setNewVodDuration] = useState('2h 15m');
  const [newVodSynopsis, setNewVodSynopsis] = useState('');
  const [newVodDirector, setNewVodDirector] = useState('Denis Villeneuve');
  const [newVodCast, setNewVodCast] = useState('Timothée Chalamet, Zendaya, Rebecca Ferguson');
  const [newVodVideoUrl, setNewVodVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [newVodPoster, setNewVodPoster] = useState('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800');
  const [newVodBackdrop, setNewVodBackdrop] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200');
  const [newVodIsAdult, setNewVodIsAdult] = useState(false);
  const [newVodIsExclusive, setNewVodIsExclusive] = useState(true);
  const [newVodIsTrending, setNewVodIsTrending] = useState(true);
  const [newVodIsNewRelease, setNewVodIsNewRelease] = useState(true);
  const [newVodMatch, setNewVodMatch] = useState(98);
  const [newVodSequelId, setNewVodSequelId] = useState<string>('');
  const [newVodSagaName, setNewVodSagaName] = useState<string>('');

  // Series Seasons & Episodes state
  const [seasons, setSeasons] = useState<Season[]>([
    {
      seasonNumber: 1,
      title: 'Temporada 1: El Despertar',
      episodes: [
        {
          id: 'ep-1-1',
          episodeNumber: 1,
          seasonNumber: 1,
          title: 'Piloto: Señal en la Oscuridad',
          duration: '52m',
          durationSeconds: 3120,
          synopsis: 'Un grupo de exploradores detecta una anomalía cuántica en los bordes del sistema solar.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          releaseDate: '2026-01-15',
        },
        {
          id: 'ep-1-2',
          episodeNumber: 2,
          seasonNumber: 1,
          title: 'Capítulo 2: El Salto Hiperespacial',
          duration: '48m',
          durationSeconds: 2880,
          synopsis: 'La tripulación debe tomar una decisión arriesgada cuando la nave pierde el soporte de gravedad.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          releaseDate: '2026-01-22',
        },
      ],
    },
  ]);

  // IPTV Creation State
  const [newIptvName, setNewIptvName] = useState('');
  const [newIptvNumber, setNewIptvNumber] = useState(105);
  const [newIptvCategory, setNewIptvCategory] = useState<'Deportes' | 'Noticias' | 'Cine & Series' | 'Entretenimiento' | 'Documentales' | 'Música' | 'Infantil' | 'Adultos +18'>('Deportes');
  const [newIptvStreamUrl, setNewIptvStreamUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4');
  const [newIptvQuality, setNewIptvQuality] = useState<'4K 60fps' | '1080p 60fps' | '720p'>('4K 60fps');
  const [newIptvLogo, setNewIptvLogo] = useState('https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200');
  const [newIptvIsAdult, setNewIptvIsAdult] = useState(false);

  // Radio Creation State
  const [newRadioName, setNewRadioName] = useState('');
  const [newRadioGenre, setNewRadioGenre] = useState('Synthwave / Cyberpunk');
  const [newRadioStreamUrl, setNewRadioStreamUrl] = useState('https://stream.zeno.fm/f3wvbbqmdg8uv');
  const [newRadioBitrate, setNewRadioBitrate] = useState('320 kbps HD');

  const [notificationMsg, setNotificationMsg] = useState('');

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const toggleGenre = (genre: string) => {
    if (newVodGenres.includes(genre)) {
      if (newVodGenres.length > 1) {
        setNewVodGenres(newVodGenres.filter((g) => g !== genre));
      }
    } else {
      setNewVodGenres([...newVodGenres, genre]);
    }
  };

  // Season / Episode Helpers for Series
  const addSeason = () => {
    const nextSeasonNum = seasons.length + 1;
    const newSeason: Season = {
      seasonNumber: nextSeasonNum,
      title: `Temporada ${nextSeasonNum}`,
      episodes: [
        {
          id: `ep-${nextSeasonNum}-1`,
          episodeNumber: 1,
          seasonNumber: nextSeasonNum,
          title: `Episodio 1`,
          duration: '45m',
          durationSeconds: 2700,
          synopsis: 'Inicio de la nueva temporada.',
          thumbnailUrl: newVodPoster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
          videoUrl: newVodVideoUrl,
          releaseDate: '2026-03-01',
        },
      ],
    };
    setSeasons([...seasons, newSeason]);
    triggerNotification(`Temporada ${nextSeasonNum} añadida.`);
  };

  const removeSeason = (seasonNum: number) => {
    if (seasons.length <= 1) return;
    setSeasons(seasons.filter((s) => s.seasonNumber !== seasonNum));
  };

  const addEpisode = (seasonNum: number) => {
    setSeasons(
      seasons.map((s) => {
        if (s.seasonNumber === seasonNum) {
          const nextEpNum = s.episodes.length + 1;
          const newEp: Episode = {
            id: `ep-${seasonNum}-${nextEpNum}-${Date.now()}`,
            episodeNumber: nextEpNum,
            seasonNumber: seasonNum,
            title: `Capítulo ${nextEpNum}: Nuevo Episodio`,
            duration: '50m',
            durationSeconds: 3000,
            synopsis: 'Descripción del capítulo...',
            thumbnailUrl: newVodPoster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
            videoUrl: newVodVideoUrl,
            releaseDate: '2026-03-01',
          };
          return { ...s, episodes: [...s.episodes, newEp] };
        }
        return s;
      })
    );
  };

  const updateEpisode = (seasonNum: number, epIndex: number, field: keyof Episode, value: any) => {
    setSeasons(
      seasons.map((s) => {
        if (s.seasonNumber === seasonNum) {
          const updatedEpisodes = [...s.episodes];
          updatedEpisodes[epIndex] = {
            ...updatedEpisodes[epIndex],
            [field]: value,
          };
          return { ...s, episodes: updatedEpisodes };
        }
        return s;
      })
    );
  };

  const removeEpisode = (seasonNum: number, epIndex: number) => {
    setSeasons(
      seasons.map((s) => {
        if (s.seasonNumber === seasonNum) {
          if (s.episodes.length <= 1) return s;
          const updated = s.episodes.filter((_, i) => i !== epIndex);
          return { ...s, episodes: updated };
        }
        return s;
      })
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setNewVodTitle('');
    setNewVodOriginalTitle('');
    setNewVodType('movie');
    setNewVodGenres(['Ciencia Ficción', 'Acción']);
    setNewVodYear(2026);
    setNewVodRating('PG-13');
    setNewVodScore(9.4);
    setNewVodQuality('4K UHD');
    setNewVodDuration('2h 15m');
    setNewVodSynopsis('');
    setNewVodDirector('Denis Villeneuve');
    setNewVodCast('Timothée Chalamet, Zendaya');
    setNewVodVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    setNewVodPoster('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800');
    setNewVodBackdrop('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200');
    setNewVodIsAdult(false);
    setNewVodIsExclusive(true);
    setNewVodIsTrending(true);
    setNewVodIsNewRelease(true);
    setNewVodMatch(98);
    setNewVodSequelId('');
    setNewVodSagaName('');
  };

  const handleEditItem = (item: ContentItem) => {
    setEditingId(item.id);
    setNewVodTitle(item.title);
    setNewVodOriginalTitle(item.originalTitle || '');
    setNewVodType(item.type);
    setNewVodGenres(item.genre && item.genre.length > 0 ? item.genre : ['Ciencia Ficción']);
    setNewVodYear(item.year || 2026);
    setNewVodRating(item.rating || 'PG-13');
    setNewVodScore(item.score || 9.0);
    setNewVodQuality(item.quality || '4K UHD');
    setNewVodDuration(item.duration || '2h 10m');
    setNewVodSynopsis(item.synopsis || '');
    setNewVodDirector(item.director || '');
    setNewVodCast(item.cast?.join(', ') || '');
    setNewVodVideoUrl(item.videoUrl);
    setNewVodPoster(item.posterUrl);
    setNewVodBackdrop(item.backdropUrl || item.posterUrl);
    setNewVodIsAdult(item.isAdult || false);
    setNewVodIsExclusive(item.isExclusive ?? true);
    setNewVodIsTrending(item.isTrending ?? true);
    setNewVodIsNewRelease(item.isNewRelease ?? true);
    setNewVodMatch(item.matchPercentage || 95);
    setNewVodSequelId(item.sequelContentId || '');
    setNewVodSagaName(item.sagaName || '');
    if (item.type === 'series' && item.seasons && item.seasons.length > 0) {
      setSeasons(item.seasons);
    }
    setActiveTab('vod');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveVOD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVodTitle.trim()) {
      triggerNotification('Por favor ingresa un título válido.');
      return;
    }

    const castArray = newVodCast
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const itemData: ContentItem = {
      id: editingId || 'vod-' + Date.now(),
      title: newVodTitle.trim(),
      originalTitle: newVodOriginalTitle.trim() || undefined,
      type: newVodType,
      genre: newVodGenres,
      year: Number(newVodYear) || 2026,
      rating: newVodRating,
      score: Number(newVodScore) || 9.0,
      matchPercentage: Number(newVodMatch) || 95,
      quality: newVodQuality,
      duration: newVodType === 'movie' ? newVodDuration : undefined,
      seasonsCount: newVodType === 'series' ? seasons.length : undefined,
      seasons: newVodType === 'series' ? seasons : undefined,
      synopsis: newVodSynopsis.trim() || `Producción exclusiva MedinPlay en ${newVodQuality} con audio inmersivo y subtítulos en español.`,
      director: newVodDirector.trim() || undefined,
      cast: castArray.length > 0 ? castArray : ['Elenco Principal MedinPlay'],
      posterUrl: newVodPoster.trim() || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
      backdropUrl: newVodBackdrop.trim() || newVodPoster.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      videoUrl: newVodVideoUrl.trim(),
      isExclusive: newVodIsExclusive,
      isTrending: newVodIsTrending,
      isNewRelease: newVodIsNewRelease,
      isAdult: newVodIsAdult,
      viewsCount: editingId ? (catalog.find((c) => c.id === editingId)?.viewsCount || 1500) : 120,
      tags: [newVodQuality, ...newVodGenres, newVodIsExclusive ? 'Exclusivo' : 'VOD'],
      sequelContentId: newVodSequelId || undefined,
      sagaName: newVodSagaName.trim() || undefined,
      audioTracks: [
        { id: 'es-la', language: 'Español', label: 'Español Latino (Dolby Atmos 5.1)', codec: 'E-AC3' },
        { id: 'es-es', language: 'Español (España)', label: 'Castellano (5.1)', codec: 'AC3' },
        { id: 'en', language: 'Inglés', label: 'English Original (Dolby TrueHD 7.1)', codec: 'TrueHD' },
      ],
      subtitleTracks: [
        { id: 'sub-es', language: 'Español', label: 'Español Latino' },
        { id: 'sub-en', language: 'Inglés', label: 'English CC' },
      ],
    };

    if (editingId && onUpdateContent) {
      onUpdateContent(itemData);
      triggerNotification(`Contenido "${itemData.title}" actualizado con éxito.`);
    } else {
      onAddContent(itemData);
      triggerNotification(`Nuevo título "${itemData.title}" publicado en MedinPlay.`);
    }

    resetForm();
  };

  const handleCreateIPTV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIptvName.trim()) return;

    const newChannel: IPTVChannel = {
      id: 'iptv-' + Date.now(),
      channelNumber: Number(newIptvNumber) || 101,
      name: newIptvName.trim(),
      category: newIptvCategory,
      quality: newIptvQuality,
      logoUrl: newIptvLogo.trim() || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200',
      streamUrl: newIptvStreamUrl.trim(),
      liveViewers: 1840,
      bitrateKbps: newIptvQuality === '4K 60fps' ? 18500 : 9200,
      country: 'Internacional',
      audioLanguage: 'Español Latino',
      isAdult: newIptvIsAdult,
      isPremium: true,
      lowLatencyMs: 140,
      currentProgram: {
        id: 'epg-' + Date.now(),
        title: 'Transmisión en Vivo Directa',
        category: newIptvCategory,
        description: 'Cobertura oficial en vivo con baja latencia.',
        startTime: '14:00',
        endTime: '16:00',
        progressPercentage: 50,
        isLive: true,
      },
      upcomingPrograms: [
        {
          id: 'epg-up-' + Date.now(),
          title: 'Edición Especial Prime Time',
          category: newIptvCategory,
          description: 'Próxima programación destacada.',
          startTime: '16:00',
          endTime: '18:00',
          progressPercentage: 0,
          isLive: false,
        },
      ],
    };

    onAddIPTV(newChannel);
    setNewIptvName('');
    triggerNotification(`Canal IPTV "${newChannel.name}" agregado con éxito.`);
  };

  const handleCreateRadio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRadioName.trim()) return;

    const newStation: RadioStation = {
      id: 'radio-' + Date.now(),
      name: newRadioName.trim(),
      genre: newRadioGenre,
      logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
      streamUrl: newRadioStreamUrl.trim(),
      listeners: 1120,
      bitrate: newRadioBitrate,
      country: 'Global',
      isLive: true,
      description: 'Emisora en vivo con audio digital sin interrupciones.',
      currentTrack: {
        title: 'MedinPlay Live FM',
        artist: 'Transmisión Principal',
        albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
        duration: '3:45',
      },
    };

    onAddRadio(newStation);
    setNewRadioName('');
    triggerNotification(`Emisora de Radio "${newStation.name}" agregada con éxito.`);
  };

  // List of other movies to link as sequel
  const otherMovies = catalog.filter((c) => c.type === 'movie' && c.id !== editingId);

  // Security Access Guard for medinplayhub@gmail.com
  if (!isAuthorizedAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-[#0b0e17] border border-rose-500/50 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
            <ShieldCheck className="w-8 h-8 text-rose-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Acceso Exclusivo de Administrador</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              El panel de administración, gestión de contenidos VOD, IPTV y servidores está restringido únicamente a la cuenta maestra:
            </p>
            <div className="p-2.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs font-mono font-bold text-rose-300">
              medinplayhub@gmail.com
            </div>
            <p className="text-[11px] text-slate-500">
              Cuenta actual: <strong className="text-slate-300">{account.email || 'Invitado no autenticado'}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-rose-500/20"
          >
            Volver a la Plataforma
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b0e17] border border-amber-500/30 w-full max-w-6xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          title="Cerrar Panel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-amber-400" /> CMS & CONTROL MAESTRO DE TRANSMISIÓN
              </span>
              <span className="bg-zinc-800 text-zinc-300 text-[11px] px-2 py-0.5 rounded-full font-mono">
                MedinPlay v4.8
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
              Gestor de Contenido Multimedia MedinPlay
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Servidor Express & LL-HLS Activo</span>
          </div>
        </div>

        {/* Notification Alert */}
        {notificationMsg && (
          <div className="bg-emerald-950/70 border border-emerald-500/50 p-3.5 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-2">
          {[
            { id: 'vod' as const, label: `Catálogo VOD (${catalog.length})`, icon: Film },
            { id: 'iptv' as const, label: `Canales IPTV (${iptvChannels.length})`, icon: Tv },
            { id: 'radio' as const, label: `Radios HD (${radioStations.length})`, icon: Radio },
            { id: 'analytics' as const, label: 'Telemetría y Servidores', icon: Activity },
            { id: 'users' as const, label: 'Usuarios & Cuentas', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: VOD CATALOG CMS (Películas, Series, Temporadas, Capítulos, Secuelas, Géneros) */}
        {activeTab === 'vod' && (
          <div className="space-y-6">
            {/* Form Container */}
            <form onSubmit={handleSaveVOD} className="bg-black/50 border border-amber-500/30 p-5 sm:p-6 rounded-3xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
                    {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {editingId ? `Editando: ${newVodTitle}` : 'Agregar Nueva Película o Serie al Catálogo'}
                  </h3>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" /> Cancelar Edición
                  </button>
                )}
              </div>

              {/* Basic Meta: Title, Type, Year, Rating, Quality, Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Título:</label>
                  <input
                    type="text"
                    placeholder="Ej. Dune: Parte Tres"
                    value={newVodTitle}
                    onChange={(e) => setNewVodTitle(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Título Original (Opcional):</label>
                  <input
                    type="text"
                    placeholder="Ej. Dune: Part Three"
                    value={newVodOriginalTitle}
                    onChange={(e) => setNewVodOriginalTitle(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Tipo de Contenido:</label>
                  <select
                    value={newVodType}
                    onChange={(e: any) => setNewVodType(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="movie">🎬 Película (Largometraje)</option>
                    <option value="series">📺 Serie de TV (Temporadas y Capítulos)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Calidad / Resolución:</label>
                  <select
                    value={newVodQuality}
                    onChange={(e: any) => setNewVodQuality(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold text-amber-400"
                  >
                    {AVAILABLE_QUALITIES.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Año de Estreno:</label>
                  <input
                    type="number"
                    min="1950"
                    max="2035"
                    value={newVodYear}
                    onChange={(e) => setNewVodYear(parseInt(e.target.value) || 2026)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Clasificación / Rating:</label>
                  <select
                    value={newVodRating}
                    onChange={(e) => setNewVodRating(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {AVAILABLE_RATINGS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Puntuación / Score (0 a 10):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={newVodScore}
                    onChange={(e) => setNewVodScore(parseFloat(e.target.value) || 9.0)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    {newVodType === 'movie' ? 'Duración:' : 'Duración Promedio:'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 2h 24m"
                    value={newVodDuration}
                    onChange={(e) => setNewVodDuration(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Multi-Genre Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Géneros y Categorías (Selección Múltiple):</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-black/40 rounded-2xl border border-white/10">
                  {AVAILABLE_GENRES.map((g) => {
                    const isSelected = newVodGenres.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => toggleGenre(g)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3 opacity-40" />}
                        <span>{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* URLs and Media Stream formats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>URL de Video / Stream Principal:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://... (.mp4, .m3u8 HLS, .mpd DASH, YouTube, Vimeo)"
                    value={newVodVideoUrl}
                    onChange={(e) => setNewVodVideoUrl(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Soporta: MP4 directos, HLS (.m3u8), DASH (.mpd), WebM, YouTube y Vimeo.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">URL de Portada (Póster):</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newVodPoster}
                    onChange={(e) => setNewVodPoster(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Direct Relational Sequels & Sagas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                <div>
                  <label className="text-[11px] font-bold text-amber-300 block mb-1 flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5" />
                    <span>Vincular Secuela / Continuación Directa:</span>
                  </label>
                  <select
                    value={newVodSequelId}
                    onChange={(e) => setNewVodSequelId(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="">-- Sin Secuela Vinculada --</option>
                    {otherMovies.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.year})
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Al terminar la película, la plataforma ofrecerá reproducir la secuela automáticamente.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-300 block mb-1 flex items-center gap-1.5">
                    <Clapperboard className="w-3.5 h-3.5" />
                    <span>Nombre de la Saga / Universo Cinematográfico:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Saga Dune, Universo Denis Villeneuve, etc."
                    value={newVodSagaName}
                    onChange={(e) => setNewVodSagaName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* SERIES: SEASONS & EPISODES MANAGER */}
              {newVodType === 'series' && (
                <div className="space-y-4 p-5 bg-zinc-950/80 border border-zinc-700/60 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Gestor de Temporadas y Capítulos ({seasons.length} Temporadas)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={addSeason}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Temporada
                    </button>
                  </div>

                  <div className="space-y-4">
                    {seasons.map((season) => (
                      <div
                        key={season.seasonNumber}
                        className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-xs font-bold text-amber-400 font-mono">
                            Temporada {season.seasonNumber}: {season.title} ({season.episodes.length} Episodios)
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => addEpisode(season.seasonNumber)}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3 text-amber-400" /> Añadir Capítulo
                            </button>
                            {seasons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSeason(season.seasonNumber)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                title="Eliminar Temporada"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Episodes List in Season */}
                        <div className="space-y-2.5">
                          {season.episodes.map((ep, epIdx) => (
                            <div
                              key={ep.id || epIdx}
                              className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2 text-xs"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">
                                    Capítulo #{ep.episodeNumber} - Título:
                                  </label>
                                  <input
                                    type="text"
                                    value={ep.title}
                                    onChange={(e) =>
                                      updateEpisode(season.seasonNumber, epIdx, 'title', e.target.value)
                                    }
                                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Duración:</label>
                                  <input
                                    type="text"
                                    value={ep.duration}
                                    onChange={(e) =>
                                      updateEpisode(season.seasonNumber, epIdx, 'duration', e.target.value)
                                    }
                                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">
                                    URL de Video del Capítulo:
                                  </label>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={ep.videoUrl}
                                      onChange={(e) =>
                                        updateEpisode(season.seasonNumber, epIdx, 'videoUrl', e.target.value)
                                      }
                                      className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                                    />
                                    {season.episodes.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeEpisode(season.seasonNumber, epIdx)}
                                        className="p-1 text-slate-400 hover:text-rose-400"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges and Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-xl bg-white/5">
                  <input
                    type="checkbox"
                    checked={newVodIsExclusive}
                    onChange={(e) => setNewVodIsExclusive(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-amber-500"
                  />
                  <span>Original MedinPlay</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-xl bg-white/5">
                  <input
                    type="checkbox"
                    checked={newVodIsTrending}
                    onChange={(e) => setNewVodIsTrending(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-amber-500"
                  />
                  <span>Tendencia / Top 10</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-xl bg-white/5">
                  <input
                    type="checkbox"
                    checked={newVodIsNewRelease}
                    onChange={(e) => setNewVodIsNewRelease(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-amber-500"
                  />
                  <span>Recién Añadido</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-rose-400 cursor-pointer p-2 rounded-xl bg-white/5">
                  <input
                    type="checkbox"
                    checked={newVodIsAdult}
                    onChange={(e) => setNewVodIsAdult(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-rose-500"
                  />
                  <span>Contenido Adultos +18</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Descartar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingId ? 'Guardar Cambios del Título' : 'Publicar en Catálogo'}</span>
                </button>
              </div>
            </form>

            {/* List of Catalog Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Títulos en Catálogo MedinPlay ({catalog.length}):
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {catalog.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-12 h-16 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                            {item.title}
                          </h4>
                          {item.isExclusive && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
                              ORIGINAL
                            </span>
                          )}
                          <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded font-mono font-bold">
                            {item.quality}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          <span>{item.type === 'movie' ? 'Película' : 'Serie'}</span> •{' '}
                          <span>{item.year}</span> • <span>★ {item.score}</span> •{' '}
                          <span>{item.rating}</span>
                        </div>
                        <div className="text-[10px] text-amber-400/90 truncate max-w-[220px]">
                          {item.genre?.join(', ')}
                          {item.sequelContentId ? ' • (Tiene Secuela)' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-white/10 rounded-xl transition-all"
                        title="Editar en CMS"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteContent(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-all"
                        title="Eliminar contenido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IPTV CHANNELS CMS */}
        {activeTab === 'iptv' && (
          <div className="space-y-6">
            <form onSubmit={handleCreateIPTV} className="bg-black/50 border border-white/10 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-400" />
                <span>Agregar Nuevo Canal IPTV en Vivo</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nombre del Canal:</label>
                  <input
                    type="text"
                    placeholder="Ej. ESPN Ultra HD"
                    value={newIptvName}
                    onChange={(e) => setNewIptvName(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Número de Canal:</label>
                  <input
                    type="number"
                    value={newIptvNumber}
                    onChange={(e) => setNewIptvNumber(parseInt(e.target.value) || 101)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Categoría:</label>
                  <select
                    value={newIptvCategory}
                    onChange={(e: any) => setNewIptvCategory(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Deportes">Deportes</option>
                    <option value="Noticias">Noticias</option>
                    <option value="Cine & Series">Cine & Series</option>
                    <option value="Entretenimiento">Entretenimiento</option>
                    <option value="Documentales">Documentales</option>
                    <option value="Música">Música</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Adultos +18">Adultos +18</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Resolución / Latencia:</label>
                  <select
                    value={newIptvQuality}
                    onChange={(e: any) => setNewIptvQuality(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="4K 60fps">4K 60fps (Baja Latencia)</option>
                    <option value="1080p 60fps">1080p 60fps</option>
                    <option value="720p">720p HD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">URL de Stream IPTV (HLS / m3u8 / MP4 / DASH):</label>
                  <input
                    type="text"
                    value={newIptvStreamUrl}
                    onChange={(e) => setNewIptvStreamUrl(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">URL de Logo del Canal:</label>
                  <input
                    type="text"
                    value={newIptvLogo}
                    onChange={(e) => setNewIptvLogo(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIptvIsAdult}
                    onChange={(e) => setNewIptvIsAdult(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-rose-500"
                  />
                  <span>Canal para Adultos +18 (Requiere PIN)</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Publicar Canal IPTV
                </button>
              </div>
            </form>

            {/* List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Canales en Transmisión ({iptvChannels.length}):
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {iptvChannels.map((ch) => (
                  <div
                    key={ch.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <img src={ch.logoUrl} alt={ch.name} className="w-10 h-10 rounded-xl object-cover bg-black" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-amber-400">CH {ch.channelNumber}</span>
                          <h4 className="text-xs font-bold text-white">{ch.name}</h4>
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded font-bold">
                            {ch.quality}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {ch.category} • {ch.liveViewers} espectadores • Latencia: {ch.lowLatencyMs}ms
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteIPTV(ch.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Eliminar canal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RADIO STATIONS CMS */}
        {activeTab === 'radio' && (
          <div className="space-y-6">
            <form onSubmit={handleCreateRadio} className="bg-black/50 border border-white/10 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Agregar Nueva Estación de Radio Digital</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nombre de la Emisora:</label>
                  <input
                    type="text"
                    placeholder="Ej. MedinPlay Synthwave FM"
                    value={newRadioName}
                    onChange={(e) => setNewRadioName(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Género Musical:</label>
                  <input
                    type="text"
                    value={newRadioGenre}
                    onChange={(e) => setNewRadioGenre(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Calidad de Audio:</label>
                  <select
                    value={newRadioBitrate}
                    onChange={(e) => setNewRadioBitrate(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="320 kbps HD">320 kbps Ultra HD</option>
                    <option value="256 kbps AAC">256 kbps AAC+</option>
                    <option value="128 kbps MP3">128 kbps Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">URL de Stream de Audio (Icecast / Shoutcast / MP3 / AAC):</label>
                <input
                  type="text"
                  value={newRadioStreamUrl}
                  onChange={(e) => setNewRadioStreamUrl(e.target.value)}
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Publicar Emisora de Radio
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Emisoras en Vivo ({radioStations.length}):
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {radioStations.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <img src={st.logoUrl} alt={st.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{st.name}</h4>
                        <span className="text-[10px] text-slate-400">
                          {st.genre} • {st.bitrate} • {st.listeners} oyentes
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteRadio(st.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Eliminar emisora"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TELEMETRY & EDGE SERVERS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Espectadores Totales</span>
                <p className="text-2xl font-black text-white font-mono">18,492</p>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  +14% vs hora anterior
                </span>
              </div>

              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Latencia Promedio</span>
                <p className="text-2xl font-black text-amber-400 font-mono">140 ms</p>
                <span className="text-[11px] text-slate-400 font-mono">Protocolo WebRTC / LL-HLS</span>
              </div>

              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Ancho de Banda CDN</span>
                <p className="text-2xl font-black text-amber-400 font-mono">48.6 Gbps</p>
                <span className="text-[11px] text-slate-400 font-mono">Edge Caching 99.4%</span>
              </div>

              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Consultas Gemini IA</span>
                <p className="text-2xl font-black text-indigo-400 font-mono">4,120</p>
                <span className="text-[11px] text-indigo-300 font-mono">Thinking Model: Flash</span>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Estado de Servidores Edge & Transcodificación MedinPlay
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { region: 'US-East (Virginia)', latency: '18ms', load: '42%', status: 'Óptimo' },
                  { region: 'EU-Central (Frankfurt)', latency: '24ms', load: '58%', status: 'Óptimo' },
                  { region: 'SA-East (São Paulo)', latency: '31ms', load: '36%', status: 'Óptimo' },
                  { region: 'AP-East (Tokyo)', latency: '45ms', load: '61%', status: 'Óptimo' },
                ].map((node, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span className="font-semibold text-slate-200">{node.region}</span>
                    <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                      <span>Latencia: {node.latency}</span>
                      <span>Carga: {node.load}</span>
                      <span className="text-emerald-400 font-bold">{node.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: USERS & AUTH */}
        {activeTab === 'users' && (
          <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Cuentas Registradas & Sesión Activa</span>
            </h3>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={account.avatarUrl} alt={account.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">{account.fullName}</h4>
                  <p className="text-xs text-slate-400 font-mono">{account.email}</p>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    Plan: {account.subscription.planName} • {account.profiles.length} Perfiles
                  </span>
                </div>
              </div>

              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                Sesión Verificada
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
