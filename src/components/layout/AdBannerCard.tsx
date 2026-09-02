import React, { useEffect } from 'react';
import { ExternalLink, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { AdBanner } from '../../types';
import { StorageService } from '../../services/storage';

interface AdBannerCardProps {
  banner: AdBanner;
  onAction?: (url: string) => void;
  className?: string;
  variant?: 'inline-feed' | 'horizontal-banner' | 'compact-card';
}

export const AdBannerCard: React.FC<AdBannerCardProps> = ({
  banner,
  onAction,
  className = '',
  variant = 'inline-feed',
}) => {
  useEffect(() => {
    StorageService.recordAdImpression(banner.id);
  }, [banner.id]);

  const handleClick = (e: React.MouseEvent) => {
    StorageService.recordAdClick(banner.id);
    if (onAction) {
      e.preventDefault();
      onAction(banner.targetUrl);
    }
  };

  if (!banner.active) return null;

  if (variant === 'horizontal-banner') {
    return (
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#0c0c0e] my-4 shadow-lg group hover:border-amber-500/40 transition-all ${className}`}
      >
        <div className="absolute inset-0">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-2.5 h-2.5" /> {banner.badge || 'Patrocinado'}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">MedinPlay Ads</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white font-serif italic">
              {banner.title}
            </h4>
            <p className="text-xs text-zinc-400 line-clamp-2">
              {banner.subtitle}
            </p>
          </div>

          <a
            href={banner.targetUrl}
            onClick={handleClick}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>{banner.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Default Inline Feed Card (fits in grid or list layout)
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d0d0f] shadow-md group hover:border-amber-500/40 transition-all flex flex-col justify-between ${className}`}
    >
      <div className="relative aspect-video sm:aspect-auto sm:h-36 w-full overflow-hidden bg-zinc-950">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-black/30" />
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> {banner.badge || 'Anuncio'}
          </span>
        </div>
        <div className="absolute top-2 right-2 text-[9px] font-mono text-zinc-500 bg-black/60 px-1.5 py-0.5 rounded">
          Sponsor
        </div>
      </div>

      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {banner.title}
          </h4>
          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
            {banner.subtitle}
          </p>
        </div>

        <a
          href={banner.targetUrl}
          onClick={handleClick}
          className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-center text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <span>{banner.ctaText}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
