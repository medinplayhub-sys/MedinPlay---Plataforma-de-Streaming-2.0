import React, { useState } from 'react';
import { RadioStation, ViewLayoutMode } from '../../types';
import {
  Radio,
  Play,
  Volume2,
  Headphones,
  Sparkles,
  Search,
  Activity,
  Music,
  Disc,
  LayoutGrid,
  List,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AdBannerCard } from '../layout/AdBannerCard';

interface RadioSectionProps {
  stations: RadioStation[];
  activeStation: RadioStation | null;
  onPlayStation: (station: RadioStation) => void;
  onOpenSubscription?: () => void;
}

export const RadioSection: React.FC<RadioSectionProps> = ({
  stations,
  activeStation,
  onPlayStation,
  onOpenSubscription,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'genre' | 'bitrate'>('name');
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('grid');

  const adBanners = StorageService.getAdBanners().filter((b) => b.active);
  const genres = ['Todos', 'Lo-Fi / Chillhop / Ambient', 'Synthwave / Cyberpunk / EDM', 'Pop / Top Hits / Urbano', 'Smooth Jazz / Neo-Soul'];

  const filteredStations = stations
    .filter((st) => {
      if (selectedGenre !== 'Todos' && st.genre !== selectedGenre) return false;
      if (
        searchKeyword &&
        !st.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !st.genre.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !st.currentTrack.title.toLowerCase().includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'genre') return a.genre.localeCompare(b.genre);
      if (sortBy === 'bitrate') return b.bitrate.localeCompare(a.bitrate);
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-400" /> Radio Digital HD Lossless
              </span>
              <span className="text-xs text-emerald-400 font-mono">Audio 320 kbps FLAC / AAC</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1.5 font-serif italic flex items-center gap-2">
              <Music className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              <span>Emisoras de Radio en Vivo & Lo-Fi 24/7</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Música continua sin interrupciones, sonido espacial envolvente, visualizador de audio y reproducción en segundo plano.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar estación, género o artista..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          {/* Genre Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === g
                    ? 'bg-zinc-800 text-white border border-zinc-700 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort & Grid/List View Toggles */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500 hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              >
                <option value="name">Nombre A-Z</option>
                <option value="genre">Género</option>
                <option value="bitrate">Bitrate</option>
              </select>
            </div>

            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  layoutMode === 'grid'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Vista Cuadrícula"
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
                title="Vista Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stations Layout */}
      {layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStations.map((station, index) => {
            const isCurrentlyPlaying = activeStation?.id === station.id;
            const showAd = (index + 1) % 4 === 0 && adBanners.length > 0;
            const bannerIndex = Math.floor(index / 4) % adBanners.length;
            const currentAd = adBanners[bannerIndex];

            return (
              <React.Fragment key={station.id}>
                <div
                  onClick={() => onPlayStation(station)}
                  className={`group bg-[#0c0c0e] border rounded-2xl p-4 shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isCurrentlyPlaying
                      ? 'border-amber-500/80 shadow-amber-500/10 bg-amber-950/10'
                      : 'border-zinc-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                        <img
                          src={station.logoUrl}
                          alt={station.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isCurrentlyPlaying && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="flex items-end gap-1 h-6">
                              <span className="w-1 bg-amber-400 rounded-full animate-pulse" />
                              <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                              <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-bold uppercase">
                            {station.genre}
                          </span>
                          {station.frequency && (
                            <span className="text-[10px] text-zinc-500 font-mono">{station.frequency}</span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors mt-1 truncate font-serif italic">
                          {station.name}
                        </h3>
                        <span className="text-xs text-zinc-500 truncate block">{station.country} • {station.bitrate}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayStation(station);
                      }}
                      className={`p-3 rounded-2xl font-bold shadow-lg transition-transform active:scale-95 shrink-0 ${
                        isCurrentlyPlaying
                          ? 'bg-amber-400 text-black shadow-amber-400/20'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* Current Song Box */}
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <Disc className={`w-4 h-4 text-amber-400 shrink-0 ${isCurrentlyPlaying ? 'animate-spin' : ''}`} />
                        <span className="font-semibold text-zinc-200 truncate">
                          {station.currentTrack.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">{station.currentTrack.duration || '3:45'}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 pl-6 truncate">
                      Artista: <strong className="text-zinc-300">{station.currentTrack.artist}</strong>
                    </p>
                  </div>
                </div>

                {/* Inline Ad Banner */}
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
          {filteredStations.map((station, index) => {
            const isCurrentlyPlaying = activeStation?.id === station.id;
            const showAd = (index + 1) % 4 === 0 && adBanners.length > 0;
            const bannerIndex = Math.floor(index / 4) % adBanners.length;
            const currentAd = adBanners[bannerIndex];

            return (
              <React.Fragment key={station.id}>
                <div
                  onClick={() => onPlayStation(station)}
                  className={`bg-[#0c0c0e] border rounded-2xl p-3 sm:p-4 transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                    isCurrentlyPlaying
                      ? 'border-amber-500/80 bg-amber-950/10'
                      : 'border-zinc-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                      <img src={station.logoUrl} alt={station.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 truncate font-serif italic">
                          {station.name}
                        </h4>
                        <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono hidden sm:inline">
                          {station.bitrate}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate">
                        {station.currentTrack.title} • {station.currentTrack.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-zinc-500 font-mono hidden md:inline">{station.frequency || station.genre}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayStation(station);
                      }}
                      className={`p-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md ${
                        isCurrentlyPlaying
                          ? 'bg-amber-400 text-black'
                          : 'bg-white hover:bg-zinc-200 text-black'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
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
