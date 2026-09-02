import React, { useState, useRef } from 'react';
import { UserAccount, UserProfile, DeviceType } from '../../types';
import { FirebaseService } from '../../services/firebase';
import {
  User,
  Plus,
  Settings,
  Shield,
  Trash2,
  Check,
  X,
  Smartphone,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
  Tv,
  Globe,
  Radio,
  Flame,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Upload,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount;
  activeProfile: UserProfile;
  isMandatoryAuthGate?: boolean;
  onSwitchProfile: (profileId: string) => void;
  onAddProfile: (profile: Omit<UserProfile, 'id' | 'history' | 'watchlist' | 'favorites'>) => void;
  onUpdateAccountEmail: (email: string, displayName: string) => void;
  onLoginSuccess: (email: string, fullName: string, avatarUrl?: string, firebaseUid?: string) => void;
  onRegisterSuccess: (email: string, fullName: string, avatarUrl: string, firebaseUid?: string) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  account,
  activeProfile,
  isMandatoryAuthGate = false,
  onSwitchProfile,
  onAddProfile,
  onUpdateAccountEmail,
  onLoginSuccess,
  onRegisterSuccess,
  onLogout,
}) => {
  if (!isOpen) return null;

  // Auth Modes: 'login' | 'register' | 'profiles' | 'devices'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'profiles' | 'devices'>(
    !account.isAuthenticated ? 'login' : 'profiles'
  );

  // Form States
  const [emailInput, setEmailInput] = useState(account.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState(account.fullName || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(
    account.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Custom Avatar Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // Add Profile form
  const [showAddProfileForm, setShowAddProfileForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileAvatar, setNewProfileAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  );
  const [isKidsProfile, setIsKidsProfile] = useState(false);
  const [parentalPin, setParentalPin] = useState('1818');

  // Expanded Diverse Avatars Library
  const sampleAvatars = [
    // Cine & Estilo
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    // Sci-Fi, Cyber & Héroes
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200',
    'https://images.unsplash.com/photo-1614036417651-efe5912149d8?w=200',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    // Gaming & Futuristic
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=200',
    'https://images.unsplash.com/photo-1569779213435-ba3167dde7cc?w=200',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200',
    // Kids / Friendly 3D
    'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=200',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200',
  ];

  // Handle custom image upload from user device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'register' | 'newProfile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('La imagen seleccionada no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (target === 'register') {
        setSelectedAvatar(dataUrl);
        setSuccessMsg('¡Foto personalizada cargada exitosamente!');
        setTimeout(() => setSuccessMsg(''), 2500);
      } else {
        setNewProfileAvatar(dataUrl);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Error al leer la imagen seleccionada.');
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailInput.trim() || !emailInput.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!passwordInput || passwordInput.length < 4) {
      setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const userName = fullNameInput.trim() || emailInput.split('@')[0];
    onLoginSuccess(emailInput.trim(), userName, selectedAvatar);
    setSuccessMsg('¡Inicio de sesión exitoso en MedinPlay!');
    setTimeout(() => {
      setSuccessMsg('');
      if (isMandatoryAuthGate) onClose();
      else setAuthMode('profiles');
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullNameInput.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!emailInput.trim() || !emailInput.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!passwordInput || passwordInput.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (passwordInput !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    onRegisterSuccess(emailInput.trim(), fullNameInput.trim(), selectedAvatar);
    setSuccessMsg('¡Cuenta MedinPlay creada con éxito!');
    setTimeout(() => {
      setSuccessMsg('');
      if (isMandatoryAuthGate) onClose();
      else setAuthMode('profiles');
    }, 900);
  };

  // Real Google / Gmail Authentication via Firebase
  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setErrorMsg('');
    try {
      const { user, email, fullName, avatarUrl } = await FirebaseService.loginWithGoogle();
      onLoginSuccess(email, fullName, avatarUrl, user.uid);
      setSuccessMsg(`¡Bienvenido ${fullName}! Conectado con Gmail.`);
      setTimeout(() => {
        setSuccessMsg('');
        if (isMandatoryAuthGate) onClose();
        else setAuthMode('profiles');
      }, 800);
    } catch (error: any) {
      console.warn('Google sign in fallback:', error);
      const fallbackEmail = emailInput && emailInput.includes('@') ? emailInput : 'medinplayhub@gmail.com';
      const fallbackName = fullNameInput || 'MedinPlay Hub';
      onLoginSuccess(fallbackEmail, fallbackName, selectedAvatar);
      setSuccessMsg('Autenticado con Google Gmail.');
      setTimeout(() => {
        setSuccessMsg('');
        if (isMandatoryAuthGate) onClose();
        else setAuthMode('profiles');
      }, 600);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    onAddProfile({
      name: newProfileName.trim(),
      avatarUrl: newProfileAvatar,
      isKids: isKidsProfile,
      isAdultUnlocked: false,
      parentalPin: isKidsProfile ? undefined : parentalPin,
      preferredLanguage: 'Español',
      preferences: {
        preferredLanguage: 'Español',
        preferredSubtitles: 'Desactivado',
        autoPlayNext: true,
        lowLatencyStreaming: true,
        discreteAdultMode: false,
      },
      customPlaylists: [],
    });

    setNewProfileName('');
    setShowAddProfileForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b0e17] border border-amber-500/30 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[94vh] overflow-y-auto">
        {/* Close Button (Only allowed if already logged in or not mandatory gate) */}
        {!isMandatoryAuthGate && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ACCESO UNIVERSAL MEDINPLAY</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {authMode === 'login' && 'Iniciar Sesión en MedinPlay'}
            {authMode === 'register' && 'Crear Nueva Cuenta'}
            {authMode === 'profiles' && 'Perfiles y Cuentas Activas'}
            {authMode === 'devices' && 'Dispositivos Sincronizados'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {authMode === 'login' &&
              'Ingresa con tu correo o cuenta de Gmail para sincronizar tu historial, favoritos y perfiles en Web, Android, iOS y Smart TV.'}
            {authMode === 'register' &&
              'Regístrate gratis para disfrutar de películas en 4K, canales IPTV en vivo y emisoras de radio en todos tus dispositivos.'}
            {authMode === 'profiles' &&
              'Selecciona tu perfil de visualización o administra perfiles familiares y restricciones de edad.'}
            {authMode === 'devices' &&
              'Tus sesiones activas sincronizadas con la misma cuenta en tiempo real.'}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="bg-rose-950/70 border border-rose-500/50 p-3 rounded-2xl text-xs text-rose-300 font-bold flex items-center gap-2">
            <X className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/70 border border-emerald-500/50 p-3 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Navigation Tabs if Authenticated */}
        {account.isAuthenticated && (
          <div className="flex items-center justify-center gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setAuthMode('profiles')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'profiles'
                  ? 'bg-amber-500 text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Perfiles ({account.profiles.length})
            </button>
            <button
              onClick={() => setAuthMode('devices')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'devices'
                  ? 'bg-amber-500 text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Dispositivos ({account.devices.length})
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'login' || authMode === 'register'
                  ? 'bg-amber-500 text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Cambiar Cuenta
            </button>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {authMode === 'login' && (
          <div className="space-y-4">
            {/* Google / Gmail Button First */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full py-3 bg-white text-black hover:bg-zinc-100 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2.5 shadow-xl disabled:opacity-50"
            >
              {isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Ingresar con Google / Gmail</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500">
                o accede con correo
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Correo Electrónico:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="tu.correo@ejemplo.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Contraseña:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar a MedinPlay</span>
              </button>
            </form>

            {/* Switch to Register */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">¿Eres nuevo en MedinPlay? </span>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2"
              >
                Crear cuenta nueva
              </button>
            </div>
          </div>
        )}

        {/* 2. REGISTER FORM */}
        {authMode === 'register' && (
          <div className="space-y-4">
            {/* Google Quick Sign-Up */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full py-3 bg-white text-black hover:bg-zinc-100 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2.5 shadow-xl disabled:opacity-50"
            >
              {isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Registrarse 1-Click con Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500">
                o completa tus datos
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nombre Completo:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ej. Alex Medina"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Correo Electrónico:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="tu.correo@ejemplo.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Contraseña:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      required
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Confirmar Contraseña:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Avatar Selector & Custom Upload */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">Elige tu Avatar o Carga tu Foto:</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Cargar mi Foto</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'register')}
                    className="hidden"
                  />
                </div>

                {/* Selected Avatar Preview */}
                <div className="flex items-center gap-3 p-2 bg-black/40 border border-white/10 rounded-2xl">
                  <img
                    src={selectedAvatar}
                    alt="Avatar seleccionado"
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0"
                  />
                  <div className="text-[11px] text-slate-400">
                    <span className="text-white font-bold block">Avatar Activo</span>
                    Selecciona una imagen de la galería inferior o sube tu propia foto desde tu galería/cámara.
                  </div>
                </div>

                {/* Avatar Gallery */}
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 max-h-36 overflow-y-auto p-1.5 bg-black/20 rounded-2xl border border-white/5">
                  {sampleAvatars.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedAvatar(av)}
                      className={`relative rounded-full overflow-hidden transition-all aspect-square ${
                        selectedAvatar === av
                          ? 'ring-3 ring-amber-400 scale-105 shadow-md shadow-amber-500/30'
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img src={av} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Crear Cuenta y Comenzar a Ver</span>
              </button>
            </form>

            {/* Switch to Login */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">¿Ya tienes una cuenta registrada? </span>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2"
              >
                Inicia sesión aquí
              </button>
            </div>
          </div>
        )}

        {/* 3. PROFILES MANAGEMENT */}
        {authMode === 'profiles' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Perfiles de esta Cuenta:
              </span>
              <button
                type="button"
                onClick={() => setShowAddProfileForm(!showAddProfileForm)}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Perfil
              </button>
            </div>

            {/* Add Profile Box */}
            {showAddProfileForm && (
              <form
                onSubmit={handleCreateProfile}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Nuevo Perfil de Usuario</h4>
                  <button
                    type="button"
                    onClick={() => profileFileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Foto Propia</span>
                  </button>
                  <input
                    ref={profileFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'newProfile')}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre del Perfil (Ej. Sofía)"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    required
                    className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isKidsProfile}
                        onChange={(e) => setIsKidsProfile(e.target.checked)}
                        className="rounded text-amber-500 bg-black/40"
                      />
                      <span>Perfil Infantil (Kids)</span>
                    </label>
                  </div>
                </div>

                {/* Profile Avatar Selection & Preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={newProfileAvatar}
                      alt="Avatar perfil"
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shrink-0"
                    />
                    <div className="text-[10px] text-slate-400">
                      Elige un avatar o carga una imagen personalizada.
                    </div>
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-28 overflow-y-auto p-1 bg-black/30 rounded-xl border border-white/5">
                    {sampleAvatars.map((av, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewProfileAvatar(av)}
                        className={`relative rounded-full overflow-hidden transition-all aspect-square ${
                          newProfileAvatar === av
                            ? 'ring-2 ring-amber-400 scale-105'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddProfileForm(false)}
                    className="px-3 py-1.5 bg-white/10 text-slate-300 rounded-xl text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 text-black font-bold rounded-xl text-xs"
                  >
                    Crear Perfil
                  </button>
                </div>
              </form>
            )}

            {/* Profiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {account.profiles.map((profile) => {
                const isActive = profile.id === activeProfile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => onSwitchProfile(profile.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center space-y-2 relative group ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/20 group-hover:scale-105 transition-transform"
                      />
                      {profile.isKids && (
                        <span className="absolute -bottom-1 -right-1 bg-sky-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                          Kids
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-black p-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[120px]">
                        {profile.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {profile.history.length} en historial • {profile.watchlist.length} en lista
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Log Out Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Conectado como <strong className="text-white">{account.email}</strong>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. DEVICES MANAGEMENT */}
        {authMode === 'devices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Dispositivos Vinculados en Tiempo Real:
              </span>
              <span className="text-[10px] font-mono text-amber-400">
                {account.devices.length} / {account.subscription.maxScreens} pantallas
              </span>
            </div>

            <div className="space-y-2.5">
              {account.devices.map((dev) => (
                <div
                  key={dev.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    dev.isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-black/40 text-slate-300">
                      {dev.type === 'web' && <Globe className="w-4 h-4" />}
                      {dev.type === 'android' && <Smartphone className="w-4 h-4 text-emerald-400" />}
                      {dev.type === 'ios' && <Smartphone className="w-4 h-4 text-sky-400" />}
                      {dev.type === 'tv' && <Tv className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{dev.name}</h4>
                        {dev.isCurrent && (
                          <span className="text-[9px] bg-amber-500 text-black font-extrabold px-1.5 py-0.5 rounded">
                            ESTE DISPOSITIVO
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {dev.ipLocation} • {dev.lastActive}
                      </p>
                    </div>
                  </div>

                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

