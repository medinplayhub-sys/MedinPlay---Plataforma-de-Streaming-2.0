import React, { useState } from 'react';
import { UserSubscription, SubscriptionPlan } from '../../types';
import {
  Crown,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  X,
  Sparkles,
  Lock,
  Tv,
  Users,
  Film,
  Radio,
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: UserSubscription;
  onUpgradePlan: (plan: SubscriptionPlan, paymentMethod: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  onUpgradePlan,
}) => {
  if (!isOpen) return null;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(currentSubscription.planId || 'ultra');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'gpay' | 'paypal' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Plan Básico Gratuito',
      priceMonthly: 0,
      currency: 'USD',
      maxScreens: 1,
      maxQuality: '720p HD',
      hasLowLatency: false,
      hasOfflineDownload: false,
      hasAdultZone: false,
      hasFullIPTV: false,
      features: ['Calidad 720p HD', '1 Dispositivo a la vez', 'Catálogo VOD con anuncios', 'Radio Digital básica'],
    },
    {
      id: 'pro',
      name: 'Plan Pro HD 1080p',
      priceMonthly: 8.99,
      currency: 'USD',
      maxScreens: 2,
      maxQuality: '1080p Full HD',
      hasLowLatency: true,
      hasOfflineDownload: true,
      hasAdultZone: false,
      hasFullIPTV: true,
      features: [
        'Calidad 1080p Full HD',
        '2 Dispositivos simultáneos',
        'IPTV con canales internacionales',
        'Baja latencia streaming',
        'Sin anuncios comerciales',
      ],
    },
    {
      id: 'ultra',
      name: 'Plan Ultra VIP 4K Atmos',
      priceMonthly: 14.99,
      currency: 'USD',
      isPopular: true,
      maxScreens: 4,
      maxQuality: '4K Ultra HD 60fps',
      hasLowLatency: true,
      hasOfflineDownload: true,
      hasAdultZone: true,
      hasFullIPTV: true,
      features: [
        'Calidad 4K Ultra HD & Dolby Atmos',
        '4 Dispositivos simultáneos en 4K',
        'Ultra baja latencia (<140ms WebRTC)',
        'Acceso total a Zona Segura +18',
        'Guía EPG completa y Chat VIP',
        'Asistente de IA Gemini Pro',
      ],
    },
    {
      id: 'family',
      name: 'Plan Familiar Multi-Cuenta',
      priceMonthly: 19.99,
      currency: 'USD',
      maxScreens: 6,
      maxQuality: '4K Ultra HD + HDR10+',
      hasLowLatency: true,
      hasOfflineDownload: true,
      hasAdultZone: true,
      hasFullIPTV: true,
      features: [
        'Hasta 6 Perfiles independientes',
        'Control Parental PIN avanzado',
        'Descargas ilimitadas sin conexión',
        'Soporte prioritario 24/7',
        'Todos los beneficios Ultra VIP',
      ],
    },
  ];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const chosenPlan = plans.find((p) => p.id === selectedPlanId) || plans[2];

    setTimeout(() => {
      onUpgradePlan(chosenPlan, selectedPaymentMethod);
      setIsProcessing(false);
      setSuccessMessage(`¡Plan "${chosenPlan.name}" activado con éxito!`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c101c] border border-amber-500/30 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
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
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-0.5 rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> PLANES DE SUSCRIPCIÓN & PAGOS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
            Disfruta de Streaming 4K sin Límites ni Latencia
          </h2>
          <p className="text-xs text-slate-400">
            Sube de nivel para desbloquear 4K Ultra HD, canales IPTV premium, zona +18 y audio inmersivo Dolby Atmos.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isCurrent = currentSubscription.planId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-2xl p-4 flex flex-col justify-between space-y-4 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/20 border-amber-400 shadow-xl shadow-amber-500/10 scale-102 ring-2 ring-amber-400/40'
                    : 'bg-[#0d121f] border-white/10 hover:border-white/20'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                    MÁS POPULAR
                  </span>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">
                        ACTUAL
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-[11px] text-slate-400">/mes</span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Check className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30 font-extrabold'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {isCurrent ? 'Plan Actual' : isSelected ? 'Seleccionado' : 'Elegir Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment Methods Section */}
        <form onSubmit={handlePay} className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Métodos de Pago Seguros Integrados</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'card' as const, label: 'Tarjeta Crédito / Débito', icon: CreditCard },
              { id: 'gpay' as const, label: 'Google Pay / Apple Pay', icon: Zap },
              { id: 'paypal' as const, label: 'PayPal Instantáneo', icon: ShieldCheck },
              { id: 'crypto' as const, label: 'Criptomonedas (USDT)', icon: Sparkles },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedPaymentMethod(m.id)}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  selectedPaymentMethod === m.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <m.icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {selectedPaymentMethod === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-400 block mb-1">Número de Tarjeta:</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Vencimiento & CVC:</label>
                <input
                  type="text"
                  defaultValue="12/28 • 888"
                  className="w-full bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold text-center">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transacción cifrada con protocolo SSL de 256 bits y garantía de reembolso.</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold rounded-2xl text-xs shadow-xl shadow-amber-500/30 transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Procesando pago seguro...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 fill-current" />
                  <span>Activar Suscripción Ahora</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
