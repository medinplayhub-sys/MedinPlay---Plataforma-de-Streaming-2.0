import React from 'react';
import { PlatformViewMode } from '../../types';
import { Wifi, Battery, Signal, Sparkles, Tv, Smartphone, Monitor, Tablet } from 'lucide-react';

interface DeviceFrameProps {
  mode: PlatformViewMode;
  onModeChange: (mode: PlatformViewMode) => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ mode, onModeChange, children }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (mode === 'web') {
    return <div className="w-full min-h-screen bg-[#050505] text-[#e0e0e0]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] py-4 px-2 sm:px-6 flex flex-col items-center justify-start">
      {/* Top Device Switcher Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 bg-[#0d0d0d] border border-zinc-800 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-xl z-50">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mr-2 px-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Simulador:
        </span>
        <button
          onClick={() => onModeChange('web')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            (mode as string) === 'web'
              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" /> Web Desktop
        </button>
        <button
          onClick={() => onModeChange('android')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            mode === 'android'
              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Android
        </button>
        <button
          onClick={() => onModeChange('ios')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            mode === 'ios'
              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> iOS
        </button>
        <button
          onClick={() => onModeChange('tablet')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            mode === 'tablet'
              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Tablet className="w-3.5 h-3.5 text-purple-400" /> Tablet
        </button>
        <button
          onClick={() => onModeChange('tv')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            mode === 'tv'
              ? 'bg-zinc-800 text-amber-400 border border-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Tv className="w-3.5 h-3.5 text-amber-400" /> Smart TV
        </button>
      </div>

      {/* Android Chassis */}
      {mode === 'android' && (
        <div className="relative w-full max-w-[412px] h-[870px] bg-[#000000] rounded-[48px] p-3 shadow-[0_0_60px_rgba(0,0,0,0.95)] border-[5px] border-zinc-800 overflow-hidden flex flex-col">
          {/* Top Speaker & Hole Punch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 rounded-full border border-zinc-800 z-50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
          </div>

          {/* Android Status Bar */}
          <div className="h-7 w-full flex items-center justify-between px-6 text-[11px] font-medium text-zinc-400 z-40 bg-black/80 backdrop-blur-sm select-none">
            <span>{currentTime}</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-1 bg-zinc-800 text-zinc-300 font-bold rounded">5G</span>
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">96%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Android Screen Viewport */}
          <div className="relative flex-1 bg-[#050505] rounded-[36px] overflow-y-auto overflow-x-hidden no-scrollbar">
            {children}
          </div>

          {/* Android Navigation Bar */}
          <div className="h-6 w-full flex items-center justify-center z-40 bg-black/90">
            <div className="w-24 h-1 bg-zinc-600 rounded-full" />
          </div>
        </div>
      )}

      {/* iOS Chassis (iPhone 16 Pro) */}
      {mode === 'ios' && (
        <div className="relative w-full max-w-[400px] h-[860px] bg-[#000000] rounded-[54px] p-3 shadow-[0_0_60px_rgba(0,0,0,0.95)] border-[5px] border-zinc-800 overflow-hidden flex flex-col">
          {/* Dynamic Island */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 border border-zinc-800 flex items-center justify-between px-2.5 shadow-lg">
            <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />
            <span className="text-[9px] font-mono text-zinc-400 tracking-wider">STREAMA</span>
            <div className="w-2 bg-green-500 rounded-full h-2 animate-pulse" />
          </div>

          {/* iOS Status Bar */}
          <div className="h-8 w-full flex items-center justify-between px-6 text-[12px] font-semibold text-zinc-400 z-40 bg-transparent select-none pt-1">
            <span className="pl-1">{currentTime}</span>
            <div className="flex items-center gap-1.5 pr-1">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* iOS Screen Viewport */}
          <div className="relative flex-1 bg-[#050505] rounded-[42px] overflow-y-auto overflow-x-hidden no-scrollbar pt-1">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-5 w-full flex items-center justify-center z-40 bg-black/60">
            <div className="w-32 h-1 bg-zinc-500 rounded-full" />
          </div>
        </div>
      )}

      {/* Tablet Chassis */}
      {mode === 'tablet' && (
        <div className="relative w-full max-w-[920px] h-[780px] bg-[#0d0d0d] rounded-[38px] p-4 shadow-[0_0_60px_rgba(0,0,0,0.95)] border-[6px] border-zinc-800 overflow-hidden flex flex-col">
          <div className="h-6 w-full flex items-center justify-between px-4 text-xs text-zinc-500 mb-1">
            <span className="font-semibold text-zinc-300">AetherPad Ultra Pro</span>
            <div className="flex items-center gap-3">
              <Wifi className="w-3.5 h-3.5" />
              <span>{currentTime}</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="relative flex-1 bg-[#050505] rounded-[24px] overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </div>
      )}

      {/* Smart TV Mode Chassis */}
      {mode === 'tv' && (
        <div className="relative w-full max-w-[1240px] bg-[#050505] rounded-3xl p-4 shadow-[0_0_80px_rgba(0,0,0,0.95)] border border-zinc-800 overflow-hidden">
          <div className="bg-zinc-900/60 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs text-zinc-300 font-medium mb-3 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">Modo Smart TV 4K Ultra HD (Interfaz 10-Foot)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300">Dolby Vision / Atmos</span>
              <span className="text-zinc-500 font-mono">Buffer: 100% (Ultra Low Latency)</span>
            </div>
          </div>
          <div className="relative overflow-y-auto max-h-[82vh] rounded-2xl">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
