import React, { useState } from 'react';
import { ContentItem, IPTVChannel, UserProfile } from '../../types';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  KeyRound,
  AlertTriangle,
  Play,
  Tv,
  Film,
  Check,
  Zap,
} from 'lucide-react';

interface Adult18SectionProps {
  catalog: ContentItem[];
  iptvChannels: IPTVChannel[];
  activeProfile: UserProfile;
  onUnlockAdult: (pin: string) => boolean;
  onLockAdult: () => void;
  onPlayItem: (item: ContentItem | IPTVChannel) => void;
}

export const Adult18Section: React.FC<Adult18SectionProps> = ({
  catalog,
  iptvChannels,
  activeProfile,
  onUnlockAdult,
  onLockAdult,
  onPlayItem,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isDiscreetMode, setIsDiscreetMode] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);

  const adultMovies = catalog.filter((i) => i.isAdult);
  const adultChannels = iptvChannels.filter((ch) => ch.isAdult);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedAge) {
      setPinError('Debes confirmar que eres mayor de 18 años.');
      return;
    }

    const success = onUnlockAdult(pinInput);
    if (success) {
      setPinError('');
      setPinInput('');
    } else {
      setPinError('PIN de seguridad incorrecto. Intenta con "1818" o el configurado en tu perfil.');
    }
  };

  // If locked or profile is Kids
  if (!activeProfile.isAdultUnlocked || activeProfile.isKids) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-[#0f1017] border-2 border-rose-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-xl">
          <div className="w-16 h-16 bg-rose-600/20 border border-rose-500 rounded-2xl mx-auto flex items-center justify-center text-rose-500 shadow-lg shadow-rose-600/30">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] bg-rose-600/20 text-rose-300 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              ZONA SEGURA RESTRINGIDA (+18)
            </span>
            <h2 className="text-2xl font-black text-white mt-3 font-mono">Control Parental & Verificación</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Esta sección contiene contenido exclusivo para adultos. Por seguridad y privacidad, ingresa tu PIN parental para desbloquear la sesión actual.
            </p>
          </div>

          {activeProfile.isKids ? (
            <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl text-xs text-rose-300">
              <p className="font-bold">⚠️ Perfil Infantil Activo</p>
              <p className="text-[11px] text-slate-400 mt-1">
                El perfil "{activeProfile.name}" tiene restricciones activadas. Cambia a un perfil de adulto para acceder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUnlockSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Ingresa PIN Parental de 4 dígitos:</span>
                  <span className="text-[10px] text-cyan-400 font-mono">PIN por defecto: 1818</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="• • • •"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-center text-lg tracking-[0.5em] font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Age confirmation checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={confirmedAge}
                  onChange={(e) => setConfirmedAge(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-black/40 text-rose-500 focus:ring-rose-500"
                />
                <span>Declaro bajo juramento tener 18 años o más y acepto los términos de visualización para adultos.</span>
              </label>

              {pinError && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
                  {pinError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-2xl text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
              >
                Desbloquear Contenido +18
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // If unlocked, show adult catalog
  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner with Privacy & Discrete Toggle */}
      <div className="bg-gradient-to-r from-rose-950/60 via-[#0d121f] to-amber-950/40 border border-rose-500/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> +18 DESBLOQUEADO
              </span>
              <span className="text-xs text-rose-300 font-mono">Modo Seguro Activo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-mono">
              Catálogo Exclusivo +18 Adultos
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Películas, series y canales IPTV para adultos con streaming de ultra baja latencia y modo de privacidad instantánea.
            </p>
          </div>

          {/* Privacy & Lock Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDiscreetMode(!isDiscreetMode)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isDiscreetMode
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              {isDiscreetMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isDiscreetMode ? 'Modo Discreto: ACTIVO' : 'Modo Discreto'}</span>
            </button>

            <button
              onClick={onLockAdult}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/30 border border-rose-500/50 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Bloquear Sección</span>
            </button>
          </div>
        </div>
      </div>

      {/* IPTV Adult Channels */}
      <div className="space-y-3.5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Tv className="w-5 h-5 text-rose-500" />
          <span>Canales IPTV en Vivo (+18)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adultChannels.map((ch) => (
            <div
              key={ch.id}
              onClick={() => onPlayItem(ch)}
              className="bg-[#0d121f] border border-rose-500/20 hover:border-rose-500/50 rounded-2xl p-4 shadow-lg transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 ${
                    isDiscreetMode ? 'filter blur-md' : ''
                  }`}
                >
                  <img src={ch.logoUrl} alt={ch.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">
                      +18 LIVE
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">CH {ch.channelNumber}</span>
                  </div>
                  <h3
                    className={`text-sm font-bold text-white group-hover:text-rose-400 transition-colors ${
                      isDiscreetMode ? 'filter blur-xs' : ''
                    }`}
                  >
                    {ch.name}
                  </h3>
                  <span className="text-xs text-slate-400">{ch.currentProgram.title}</span>
                </div>
              </div>

              <button className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition-transform active:scale-95">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Adult Movies & Series VOD */}
      <div className="space-y-3.5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-rose-500" />
          <span>Películas & Series +18 VOD</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {adultMovies.map((item) => (
            <div
              key={item.id}
              onClick={() => onPlayItem(item)}
              className="group relative bg-[#0d121f] border border-rose-500/20 hover:border-rose-500/50 rounded-2xl overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div
                className={`relative aspect-[2/3] w-full overflow-hidden bg-slate-900 ${
                  isDiscreetMode ? 'filter blur-xl' : ''
                }`}
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                  +18 ADULTO
                </div>
                <div className="absolute top-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                  {item.quality}
                </div>
              </div>

              <div className="p-3">
                <h3
                  className={`text-xs font-bold text-white truncate group-hover:text-rose-400 transition-colors ${
                    isDiscreetMode ? 'filter blur-xs' : ''
                  }`}
                >
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.genre.join(', ')}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-white/5">
                  <span>{item.year}</span>
                  <span className="text-amber-400 font-bold">★ {item.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
