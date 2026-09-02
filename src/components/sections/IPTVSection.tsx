import React, { useState } from 'react';
import { IPTVChannel, UserProfile, ViewLayoutMode } from '../../types';
import {
  Tv,
  Activity,
  Radio,
  Clock,
  Play,
  Zap,
  Flame,
  Search,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Volume2,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AdBannerCard } from '../layout/AdBannerCard';

interface IPTVSectionProps {
  channels: IPTVChannel[];
  activeProfile: UserProfile;
  onPlayChannel: (channel: IPTVChannel) => void;
  onOpenSubscription?: () => void;
}

export const IPTVSection: React.FC<IPTVSectionProps> = ({
  channels,
  activeProfile,
  onPlayChannel,
  onOpenSubscription,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'viewers' | 'name'>('number');
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('grid');

  const adBanners = StorageService.getAdBanners().filter((b) => b.active);

  // Filter out adult channels unless explicitly unlocked
  const safeChannels = channels.filter(
    (ch) => !ch.isAdult || (activeProfile.isAdultUnlocked && !activeProfile.isKids)
  );

  const categories = ['Todos', 'Deportes', 'Noticias', 'Cine & Series', 'Documentales', 'Música', 'Infantil'];

  const filteredChannels = safeChannels
    .filter((ch) => {
      if (selectedCategory !== 'Todos' && ch.category !== selectedCategory) return false;
      if (
        searchKeyword &&
        !ch.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !ch.currentProgram.title.toLowerCase().includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'viewers') return b.liveViewers - a.liveViewers;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.channelNumber - b.channelNumber;
    });

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Banner with Low Latency & EPG Highlight */}
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <Activity className="w-3.5 h-3.5" /> Transmisión en Vivo 60 FPS
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <Zap className="w-3 h-3" /> Protocolo WebRTC / LL-HLS (&lt;120ms)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-2 font-serif italic flex items-center gap-2">
              <Tv className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              <span>IPTV en Vivo & Guía de Canales (EPG)</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Canales de televisión internacionales en tiempo real con chat en vivo, multicanal y guía de programación continua.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar canal o programa en vivo..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-zinc-800 text-white border border-zinc-700 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Grid/List View Toggles */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500 hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              >
                <option value="number">Número de Canal</option>
                <option value="viewers">Más Espectadores</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>

            {/* Layout Mode Switcher */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  layoutMode === 'grid'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Vista Tarjetas (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  layoutMode === 'list'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Vista Lista Compacta"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IPTV Channels List & EPG Guide Grid */}
      {layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChannels.map((ch, index) => {
            const showAd = (index + 1) % 4 === 0 && adBanners.length > 0;
            const bannerIndex = Math.floor(index / 4) % adBanners.length;
            const currentAd = adBanners[bannerIndex];

            return (
              <React.Fragment key={ch.id}>
                <div
                  className="bg-[#0c0c0e] border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-lg transition-all flex flex-col justify-between space-y-3.5 group"
                >
                  {/* Top Channel Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                        <img src={ch.logoUrl} alt={ch.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-mono font-bold text-zinc-400">CH {ch.channelNumber}</span>
                          <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded font-mono font-bold">
                            {ch.quality}
                          </span>
                          {ch.isPremium && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold uppercase">
                              VIP
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate font-serif italic">
                          {ch.name}
                        </h3>
                        <span className="text-[11px] text-zinc-500 truncate block">{ch.country} • {ch.audioLanguage}</span>
                      </div>
                    </div>

                    {/* Live Viewers & Play Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-mono font-bold text-zinc-200 block">
                          {ch.liveViewers.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase">Espectadores</span>
                      </div>
                      <button
                        onClick={() => onPlayChannel(ch)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Ver</span>
                      </button>
                    </div>
                  </div>

                  {/* EPG Program Timeline */}
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5 font-semibold text-zinc-200 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        <span className="text-red-400 font-bold uppercase text-[9px] shrink-0">AHORA:</span>
                        <span className="truncate">{ch.currentProgram.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                        {ch.currentProgram.startTime} - {ch.currentProgram.endTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {ch.currentProgram.description}
                    </p>

                    {/* Progress Slider */}
                    <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${ch.currentProgram.progressPercentage}%` }}
                      />
                    </div>

                    {/* Upcoming Show Preview */}
                    {ch.upcomingPrograms.length > 0 && (
                      <div className="pt-1 text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-800/80">
                        <span className="truncate">
                          <strong className="text-zinc-400">Sig:</strong> {ch.upcomingPrograms[0].title} ({ch.upcomingPrograms[0].startTime})
                        </span>
                        <span className="text-emerald-400 font-mono text-[10px] shrink-0 ml-2">
                          {ch.lowLatencyMs}ms
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ad Banner after every 4 channels */}
                {showAd && currentAd && (
                  <div className="md:col-span-2">
                    <AdBannerCard
                      banner={currentAd}
                      variant="horizontal-banner"
                      onAction={() => onOpenSubscription && onOpenSubscription()}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST VIEW */
        <div className="space-y-2.5">
          {filteredChannels.map((ch, index) => {
            const showAd = (index + 1) % 4 === 0 && adBanners.length > 0;
            const bannerIndex = Math.floor(index / 4) % adBanners.length;
            const currentAd = adBanners[bannerIndex];

            return (
              <React.Fragment key={ch.id}>
                <div className="bg-[#0c0c0e] border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-3 sm:p-4 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                      <img src={ch.logoUrl} alt={ch.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-400">CH {ch.channelNumber}</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 truncate font-serif italic">
                          {ch.name}
                        </h4>
                        <span className="text-[9px] bg-zinc-900 text-zinc-400 px-1.5 py-0.2 rounded font-mono hidden sm:inline">
                          {ch.quality}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate">
                        <span className="text-red-400 font-semibold">Ahora:</span> {ch.currentProgram.title} ({ch.currentProgram.startTime} - {ch.currentProgram.endTime})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                      {ch.liveViewers.toLocaleString()} viewers
                    </span>
                    <button
                      onClick={() => onPlayChannel(ch)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Ver</span>
                    </button>
                  </div>
                </div>

                {showAd && currentAd && (
                  <AdBannerCard
                    banner={currentAd}
                    variant="horizontal-banner"
                    onAction={() => onOpenSubscription && onOpenSubscription()}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
