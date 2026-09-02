import React, { useState } from 'react';
import { ContentItem, UserProfile, ViewLayoutMode } from '../../types';
import {
  Film,
  PlaySquare,
  Search,
  Star,
  Play,
  Bookmark,
  Heart,
  LayoutGrid,
  List,
  Sparkles,
  Layers,
  Globe2,
  Tv,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AdBannerCard } from '../layout/AdBannerCard';

interface MoviesSeriesSectionProps {
  catalog: ContentItem[];
  activeProfile: UserProfile;
  filterType?: 'all' | 'movie' | 'series';
  onPlayItem: (item: ContentItem) => void;
  onToggleWatchlist: (contentId: string) => void;
  onToggleFavorite: (contentId: string) => void;
  onOpenSubscription?: () => void;
}

export const MoviesSeriesSection: React.FC<MoviesSeriesSectionProps> = ({
  catalog,
  activeProfile,
  filterType = 'all',
  onPlayItem,
  onToggleWatchlist,
  onToggleFavorite,
  onOpenSubscription,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>(filterType);
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'rating' | 'year' | 'match' | 'title'>('trending');
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('grid');

  const adBanners = StorageService.getAdBanners().filter((b) => b.active);

  // Filter out adult items here (they belong to +18 safe zone)
  const nonAdultCatalog = catalog.filter(
    (item) => !item.isAdult || (activeProfile.isAdultUnlocked && !activeProfile.isKids)
  );

  // Available genres
  const genres = ['Todos', 'Ciencia Ficción', 'Acción', 'Misterio', 'Drama', 'Cyberpunk', 'Animación', 'Deportes'];

  // Filter logic
  const filteredItems = nonAdultCatalog
    .filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedGenre !== 'Todos' && !item.genre.includes(selectedGenre)) return false;
      if (
        searchKeyword &&
        !item.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !item.synopsis.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !item.cast.some((c) => c.toLowerCase().includes(searchKeyword.toLowerCase()))
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.score - a.score;
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.viewsCount - a.viewsCount;
    });

  const isWatchlisted = (id: string) => activeProfile.watchlist.includes(id);
  const isFavorited = (id: string) => activeProfile.favorites.includes(id);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider">
                Catálogo VOD MedinPlay
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">4K HDR • Dolby Atmos</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-serif italic flex items-center gap-2.5">
              <Film className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              <span>Películas y Series Bajo Demanda</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Explora producciones en 4K Ultra HD con pistas de audio multi-idioma y subtítulos sincronizados.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar títulos, directores, actores..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          {/* Content Type Selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === 'all'
                  ? 'bg-zinc-800 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({nonAdultCatalog.length})
            </button>
            <button
              onClick={() => setSelectedType('movie')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === 'movie'
                  ? 'bg-zinc-800 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Películas
            </button>
            <button
              onClick={() => setSelectedType('series')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === 'series'
                  ? 'bg-zinc-800 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Series
            </button>
          </div>

          {/* Genre Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedGenre === g
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort & Grid/List View Toggles */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Sort By Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500 hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              >
                <option value="trending">Más Populares</option>
                <option value="rating">Mayor Calificación ★</option>
                <option value="year">Año de Estreno</option>
                <option value="match">Match IA %</option>
                <option value="title">Título (A-Z)</option>
              </select>
            </div>

            {/* Layout Toggle (Grid vs List) */}
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
                title="Vista Lista Detallada"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-[#0c0c0e] rounded-3xl border border-zinc-800 p-6 space-y-3">
          <Film className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-serif italic">No se encontraron resultados</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Prueba ajustando los filtros de búsqueda o explorando otras categorías de nuestro catálogo.
          </p>
        </div>
      ) : layoutMode === 'grid' ? (
        /* GRID VIEW WITH AD BANNER INSERTION EVERY 4 ITEMS */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredItems.map((item, index) => {
            const showAd = (index + 1) % 4 === 0 && adBanners.length > 0;
            const bannerIndex = Math.floor(index / 4) % adBanners.length;
            const currentAd = adBanners[bannerIndex];

            return (
              <React.Fragment key={item.id}>
                {/* Standard Card */}
                <div className="group relative bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/40 transition-all flex flex-col justify-between">
                  {/* Poster & Badges */}
                  <div
                    className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950 cursor-pointer"
                    onClick={() => onPlayItem(item)}
                  >
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.isExclusive && (
                        <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-md">
                          ORIGINAL
                        </span>
                      )}
                      {item.type === 'series' && (
                        <span className="bg-indigo-900/90 border border-indigo-500/40 text-indigo-200 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {item.seasonsCount} T
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-zinc-300 border border-zinc-700">
                      {item.quality}
                    </div>

                    {/* Hover Play Trigger */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3
                        onClick={() => onPlayItem(item)}
                        className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors cursor-pointer font-serif italic"
                      >
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{item.genre.join(' • ')}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-current" /> {item.score}
                      </span>
                      <span className="font-mono text-zinc-500">{item.year}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleFavorite(item.id)}
                          className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                            isFavorited(item.id) ? 'text-rose-500' : 'text-zinc-500 hover:text-white'
                          }`}
                          title="Favorito"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFavorited(item.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => onToggleWatchlist(item.id)}
                          className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                            isWatchlisted(item.id) ? 'text-amber-400' : 'text-zinc-500 hover:text-white'
                          }`}
                          title="Mi Lista"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted(item.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inline Ad Banner every 4 elements */}
                {showAd && currentAd && (
                  <AdBannerCard
                    banner={currentAd}
                    onAction={() => onOpenSubscription && onOpenSubscription()}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        /* DETAILED LIST VIEW WITH AD BANNERS EVERY 4 ITEMS */
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const showAd = (index + 1) % 4 === 0 && adBanners.length > 0;
            const bannerIndex = Math.floor(index / 4) % adBanners.length;
            const currentAd = adBanners[bannerIndex];

            return (
              <React.Fragment key={item.id}>
                <div className="group bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-3 sm:p-4 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Thumbnail & Main Info */}
                  <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                    <div
                      className="relative w-20 sm:w-24 aspect-[2/3] shrink-0 rounded-xl overflow-hidden bg-zinc-950 cursor-pointer"
                      onClick={() => onPlayItem(item)}
                    >
                      <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-current" />
                      </div>
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] font-mono rounded">
                          {item.type === 'movie' ? 'Película' : `${item.seasonsCount} Temporadas`}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.duration || `${item.year}`}</span>
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-current" /> {item.score}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          {item.matchPercentage}% Match IA
                        </span>
                      </div>

                      <h3
                        onClick={() => onPlayItem(item)}
                        className="text-sm sm:text-base font-bold text-white font-serif italic truncate group-hover:text-amber-400 cursor-pointer"
                      >
                        {item.title}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.synopsis}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-500">
                        <span>{item.genre.join(', ')}</span>
                        <span>•</span>
                        <span>Cast: {item.cast.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isFavorited(item.id)
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                      title="Favorito"
                    >
                      <Heart className={`w-4 h-4 ${isFavorited(item.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => onToggleWatchlist(item.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isWatchlisted(item.id)
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                      title="Mi Lista"
                    >
                      <Bookmark className={`w-4 h-4 ${isWatchlisted(item.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => onPlayItem(item)}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Reproducir</span>
                    </button>
                  </div>
                </div>

                {/* Horizontal Ad Banner every 4 elements */}
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
