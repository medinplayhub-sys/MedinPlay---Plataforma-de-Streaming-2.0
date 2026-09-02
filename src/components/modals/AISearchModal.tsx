import React, { useState } from 'react';
import { ContentItem, IPTVChannel, UserProfile } from '../../types';
import { AIService, AISearchResult } from '../../services/aiService';
import {
  Sparkles,
  Search,
  BrainCircuit,
  Play,
  X,
  Zap,
  Flame,
  Film,
  Tv,
  Radio,
  Sliders,
  ChevronRight,
} from 'lucide-react';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: ContentItem[];
  iptvChannels: IPTVChannel[];
  activeProfile: UserProfile;
  onPlayItem: (item: ContentItem | IPTVChannel) => void;
}

export const AISearchModal: React.FC<AISearchModalProps> = ({
  isOpen,
  onClose,
  catalog,
  iptvChannels,
  activeProfile,
  onPlayItem,
}) => {
  const [query, setQuery] = useState('');
  const [useDeepThinking, setUseDeepThinking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<AISearchResult | null>(null);

  const samplePrompts = [
    'Quiero una película futurista cyberpunk con giros inesperados y atmósfera 4K',
    'Transmisión de deportes en vivo o acción trepidante para ver con amigos',
    'Una serie de misterio espacial profunda y reflexiva',
    'Música tranquila y relajante para trabajar concentrado',
  ];

  const handleSearch = async (queryText?: string) => {
    const textToSearch = queryText || query;
    if (!textToSearch.trim()) return;

    setIsLoading(true);
    const catalogSummary = catalog.map((c) => `${c.id}: ${c.title} (${c.genre.join(',')}) - ${c.synopsis}`).join('\n');

    const result = await AIService.searchSemantic(textToSearch, catalogSummary, useDeepThinking);
    setSearchResult(result);
    setIsLoading(false);
  };

  // Find matched items
  const matchedVOD = catalog.filter((c) => searchResult?.matchedContentIds.includes(c.id));
  const matchedIPTV = iptvChannels.filter((ch) => searchResult?.matchedContentIds.includes(ch.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c101c] border border-cyan-500/30 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> BÚSQUEDA SEMÁNTICA NEURONAL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
            Encuentra lo que deseas con Inteligencia Artificial
          </h2>
          <p className="text-xs text-slate-400">
            Describe tu estado de ánimo, lo que te apetece sentir, o pide recomendaciones complejas con lenguaje natural.
          </p>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ej: 'Una película con viajes en el tiempo, buena banda sonora y acción'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-black/60 border-2 border-cyan-500/40 focus:border-cyan-400 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/30 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Buscar</span>
                </>
              )}
            </button>
          </div>

          {/* Deep Thinking Mode Toggle */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useDeepThinking}
                onChange={(e) => setUseDeepThinking(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-cyan-400"
              />
              <span className="flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                <span>Modo Razonamiento Profundo (Gemini 3.1 Pro con Thinking Alto)</span>
              </span>
            </label>
            <span className="text-[11px] text-slate-500 hidden sm:inline">Análisis semántico avanzado</span>
          </div>
        </form>

        {/* Quick Sample Prompts */}
        {!searchResult && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              O prueba una de estas búsquedas guiadas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(p);
                    handleSearch(p);
                  }}
                  className="text-left text-xs bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 p-3 rounded-2xl text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{p}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {searchResult && (
          <div className="space-y-4 pt-2 border-t border-white/10 max-h-[50vh] overflow-y-auto pr-1">
            {/* AI Summary Banner */}
            <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Estado de Ánimo Detectado: <strong>{searchResult.mood}</strong></span>
                </span>
                <div className="flex items-center gap-1">
                  {searchResult.suggestedGenres.map((g) => (
                    <span key={g} className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{searchResult.aiRationale}"
              </p>
            </div>

            {/* Matched Content List */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Coincidencias en el Catálogo ({matchedVOD.length + matchedIPTV.length}):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedVOD.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onPlayItem(item);
                      onClose();
                    }}
                    className="bg-[#0d121f] border border-white/10 hover:border-cyan-400 rounded-2xl p-3 flex items-center gap-3 transition-all cursor-pointer group"
                  >
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-12 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold uppercase">
                          {item.type === 'movie' ? 'Película' : 'Serie'}
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold">★ {item.score}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{item.genre.join(', ')}</p>
                    </div>
                    <div className="p-2 bg-cyan-500 text-black rounded-xl shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                ))}

                {matchedIPTV.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onPlayItem(ch);
                      onClose();
                    }}
                    className="bg-[#0d121f] border border-white/10 hover:border-red-400 rounded-2xl p-3 flex items-center gap-3 transition-all cursor-pointer group"
                  >
                    <img
                      src={ch.logoUrl}
                      alt={ch.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded font-bold uppercase">
                        IPTV EN VIVO
                      </span>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors mt-0.5">
                        {ch.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{ch.currentProgram.title}</p>
                    </div>
                    <div className="p-2 bg-red-500 text-white rounded-xl shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
