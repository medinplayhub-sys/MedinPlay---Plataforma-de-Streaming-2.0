import React, { useState } from 'react';
import { 
  Film, Tv, Radio, Layers, Plus, Upload, 
  Trash2, FileText, CheckCircle, AlertCircle,
  Star, ShieldAlert, Sparkles, X, Edit3, Save, Play
} from 'lucide-react';
import { PreviewModal } from './PreviewModal';
import { MediaItem, TabType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('movies');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'movies',
      title: 'Rio (2011)',
      synopsis: 'Blu, un guacamayo doméstico que no sabe volar, cree que es el último de su especie.',
      rating: '7.2',
      year: '2011',
      categories: ['Animación', 'Aventura', 'Comedia'],
      poster: 'https://image.tmdb.org/t/p/w500/1pP3CbgO2G6N1p96LlhF15xW94C.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/83o6zW0I9y2dYwM1L44p3sI4i9L.jpg',
      streamUrl: 'https://archive.org/download/rio_20220511_202205/Rio.mp4',
      duration: '96 min',
      isAdult: false
    }
  ]);

  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Formulario Dinámico
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    rating: '7.0',
    year: new Date().getFullYear().toString(),
    categories: '',
    poster: '',
    backdrop: '',
    logo: '',
    streamUrl: '',
    duration: '',
    seasons: '1',
    episodes: '10',
    epgId: '',
    frequency: '',
    country: '',
    isAdult: false
  });

  // Modal Carga Masiva
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '', synopsis: '', rating: '7.0', year: new Date().getFullYear().toString(),
      categories: '', poster: '', backdrop: '', logo: '', streamUrl: '', duration: '',
      seasons: '1', episodes: '10', epgId: '', frequency: '', country: '', isAdult: false
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    resetForm();
    setUploadStatus(null);
  };

  // Cargar datos en el formulario para editar
  const handleStartEdit = (item: MediaItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      synopsis: item.synopsis || '',
      rating: item.rating || '7.0',
      year: item.year || new Date().getFullYear().toString(),
      categories: item.categories ? item.categories.join(', ') : '',
      poster: item.poster || '',
      backdrop: item.backdrop || '',
      logo: item.logo || '',
      streamUrl: item.streamUrl || '',
      duration: item.duration || '',
      seasons: item.seasons || '1',
      episodes: item.episodes || '10',
      epgId: item.epgId || '',
      frequency: item.frequency || '',
      country: item.country || '',
      isAdult: Boolean(item.isAdult)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guardar (Crear o Actualizar)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.streamUrl) return;

    const parsedCategories = formData.categories 
      ? formData.categories.split(',').map(c => c.trim()).filter(Boolean)
      : ['General'];

    if (editingId) {
      // Modo Edición
      setCatalog(prev => prev.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            title: formData.title,
            synopsis: formData.synopsis || undefined,
            rating: formData.rating || undefined,
            year: formData.year || undefined,
            categories: parsedCategories,
            poster: formData.poster || undefined,
            backdrop: formData.backdrop || undefined,
            logo: formData.logo || undefined,
            streamUrl: formData.streamUrl,
            duration: formData.duration || undefined,
            seasons: formData.seasons || undefined,
            episodes: formData.episodes || undefined,
            epgId: formData.epgId || undefined,
            frequency: formData.frequency || undefined,
            country: formData.country || undefined,
            isAdult: formData.isAdult
          };
        }
        return item;
      }));
    } else {
      // Modo Nuevo
      const newItem: MediaItem = {
        id: Date.now().toString(),
        type: activeTab,
        title: formData.title,
        synopsis: formData.synopsis || undefined,
        rating: formData.rating || undefined,
        year: formData.year || undefined,
        categories: parsedCategories,
        poster: formData.poster || undefined,
        backdrop: formData.backdrop || undefined,
        logo: formData.logo || undefined,
        streamUrl: formData.streamUrl,
        duration: formData.duration || undefined,
        seasons: formData.seasons || undefined,
        episodes: formData.episodes || undefined,
        epgId: formData.epgId || undefined,
        frequency: formData.frequency || undefined,
        country: formData.country || undefined,
        isAdult: formData.isAdult
      };
      setCatalog(prev => [newItem, ...prev]);
    }

    resetForm();
  };

  // Eliminar
  const handleDeleteItem = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este elemento?')) {
      setCatalog(prev => prev.filter(item => item.id !== id));
      if (editingId === id) resetForm();
    }
  };

  // Carga Masiva
  const handleBulkUpload = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData)) {
        throw new Error('El JSON debe ser un arreglo [...]');
      }

      const formattedItems: MediaItem[] = parsedData.map((item, index) => {
        let cats: string[] = ['General'];
        if (Array.isArray(item.categories)) {
          cats = item.categories;
        } else if (typeof item.categories === 'string' && item.categories.trim()) {
          cats = item.categories.split(',').map((c: string) => c.trim());
        }

        return {
          id: (Date.now() + index).toString(),
          type: activeTab,
          title: item.title || item.name || 'Sin Título',
          synopsis: item.synopsis || '',
          rating: item.rating ? String(item.rating) : '7.0',
          year: item.year ? String(item.year) : '',
          categories: cats,
          poster: item.poster || item.image || item.icon || '',
          backdrop: item.backdrop || item.cover || '',
          logo: item.logo || item.icon || item.poster || '',
          streamUrl: item.streamUrl || item.url || '',
          duration: item.duration || '',
          seasons: item.seasons ? String(item.seasons) : '',
          episodes: item.episodes ? String(item.episodes) : '',
          epgId: item.epgId || '',
          frequency: item.frequency || '',
          country: item.country || '',
          isAdult: Boolean(item.isAdult)
        };
      });

      setCatalog(prev => [...formattedItems, ...prev]);
      setUploadStatus({
        type: 'success',
        message: `¡Se importaron ${formattedItems.length} elementos correctamente!`
      });
      setJsonInput('');
      setTimeout(() => setShowBulkModal(false), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en JSON.';
      setUploadStatus({ type: 'error', message: msg });
    }
  };

  const itemsForCurrentTab = catalog.filter(item => item.type === activeTab);

  const getTabLabel = () => {
    switch (activeTab) {
      case 'movies': return 'Películas';
      case 'series': return 'Series';
      case 'iptv': return 'IPTV en Vivo';
      case 'radios': return 'Radios';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0714] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#160d23]/90 backdrop-blur-md border-b border-[#2d1b42] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10" viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFE57F" />
                  <stop offset="50%" stop-color="#D4AF37" />
                  <stop offset="100%" stop-color="#AA7C11" />
                </linearGradient>
                <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#4C1D95" />
                  <stop offset="100%" stop-color="#1E1035" />
                </linearGradient>
                <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <g transform="translate(10, 10)">
                <rect width="100" height="100" rx="28" fill="url(#purple-grad)" stroke="url(#gold-grad)" stroke-width="3" />
                <polygon points="42,34 72,50 42,66" fill="url(#gold-grad)" filter="url(#gold-glow)" />
              </g>
            </svg>
            <div>
              <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white via-amber-200 to-[#ffb703] bg-clip-text text-transparent">
                MedinPlay
              </span>
              <span className="text-[10px] block text-[#ffb703] font-bold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-[#231436] p-1 rounded-xl border border-[#372054]">
            <button
              onClick={() => handleTabChange('movies')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'movies' ? 'bg-[#ffb703] text-[#0d0714]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Film size={16} /> Películas
            </button>
            <button
              onClick={() => handleTabChange('series')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'series' ? 'bg-[#ffb703] text-[#0d0714]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={16} /> Series
            </button>
            <button
              onClick={() => handleTabChange('iptv')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'iptv' ? 'bg-[#ffb703] text-[#0d0714]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tv size={16} /> IPTV en Vivo
            </button>
            <button
              onClick={() => handleTabChange('radios')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'radios' ? 'bg-[#ffb703] text-[#0d0714]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Radio size={16} /> Radios
            </button>
          </nav>
        </div>

        <button
          onClick={() => { setShowBulkModal(true); setUploadStatus(null); }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer border border-emerald-400/30"
        >
          <Upload size={16} /> Carga Masiva ({getTabLabel()})
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* FORMULARIO DINÁMICO CON OPCIÓN EDITAR / CREAR */}
        <div className="bg-[#160d23] border border-[#372054] rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {editingId ? <Edit3 size={18} className="text-[#ffb703]" /> : <Plus size={18} className="text-[#ffb703]" />}
              {editingId ? 'Editando Elemento de' : 'Agregar Nuevo Elemento en'} <span className="text-[#ffb703] uppercase">{getTabLabel()}</span>
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs bg-[#231436] hover:bg-[#372054] text-gray-300 px-3 py-1.5 rounded-lg border border-[#372054] transition cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
          </div>

          <form onSubmit={handleSaveItem} className="space-y-4">
            
            {/* CAMPOS PELÍCULAS Y SERIES */}
            {(activeTab === 'movies' || activeTab === 'series') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Título *</label>
                    <input
                      type="text"
                      required
                      placeholder={activeTab === 'movies' ? "Ej: Rio (2011)" : "Ej: Breaking Bad"}
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 font-semibold">URL Video / Streaming *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://... (MP4, M3U8, HLS, etc)"
                      value={formData.streamUrl}
                      onChange={e => setFormData({ ...formData, streamUrl: e.target.value })}
                      className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Categorías (separadas por coma) *</label>
                    <input
                      type="text"
                      placeholder="Animación, Aventura, Acción"
                      value={formData.categories}
                      onChange={e => setFormData({ ...formData, categories: e.target.value })}
                      className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 font-semibold">URL Poster (Vertical)</label>
                    <input
                      type="url"
                      placeholder="https://... (JPG, PNG, WEBP)"
                      value={formData.poster}
                      onChange={e => setFormData({ ...formData, poster: e.target.value })}
                      className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 font-semibold">URL Backdrop (Fondo)</label>
                    <input
                      type="url"
                      placeholder="https://... (JPG, PNG, WEBP)"
                      value={formData.backdrop}
                      onChange={e => setFormData({ ...formData, backdrop: e.target.value })}
                      className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Año / Rating</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="2024"
                        value={formData.year}
                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                        className="w-1/2 bg-[#231436] border border-[#372054] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                      />
                      <input
                        type="text"
                        placeholder="7.5"
                        value={formData.rating}
                        onChange={e => setFormData({ ...formData, rating: e.target.value })}
                        className="w-1/2 bg-[#231436] border border-[#372054] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                      />
                    </div>
                  </div>

                  {activeTab === 'movies' ? (
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Duración / Restricción</label>
                      <div className="flex items-center gap-3 pt-0.5">
                        <input
                          type="text"
                          placeholder="120 min"
                          value={formData.duration}
                          onChange={e => setFormData({ ...formData, duration: e.target.value })}
                          className="flex-1 bg-[#231436] border border-[#372054] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                        />
                        <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isAdult}
                            onChange={e => setFormData({ ...formData, isAdult: e.target.checked })}
                            className="accent-[#ffb703] w-4 h-4 rounded cursor-pointer"
                          />
                          +18
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Temporadas / Episodios</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="3 Temp"
                          value={formData.seasons}
                          onChange={e => setFormData({ ...formData, seasons: e.target.value })}
                          className="w-1/2 bg-[#231436] border border-[#372054] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                        />
                        <input
                          type="text"
                          placeholder="30 Ep"
                          value={formData.episodes}
                          onChange={e => setFormData({ ...formData, episodes: e.target.value })}
                          className="w-1/2 bg-[#231436] border border-[#372054] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Sinopsis</label>
                  <textarea
                    rows={2}
                    placeholder="Descripción o resumen..."
                    value={formData.synopsis}
                    onChange={e => setFormData({ ...formData, synopsis: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>
              </>
            )}

            {/* CAMPOS IPTV EN VIVO */}
            {activeTab === 'iptv' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Nombre del Canal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: ESPN HD"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">URL Stream (M3U8/HLS/DASH) *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://... (M3U8)"
                    value={formData.streamUrl}
                    onChange={e => setFormData({ ...formData, streamUrl: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Categorías / Grupos *</label>
                  <input
                    type="text"
                    placeholder="Deportes, Noticias"
                    value={formData.categories}
                    onChange={e => setFormData({ ...formData, categories: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">URL Logo del Canal</label>
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    value={formData.logo}
                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">EPG ID (Guía TV)</label>
                  <input
                    type="text"
                    placeholder="espn.latin"
                    value={formData.epgId}
                    onChange={e => setFormData({ ...formData, epgId: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-gray-300 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAdult}
                      onChange={e => setFormData({ ...formData, isAdult: e.target.checked })}
                      className="accent-[#ffb703] w-4 h-4 rounded cursor-pointer"
                    />
                    Contenido Adultos (+18)
                  </label>
                </div>
              </div>
            )}

            {/* CAMPOS RADIOS */}
            {activeTab === 'radios' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Nombre de la Emisora *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: La Mega 99.7 FM"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">URL Stream Audio *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://... (AAC/MP3)"
                    value={formData.streamUrl}
                    onChange={e => setFormData({ ...formData, streamUrl: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Géneros / Categorías *</label>
                  <input
                    type="text"
                    placeholder="Pop, Rock, Reggaeton"
                    value={formData.categories}
                    onChange={e => setFormData({ ...formData, categories: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">URL Icono / Logo</label>
                  <input
                    type="url"
                    placeholder="https://.../radio.png"
                    value={formData.logo}
                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Frecuencia / Dial</label>
                  <input
                    type="text"
                    placeholder="99.7 FM"
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-semibold">País / Ciudad</label>
                  <input
                    type="text"
                    placeholder="Venezuela / Caracas"
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#231436] border border-[#372054] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#ffb703]"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#ffb703] hover:bg-amber-400 text-[#0d0714] font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                {editingId ? <Save size={16} /> : <Sparkles size={16} />}
                {editingId ? 'Actualizar Elemento' : 'Guardar Elemento'}
              </button>
            </div>
          </form>
        </div>

        {/* LISTADO CON BOTONES EDITAR Y ELIMINAR */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
            Listado de {getTabLabel()} ({itemsForCurrentTab.length})
          </h3>
        </div>

        {itemsForCurrentTab.length === 0 ? (
          <div className="bg-[#160d23] border border-[#372054] rounded-2xl p-12 text-center text-gray-500 text-xs">
            No hay elementos registrados en esta sección.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {itemsForCurrentTab.map(item => (
              <div 
                key={item.id} 
                className="group relative bg-[#1d112b] border border-[#372054] rounded-2xl overflow-hidden shadow-lg hover:border-[#ffb703] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-[#2d1b42] flex items-center justify-center">
                  <img 
                    src={item.poster || item.logo || item.backdrop || 'https://placehold.co/300x450/1d112b/ffb703?text=Sin+Imagen'} 
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

{/* Acciones Editar / Eliminar flotantes al pasar el cursor */}
                   <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
                     <button
                       onClick={() => handleStartEdit(item)}
                       className="p-2 bg-[#ffb703] hover:bg-amber-400 text-[#0d0714] font-bold rounded-xl shadow-lg cursor-pointer transition"
                       title="Editar Elemento"
                     >
                       <Edit3 size={14} />
                     </button>
                     <button
                       onClick={() => handleDeleteItem(item.id)}
                       className="p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-xl shadow-lg cursor-pointer transition"
                       title="Eliminar Elemento"
                     >
                       <Trash2 size={14} />
                     </button>
                     <button
                       onClick={() => setPreviewItem(item)}
                       className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg cursor-pointer transition flex items-center gap-1"
                       title="Probar Contenido"
                     >
                       <Play size={14} />
                       <span className="text-[10px] font-bold">Probar</span>
                     </button>
                   </div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-xs truncate text-white group-hover:text-[#ffb703] transition">{item.title}</h3>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{item.categories.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL CARGA MASIVA */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#160d23] border border-[#372054] rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-[#372054] pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="text-emerald-400" size={18} /> Carga Masiva JSON para <span className="text-[#ffb703]">{getTabLabel()}</span>
              </h3>
              <button 
                onClick={() => setShowBulkModal(false)}
                className="p-1 hover:bg-[#372054] rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              rows={9}
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              placeholder={`[\n  {\n    "title": "Ejemplo 1",\n    "categories": ["Acción", "Drama"],\n    "poster": "https://...",\n    "streamUrl": "https://..."\n  }\n]`}
              className="w-full bg-[#0d0714] border border-[#372054] rounded-xl p-4 text-xs font-mono text-emerald-400 placeholder-gray-600 outline-none focus:border-[#ffb703] mb-4"
            />

            {uploadStatus && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                uploadStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}>
                {uploadStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {uploadStatus.message}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:bg-[#231436] transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkUpload}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
              >
                Importar a {getTabLabel()}
              </button>
</div>
        </div>
      </div>
      )}

      {/* MODAL PREVIEW */}
      <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
}