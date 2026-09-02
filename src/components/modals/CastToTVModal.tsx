import React, { useState, useEffect } from 'react';
import {
  Tv,
  Cast,
  Airplay,
  Wifi,
  CheckCircle2,
  X,
  Volume2,
  RefreshCw,
  Smartphone,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { CastDevice, ContentItem, IPTVChannel, RadioStation } from '../../types';
import { StorageService } from '../../services/storage';

interface CastToTVModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem?: ContentItem | IPTVChannel | RadioStation | null;
  activeCastDevice: CastDevice | null;
  onConnectCast: (device: CastDevice) => void;
  onDisconnectCast: () => void;
}

export const CastToTVModal: React.FC<CastToTVModalProps> = ({
  isOpen,
  onClose,
  currentItem,
  activeCastDevice,
  onConnectCast,
  onDisconnectCast,
}) => {
  const [devices, setDevices] = useState<CastDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [tvVolume, setTvVolume] = useState(85);

  useEffect(() => {
    if (isOpen) {
      setDevices(StorageService.getCastDevices());
    }
  }, [isOpen]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDevices(StorageService.getCastDevices());
      setIsScanning(false);
    }, 1200);
  };

  const handlePairByPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 6) {
      setPinError('El código PIN debe tener 6 dígitos numéricos mostrados en tu TV.');
      return;
    }
    setPinError('');
    setPinSuccess(true);
    const newTv: CastDevice = {
      id: `tv-pin-${Date.now()}`,
      name: `Smart TV Emparejada (PIN ${pinCode})`,
      type: 'tizen',
      location: 'Dispositivo Vinculado',
      ip: '192.168.1.200',
      status: 'available',
      icon: 'tv',
    };
    const updated = [newTv, ...devices];
    setDevices(updated);
    StorageService.saveCastDevices(updated);
    setTimeout(() => {
      onConnectCast(newTv);
      setPinSuccess(false);
      setPinCode('');
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0c0c0e] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cast className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif italic flex items-center gap-2">
                Transmitir a Smart TV
              </h3>
              <p className="text-xs text-zinc-400">
                Google Cast, AirPlay, Samsung Tizen & LG webOS
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

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Active Connection Widget */}
          {activeCastDevice ? (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Tv className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Transmitiendo en Vivo
                    </span>
                    <h4 className="text-sm font-bold text-white">{activeCastDevice.name}</h4>
                  </div>
                </div>
                <button
                  onClick={onDisconnectCast}
                  className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-500/30 transition-all"
                >
                  Desconectar
                </button>
              </div>

              {currentItem && (
                <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-300">
                  <Radio className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
                  <span className="truncate font-medium">
                    {('title' in currentItem ? currentItem.title : currentItem.name)}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono ml-auto">4K HDR</span>
                </div>
              )}

              {/* Volume & Remote Controls */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-300" /> Volumen TV
                  </span>
                  <span className="font-mono text-white">{tvVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tvVolume}
                  onChange={(e) => setTvVolume(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  Dispositivos en red local
                </span>
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Buscando...' : 'Escanear Red'}</span>
                </button>
              </div>

              {/* Device List */}
              <div className="space-y-2">
                {devices.map((device) => {
                  const isConnected = activeCastDevice?.id === device.id;
                  return (
                    <div
                      key={device.id}
                      onClick={() => onConnectCast(device)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isConnected
                          ? 'bg-emerald-950/30 border-emerald-500/50'
                          : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                          {device.type === 'airplay' ? (
                            <Airplay className="w-5 h-5 text-indigo-400" />
                          ) : device.type === 'chromecast' ? (
                            <Cast className="w-5 h-5 text-blue-400" />
                          ) : (
                            <Tv className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{device.name}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                            <span>{device.location}</span>
                            <span>•</span>
                            <span className="font-mono">{device.ip}</span>
                          </div>
                        </div>
                      </div>

                      <button className="px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all">
                        {isConnected ? 'Conectado' : 'Conectar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pair via TV 6-Digit PIN Code */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>¿No ves tu televisor? Emparejar por código PIN</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Abre la app <strong>MedinPlay TV</strong> en tu Smart TV y digita el código de 6 dígitos que aparece en pantalla para vincular tu cuenta sin escribir contraseñas.
            </p>

            <form onSubmit={handlePairByPin} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Ej: 839201"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md"
              >
                Emparejar TV
              </button>
            </form>

            {pinError && <p className="text-xs text-red-400">{pinError}</p>}
            {pinSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> ¡Televisor vinculado y transmitiendo con éxito!
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cifrado E2E DRM Widevine & FairPlay
          </span>
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
