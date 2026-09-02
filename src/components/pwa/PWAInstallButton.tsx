import React, { useState } from 'react';
import { Download, Smartphone, Check, Share, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'banner' | 'menu' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, isMobile, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstalledSuccess(true);
      }
    } else {
      // If native event hasn't fired yet or browser doesn't support beforeinstallprompt
      setShowIOSModal(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div
          className={`bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl backdrop-blur-md ${className}`}
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 text-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white">Instalar App MedinPlay</h4>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  PWA 4K
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Acceso directo en pantalla completa, canales IPTV y streaming sin barra del navegador.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all shrink-0 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar App MedinPlay</span>
          </button>
        </div>

        {/* iOS / Manual Guide Modal */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0f172a] border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Cómo Instalar MedinPlay</h3>
                <p className="text-xs text-slate-400">
                  Instala MedinPlay en tu pantalla de inicio para una experiencia inmersiva a pantalla completa:
                </p>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                  <span>Pulsa el botón de <strong>Compartir <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /></strong> en Safari o el menú <strong className="text-white">⋮</strong> en Chrome.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                  <span>Selecciona la opción <strong>"Añadir a la pantalla de inicio" <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /></strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                  <span>¡Listo! Abre MedinPlay directamente desde tu pantalla de inicio.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Navbar or Menu variant
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0 ${className}`}
        title="Instalar App MedinPlay en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5 text-black stroke-[2.5] shrink-0" />
        <span className="tracking-tight whitespace-nowrap hidden lg:inline">Instalar App MedinPlay</span>
        <span className="tracking-tight whitespace-nowrap lg:hidden">Instalar App</span>
      </button>

      {/* iOS Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Instalar App MedinPlay</h3>
              <p className="text-xs text-slate-400">
                Sigue estos pasos para tener MedinPlay como app nativa:
              </p>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                <span>Toca el botón <strong>Compartir <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /></strong> en Safari o el menú <strong className="text-white">⋮</strong> de tu navegador.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                <span>Toca <strong>"Añadir a la pantalla de inicio" <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /></strong></span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                <span>¡Disfruta en pantalla completa 4K sin barras de navegación!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
