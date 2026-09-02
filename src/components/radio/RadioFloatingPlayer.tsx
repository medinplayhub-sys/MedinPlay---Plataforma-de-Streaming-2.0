import React, { useRef, useState, useEffect } from 'react';
import { RadioStation } from '../../types';
import { Play, Pause, Volume2, VolumeX, Radio, X, Sparkles, Activity, Maximize2 } from 'lucide-react';

interface RadioFloatingPlayerProps {
  station: RadioStation | null;
  onClose: () => void;
  onOpenRadioSection: () => void;
}

export const RadioFloatingPlayer: React.FC<RadioFloatingPlayerProps> = ({
  station,
  onClose,
  onOpenRadioSection,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current && station?.streamUrl) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [station?.streamUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  if (!station) return null;

  return (
    <div className="fixed bottom-14 lg:bottom-4 right-2 sm:right-6 z-40 bg-[#0d121f]/95 border border-cyan-500/30 rounded-2xl shadow-2xl p-3 backdrop-blur-2xl max-w-sm sm:max-w-md w-full flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <audio
        ref={audioRef}
        src={station.streamUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      />

      {/* Station Logo & Track Details */}
      <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={onOpenRadioSection}>
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-cyan-500/30">
          <img src={station.logoUrl} alt={station.name} className="w-full h-full object-cover" />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-1 gap-0.5">
              <span className="w-1 bg-cyan-400 rounded-full animate-soundwave" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-cyan-400 rounded-full animate-soundwave" style={{ animationDelay: '200ms' }} />
              <span className="w-1 bg-cyan-400 rounded-full animate-soundwave" style={{ animationDelay: '400ms' }} />
              <span className="w-1 bg-cyan-400 rounded-full animate-soundwave" style={{ animationDelay: '100ms' }} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold uppercase">
              RADIO EN VIVO
            </span>
            <span className="text-[10px] text-slate-400 truncate">{station.bitrate}</span>
          </div>
          <h4 className="text-xs font-bold text-white truncate">{station.name}</h4>
          <p className="text-[11px] text-slate-400 truncate">
            {station.currentTrack.title} • {station.currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Controls & Volume */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-md shadow-cyan-500/30 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="text-slate-400 hover:text-white"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-14 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full transition-colors"
          title="Cerrar reproductor de radio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
