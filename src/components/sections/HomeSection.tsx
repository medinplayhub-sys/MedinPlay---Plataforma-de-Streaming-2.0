import React, { useState } from 'react';
import {
  ContentItem,
  IPTVChannel,
  RadioStation,
  UserProfile,
} from '../../types';
import {
  Play,
  Info,
  Bookmark,
  Heart,
  Star,
  Tv,
  Radio,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldAlert,
  Flame,
  Volume2,
  Check,
} from 'lucide-react';

interface HomeSectionProps {
  catalog: ContentItem[];
  iptvChannels: IPTVChannel[];
  radioStations: RadioStation[];
  activeProfile: UserProfile;
  onPlayItem: (item: ContentItem | IPTVChannel) => void;
  onPlayRadio: (station: RadioStation) => void;
  onToggleWatchlist: (contentId: string) => void;
  onToggleFavorite: (contentId: string) => void;
  onOpenAISearch: () => void;
  onOpenSection: (section: any) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  catalog,
  iptvChannels,
  radioStations,
  activeProfile,
  onPlayItem,
  onPlayRadio,
  onToggleWatchlist,
  onToggleFavorite,
  onOpenAISearch,
  onOpenSection,
}) => {
  // Filter out adult content from home view for safety (unless unlocked and non-kids profile)
  const safeCatalog = catalog.filter((item) => !item.isAdult || (activeProfile.isAdultUnlocked && !activeProfile.isKids));
  const safeIPTV = iptvChannels.filter((ch) => !ch.isAdult || (activeProfile.isAdultUnlocked && !activeProfile.isKids));

  // Hero feature item
  const heroItem = safeCatalog.find((i) => i.isExclusive) || safeCatalog[0];

  // Continue watching items from profile history
  const continueWatching = activeProfile.history.slice(0, 4);

  // Trending items
  const trendingItems = safeCatalog.filter((i) => i.isTrending);

  // AI Recommended items
  const aiRecommended = safeCatalog.slice(0, 5);

  const isWatchlisted = (id: string) => activeProfile.watchlist.includes(id);
  const isFavorited = (id: string) => activeProfile.favorites.includes(id);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Showcase Banner */}
      {heroItem && (
        <div className="relative w-full h-[500px] sm:h-[560px] lg:h-[600px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">
          {/* Backdrop Image */}
          <img
            src={heroItem.backdropUrl}
            alt={heroItem.title}
            className="w-full h-full object-cover object-center opacity-65 transform hover:scale-105 transition-transform duration-1000"
          />

          {/* Gradient Masks */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-10" />

          {/* Hero Content Overlay */}
          <div className="relative z-20 h-full flex flex-col justify-end p-6 sm:p-10 max-w-2xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                Exclusivo
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                {heroItem.matchPercentage}% AI Match
              </span>
              <span className="px-2 py-0.5 bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-[10px] font-semibold rounded">
                {heroItem.quality}
              </span>
              <span className="text-xs text-amber-400 font-semibold">
                ★ {heroItem.score}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl font-serif italic font-bold text-white tracking-tight leading-tight drop-shadow-xl">
              {heroItem.title}
            </h1>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3 max-w-xl drop-shadow">
              {heroItem.synopsis}
            </p>

            {/* Genres & Details */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400">
              <span className="font-mono">{heroItem.year}</span>
              <span>•</span>
              <span>{heroItem.duration || `${heroItem.seasonsCount} Temporadas`}</span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                {heroItem.genre.map((g) => (
                  <span key={g} className="bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300 text-[11px]">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onPlayItem(heroItem)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-full font-bold text-sm shadow-xl transition-all"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Ver Ahora</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(heroItem.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all backdrop-blur ${
                  isWatchlisted(heroItem.id)
                    ? 'bg-zinc-800 text-amber-400 border border-amber-500/40'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-white border border-zinc-700'
                }`}
              >
                {isWatchlisted(heroItem.id) ? (
                  <>
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>En Mi Lista</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>+ Mi Lista</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleFavorite(heroItem.id)}
                className={`p-2.5 rounded-full border transition-all ${
                  isFavorited(heroItem.id)
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                }`}
                title="Favorito"
              >
                <Heart className={`w-4 h-4 ${isFavorited(heroItem.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching Section */}
      {continueWatching.length > 0 && (
        <section className="space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold px-1">
            Continuar Viendo ({activeProfile.name})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {continueWatching.map((hItem) => {
              const fullItem = catalog.find((c) => c.id === hItem.contentId);
              const progressPct = Math.min(100, Math.round((hItem.progressSeconds / (hItem.totalDurationSeconds || 1)) * 100));

              return (
                <div
                  key={hItem.contentId}
                  onClick={() => fullItem && onPlayItem(fullItem)}
                  className="group relative bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                    <img
                      src={hItem.backdropUrl || hItem.posterUrl}
                      alt={hItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Amber Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                      {hItem.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                      <span>{hItem.episodeTitle ? `${hItem.episodeTitle}` : `${progressPct}% completado`}</span>
                      <span className="text-amber-400 font-mono">Reanudar</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* AI Smart Curated Section */}
      <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Gemini Neural Engine
              </span>
              <span className="text-xs text-zinc-500">• Curado para {activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-white mt-1">
              Recomendaciones Inteligentes
            </h2>
          </div>

          <button
            onClick={onOpenAISearch}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white hover:border-amber-500/50 text-xs font-medium transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Consultar Curador IA</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {aiRecommended.map((item) => (
            <div
              key={item.id}
              onClick={() => onPlayItem(item)}
              className="group relative bg-[#0d0d0d] border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-amber-400 border border-zinc-800">
                  {item.matchPercentage}% AI
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{item.genre.join(', ')}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2">
                  <span className="font-mono">{item.year}</span>
                  <span className="text-amber-400 font-semibold">★ {item.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top IPTV Live Channels Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold px-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            IPTV - Live Broadcasts
          </div>
          <button
            onClick={() => onOpenSection('iptv')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <span>Guía EPG</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {safeIPTV.slice(0, 4).map((ch) => (
            <div
              key={ch.id}
              onClick={() => onPlayItem(ch)}
              className="group bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                    <img src={ch.logoUrl} alt={ch.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-[130px]">
                      {ch.name}
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-mono">CH {ch.channelNumber} • {ch.quality}</span>
                  </div>
                </div>

                <span className="text-[9px] bg-red-600/90 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Live
                </span>
              </div>

              {/* Current Program */}
              <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-medium text-zinc-200 truncate">{ch.currentProgram.title}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${ch.currentProgram.progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                  <span>{ch.currentProgram.startTime} - {ch.currentProgram.endTime}</span>
                  <span className="text-amber-500">{ch.lowLatencyMs}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Radio Stations Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold px-1 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-zinc-400" />
            Radio Waves (HD Sound)
          </div>
          <button
            onClick={() => onOpenSection('radio')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <span>Ver Todas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {radioStations.map((station) => (
            <div
              key={station.id}
              onClick={() => onPlayRadio(station)}
              className="group bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3.5 shadow-lg transition-all cursor-pointer flex items-center gap-3"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                <img src={station.logoUrl} alt={station.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">{station.genre}</span>
                <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                  {station.name}
                </h3>
                <p className="text-[10px] text-zinc-400 truncate">
                  {station.currentTrack.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending VOD Catalog */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold px-1 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Trending Releases
          </div>
          <button
            onClick={() => onOpenSection('movies')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <span>Explorar Catálogo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onPlayItem(item)}
              className="group relative bg-[#0d0d0d] border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white text-black px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                  TOP
                </div>
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-medium text-zinc-300 border border-zinc-800">
                  {item.quality}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{item.genre.join(', ')}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2 pt-2 border-t border-zinc-800">
                  <span className="font-mono">{item.year}</span>
                  <span className="text-amber-400 font-semibold">★ {item.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
