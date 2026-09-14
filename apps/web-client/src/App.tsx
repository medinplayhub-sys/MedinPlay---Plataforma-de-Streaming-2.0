import React, { useState } from 'react';
import { 
  Film, Tv, Radio, Search, Play, Star, ShieldAlert, 
  Layers, X, Sparkles 
} from 'lucide-react';

type TabType = 'movies' | 'series' | 'iptv' | 'radios';

interface MediaItem {
  id: string;
  type: TabType;
  title: string;
  synopsis?: string;
  rating?: string;
  year?: string;
  categories: string[];
  poster?: string;
  backdrop?: string;
  streamUrl: string;
  duration?: string;
  isAdult?: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('movies');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);

  const [catalog] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'movies',
      title: 'Rio (2011)',
      synopsis: 'Blu, un guacamayo doméstico que no sabe volar, cree que es el último de su especie.',
      rating: '7.2',
      year: '2011',
      categories: ['Animación', 'Aventura', 'Comedia'],
      // REEMPLAZA ESTAS DOS LÍNEAS:
      poster: 'https://image.tmdb.org/t/p/w500/1pP3CbgO2G6N1p96LlhF15xW94C.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/83o6zW0I9y2dYwM1L44p3sI4i9L.jpg',
      streamUrl: 'https://archive.org/download/rio_20220511_202205/Rio.mp4',
      duration: '96 min',
      isAdult: false
    }
  ]);

  const categoriesForTab = ['Todos', ...Array.from(new Set(
    catalog
      .filter(item => item.type === activeTab)
      .flatMap(item => item.categories)
  ))];

  const filteredCatalog = catalog.filter(item => {
    const matchesTab = item.type === activeTab;
    const matchesCategory = selectedCategory === 'Todos' || item.categories.includes(selectedCategory);
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  const featuredMovie = catalog.find(item => item.type === 'movies');

  return (
    <div className="min-h-screen bg-[#0d0714] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#160d23]/90 backdrop-blur-md border-b border-[#2d1b42] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/medinplay-logo.svg" alt="MedinPlay" className="h-8 w-auto object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-[#231436] p-1 rounded-xl border border-[#372054]">
            <button
              onClick={() => { setActiveTab('movies'); setSelectedCategory('Todos'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'movies' ? 'bg-[#ffb703] text-[#0d0714]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Film size={16} /> Películas
            </button>
            <button
              onClick={() => { setActiveTab('series'); setSelectedCategory('Todos'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'series' ? 'bg-[#ffb703] text-[#0d0714]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={16} /> Series
            </button>
            <button
              onClick={() => { setActiveTab('iptv'); setSelectedCategory('Todos'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'iptv' ? 'bg-[#ffb703] text-[#0d0714]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tv size={16} /> IPTV en Vivo
            </button>
            <button
              onClick={() => { setActiveTab('radios'); setSelectedCategory('Todos'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'radios' ? 'bg-[#ffb703] text-[#0d0714]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Radio size={16} /> Radios
            </button>
          </nav>
        </div>

        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar títulos..."
            className="w-full bg-[#231436] border border-[#372054] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-400 outline-none focus:border-[#ffb703]"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-12">
        {activeTab === 'movies' && featuredMovie && !searchQuery && (
          <div className="relative h-[380px] w-full overflow-hidden bg-gradient-to-r from-[#0d0714] via-transparent to-transparent">
           <img 
  src={featuredMovie.backdrop || featuredMovie.poster} 
  alt={featuredMovie.title} 
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = 'https://placehold.co/1280x720/1d112b/ffb703?text=Rio+(2011)';
  }}
  className="absolute inset-0 w-full h-full object-cover opacity-40"
/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0714] via-[#0d0714]/40 to-transparent"></div>
            
            <div className="relative max-w-7xl mx-auto px-8 h-full flex flex-col justify-end pb-8">
              <span className="text-[#ffb703] text-xs font-bold tracking-widest uppercase flex items-center gap-1 mb-2">
                <Sparkles size={14} /> Destacado de la semana
              </span>
              <h1 className="text-4xl font-extrabold mb-2">{featuredMovie.title}</h1>
              <p className="text-gray-300 text-xs max-w-xl line-clamp-2 mb-4">{featuredMovie.synopsis}</p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPlayingItem(featuredMovie)}
                  className="bg-[#ffb703] hover:bg-yellow-500 text-[#0d0714] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition shadow-lg"
                >
                  <Play size={16} fill="#0d0714" /> Reproducir Ahora
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-8 pt-6">
          {/* Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
            {categoriesForTab.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer transition ${
                  selectedCategory === category
                    ? 'bg-[#ffb703] text-[#0d0714] font-bold'
                    : 'bg-[#1d112b] border border-[#372054] text-gray-300 hover:bg-[#2c1a42]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grilla */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {filteredCatalog.map(item => (
              <div 
                key={item.id} 
                onClick={() => setPlayingItem(item)}
                className="group relative bg-[#1d112b] border border-[#372054] rounded-2xl overflow-hidden cursor-pointer hover:border-[#ffb703] transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-[#2d1b42]">
                  <img 
  src={item.poster || item.backdrop} 
  alt={item.title} 
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = 'https://placehold.co/300x450/1d112b/ffb703?text=Sin+Imagen';
  }}
  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
/>
                  {item.rating && (
                    <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-[#ffb703] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star size={10} className="fill-[#ffb703]" /> {item.rating}
                    </span>
                  )}
                  {item.isAdult && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <ShieldAlert size={10} /> +18
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-xs truncate group-hover:text-[#ffb703] transition">{item.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-gray-400">{item.year}</span>
                    {item.categories[0] && (
                      <>
                        <span className="text-[10px] text-gray-600">•</span>
                        <span className="text-[10px] text-gray-400 truncate">{item.categories[0]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Reproductor */}
      {playingItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1d112b] border border-[#372054] rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#372054]">
              <div>
                <h2 className="font-bold text-sm text-white">{playingItem.title}</h2>
                <span className="text-[10px] text-[#ffb703] font-semibold">{playingItem.categories.join(', ')}</span>
              </div>
              <button 
                onClick={() => setPlayingItem(null)}
                className="p-1.5 hover:bg-[#372054] rounded-xl text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="aspect-video bg-black relative flex items-center justify-center">
              <video 
                src={playingItem.streamUrl} 
                controls 
                autoPlay 
                className="w-full h-full"
              ></video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}