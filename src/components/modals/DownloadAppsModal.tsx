import React, { useState } from 'react';
import {
  Smartphone,
  Tv,
  Monitor,
  Download,
  QrCode,
  CheckCircle2,
  X,
  ShieldCheck,
  Sparkles,
  Layers,
  Users,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AppDownloadOption } from '../../types';

interface DownloadAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppsModal: React.FC<DownloadAppsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const downloads: AppDownloadOption[] = StorageService.getAppDownloads();
  const [selectedPlatform, setSelectedPlatform] = useState<'android' | 'ios' | 'androidtv' | 'smarttv'>('android');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentOption = downloads.find((d) => d.platform === selectedPlatform) || downloads[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentOption.downloadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0c0c0e] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif italic">
                Descargar Apps MedinPlay
              </h3>
              <p className="text-xs text-zinc-400">
                Disfruta de la mejor experiencia en todos tus dispositivos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="px-5 pt-4 pb-2 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedPlatform('android')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPlatform === 'android'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Android (APK)</span>
          </button>
          <button
            onClick={() => setSelectedPlatform('ios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPlatform === 'ios'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setSelectedPlatform('androidtv')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPlatform === 'androidtv'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>Android TV / Fire TV</span>
          </button>
          <button
            onClick={() => setSelectedPlatform('smarttv')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPlatform === 'smarttv'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-purple-400" />
            <span>Samsung & LG TV</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Main Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-center space-y-3">
              <div className="p-2.5 bg-white rounded-xl shadow-md">
                <img
                  src={currentOption.qrCodeUrl}
                  alt={`QR Descarga ${currentOption.title}`}
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-zinc-200 flex items-center justify-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-amber-400" /> Escanea con tu cámara
                </span>
                <p className="text-[10px] text-zinc-500">Descarga directa en tu móvil</p>
              </div>
            </div>

            {/* Right Details Container */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold rounded font-mono">
                    {currentOption.packageType}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {currentOption.version} • {currentOption.size}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                  {currentOption.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {currentOption.description}
                </p>
              </div>

              {/* Feature Bullets */}
              <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Características de esta versión:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {currentOption.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href={currentOption.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Instalador</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '¡Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cross-Platform Account Sync Banner */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Sincronización Total de Cuentas MedinPlay</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No necesitas crear una nueva cuenta. Inicia sesión con tus mismas credenciales (Gmail o Correo) en cualquier app de MedinPlay y accederás de inmediato a tu <strong>historial de reproducción, listas de películas y series, canales IPTV favoritos y perfiles familiares</strong> en tiempo real.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paquete firmado y verificado con SHA-256 • DRM Widevine L1 Ready</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-zinc-300 hover:text-white font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
