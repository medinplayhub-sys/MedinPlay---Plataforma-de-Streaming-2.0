import React, { useState } from 'react';
import { AppSection, PlatformViewMode, UserAccount, UserProfile, CastDevice } from '../../types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  Film,
  Tv,
  Radio,
  ShieldAlert,
  Users,
  Search,
  Bell,
  Crown,
  Settings,
  Sparkles,
  Smartphone,
  ChevronDown,
  Lock,
  Unlock,
  Check,
  Plus,
  PlaySquare,
  Home,
  Cast,
  Download,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  activeSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  platformMode: PlatformViewMode;
  onPlatformChange: (mode: PlatformViewMode) => void;
  account: UserAccount;
  activeProfile: UserProfile;
  onSwitchProfile: (profileId: string) => void;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenSubscription: () => void;
  onOpenAdmin: () => void;
  onOpenCast?: () => void;
  onOpenDownloadApps?: () => void;
  activeCastDevice?: CastDevice | null;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  platformMode,
  onPlatformChange,
  account,
  activeProfile,
  onSwitchProfile,
  onOpenAuth,
  onOpenSearch,
  onOpenNotifications,
  onOpenSubscription,
  onOpenAdmin,
  onOpenCast,
  onOpenDownloadApps,
  activeCastDevice,
  unreadNotificationsCount,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  const navItems = [
    { id: 'home' as AppSection, label: 'Inicio', icon: Home },
    { id: 'movies' as AppSection, label: 'Películas', icon: Film },
    { id: 'series' as AppSection, label: 'Series', icon: PlaySquare },
    { id: 'iptv' as AppSection, label: 'IPTV en Vivo', icon: Tv, badge: 'EN VIVO', badgeColor: 'bg-red-500' },
    { id: 'radio' as AppSection, label: 'Radio', icon: Radio, badge: 'HD', badgeColor: 'bg-cyan-500' },
    {
      id: 'adult18' as AppSection,
      label: '+18 Adultos',
      icon: ShieldAlert,
      badge: activeProfile.isAdultUnlocked ? 'DESBLOQUEADO' : 'PIN',
      badgeColor: activeProfile.isAdultUnlocked ? 'bg-amber-500 text-black' : 'bg-rose-900/80 text-rose-300',
    },
    { id: 'community' as AppSection, label: 'Comunidad', icon: Users },
  ];

  return (
    <>
      {/* Desktop / Main Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-zinc-800/80 px-2 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onSelectSection('home')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 via-amber-600 to-red-600 rounded-lg flex items-center justify-center font-bold text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span className="font-serif italic font-extrabold text-base text-black">M</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-xl font-serif italic tracking-tight font-bold text-white group-hover:text-amber-400 transition-colors">
                    MedinPlay
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:block">
                  4K ULTRA LATENCY
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white border border-zinc-700 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? (item.id === 'adult18' ? 'text-red-400' : 'text-amber-400') : 'text-zinc-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-tighter ${
                        item.badge === 'EN VIVO' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Cast to TV Button */}
            {onOpenCast && (
              <button
                onClick={onOpenCast}
                className={`p-2 rounded-full transition-all relative ${
                  activeCastDevice
                    ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
                }`}
                title={activeCastDevice ? `Transmitiendo a ${activeCastDevice.name}` : 'Transmitir a TV'}
              >
                <Cast className="w-4 h-4" />
                {activeCastDevice && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                )}
              </button>
            )}

            {/* Download Apps Button */}
            {onOpenDownloadApps && (
              <button
                onClick={onOpenDownloadApps}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-all"
                title="Descargar Apps para Android, iOS y Smart TV"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Apps</span>
              </button>
            )}

            {/* PWA Install Button Header */}
            <PWAInstallButton variant="compact" />

            {/* AI Smart Search Pill */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-amber-500/50 hover:text-white text-xs font-medium transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Búsqueda IA</span>
              <Search className="w-3.5 h-3.5 text-zinc-400 sm:hidden" />
            </button>

            {/* VIP Plan Badge */}
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 hover:border-amber-500/50 text-xs font-semibold transition-all"
              title="Gestionar Suscripción"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline text-[11px]">
                {account.subscription.planId === 'ultra' ? 'Ultra VIP 4K' : account.subscription.planName}
              </span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
              title="Notificaciones Push"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Device Switcher Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all flex items-center gap-1"
                title="Simulador de Dispositivo"
              >
                <Smartphone className="w-4 h-4 text-zinc-300" />
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {showDeviceMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setShowDeviceMenu(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                    Modo de Dispositivo
                  </div>
                  <button
                    onClick={() => {
                      onPlatformChange('web');
                      setShowDeviceMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      platformMode === 'web' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>Web Desktop</span>
                    {platformMode === 'web' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onPlatformChange('android');
                      setShowDeviceMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      platformMode === 'android' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>App Android</span>
                    {platformMode === 'android' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onPlatformChange('ios');
                      setShowDeviceMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      platformMode === 'ios' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>App iOS (iPhone 16)</span>
                    {platformMode === 'ios' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onPlatformChange('tv');
                      setShowDeviceMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      platformMode === 'tv' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>Smart TV 4K</span>
                    {platformMode === 'tv' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-zinc-700 transition-all"
              >
                <img
                  src={activeProfile.avatarUrl}
                  alt={activeProfile.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
                <ChevronDown className="w-3 h-3 text-zinc-500 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-800 mb-1.5">
                    <p className="text-xs font-bold text-white truncate">{activeProfile.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate font-mono">{account.email}</p>
                  </div>

                  <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 py-1">
                    Cambiar de Perfil
                  </div>

                  {account.profiles.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => {
                        onSwitchProfile(prof.id);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                        prof.id === activeProfile.id
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <img src={prof.avatarUrl} alt={prof.name} className="w-6 h-6 rounded-full object-cover" />
                      <div className="flex-1 truncate">
                        <span>{prof.name}</span>
                        {prof.isKids && (
                          <span className="ml-1.5 text-[9px] bg-zinc-800 text-amber-400 border border-zinc-700 px-1 py-0.2 rounded font-bold">
                            KIDS
                          </span>
                        )}
                      </div>
                      {prof.id === activeProfile.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}

                  <div className="border-t border-zinc-800 my-1.5 pt-1.5 space-y-1">
                    <div className="px-1 py-1">
                      <PWAInstallButton variant="banner" />
                    </div>
                    {onOpenDownloadApps && (
                      <button
                        onClick={() => {
                          onOpenDownloadApps();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-zinc-300 hover:bg-zinc-900 flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Descargar Apps MedinPlay</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onOpenAuth();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-zinc-300 hover:bg-zinc-900 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Gestionar Cuenta Gmail</span>
                    </button>
                    {account.email?.toLowerCase().trim() === 'medinplayhub@gmail.com' ? (
                      <button
                        onClick={() => {
                          onOpenAdmin();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 font-bold flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Panel Admin (medinplayhub)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onOpenAdmin();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:bg-zinc-900 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Panel de Administración</span>
                        </div>
                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Admin Only</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin shortcut button (Only highlighted for medinplayhub@gmail.com) */}
            {account.email?.toLowerCase().trim() === 'medinplayhub@gmail.com' && (
              <button
                onClick={onOpenAdmin}
                className="p-2 rounded-full text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all hidden xl:block"
                title="Panel de Administración MedinPlay"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-2xl border-t border-zinc-800 px-2 py-1.5 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                {item.id === 'iptv' && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
        {/* +18 mobile shortcut */}
        <button
          onClick={() => onSelectSection('adult18')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeSection === 'adult18' ? 'text-red-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ShieldAlert className="w-5 h-5 text-red-500/80" />
          <span className="text-[10px] mt-0.5 tracking-tight">+18</span>
        </button>
      </div>
    </>
  );
};
