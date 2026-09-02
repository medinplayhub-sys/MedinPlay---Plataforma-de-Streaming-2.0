import React, { useState } from 'react';
import {
  ContentReview,
  WatchPartyRoom,
  UserProfile,
  ContentItem,
} from '../../types';
import {
  Users,
  MessageSquare,
  Star,
  Share2,
  Tv,
  Send,
  Heart,
  QrCode,
  Copy,
  Check,
  Sparkles,
  Plus,
  Play,
} from 'lucide-react';

interface CommunitySectionProps {
  reviews: ContentReview[];
  watchParties: WatchPartyRoom[];
  catalog: ContentItem[];
  activeProfile: UserProfile;
  onAddReview: (review: Omit<ContentReview, 'id' | 'createdAt' | 'likesCount'>) => void;
  onCreateWatchParty: (title: string, contentId: string, hostName: string) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  reviews,
  watchParties,
  catalog,
  activeProfile,
  onAddReview,
  onCreateWatchParty,
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'parties' | 'share'>('reviews');

  // Review Form
  const [selectedContentId, setSelectedContentId] = useState(catalog[0]?.id || 'm1');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Watch Party Form
  const [partyTitle, setPartyTitle] = useState('');
  const [partyContentId, setPartyContentId] = useState(catalog[0]?.id || 'm1');

  // Social Share
  const [shareContentId, setShareContentId] = useState(catalog[0]?.id || 'm1');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    onAddReview({
      contentId: selectedContentId,
      userId: activeProfile.id,
      userName: activeProfile.name,
      userAvatar: activeProfile.avatarUrl,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewComment('');
  };

  const handlePartySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyTitle.trim()) return;

    onCreateWatchParty(partyTitle.trim(), partyContentId, activeProfile.name);
    setPartyTitle('');
  };

  const selectedShareItem = catalog.find((i) => i.id === shareContentId) || catalog[0];
  const shareUrl = `${window.location.origin}/#stream=${selectedShareItem?.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Community Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-[#0d121f] to-cyan-950/40 border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Comunidad Global & Watch Parties
              </span>
              <span className="text-xs text-slate-400">Sincronización Multi-Dispositivo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-mono">
              Comunidad Cinéfila, Salas Compartidas y Reseñas
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Mira estrenos en tiempo real con amigos, comparte opiniones con estrellas y genera enlaces directos con código QR.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Reseñas ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('parties')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'parties'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Watch Parties ({watchParties.length})
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'share'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Compartir & QR
            </button>
          </div>
        </div>
      </div>

      {/* Tab: Reviews */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Review Card */}
          <div className="bg-[#0d121f] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-4 h-fit">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Publicar tu Reseña</span>
            </h2>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Selecciona Película o Serie:
                </label>
                <select
                  value={selectedContentId}
                  onChange={(e) => setSelectedContentId(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  {catalog.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title} ({i.year})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Calificación:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-amber-400 p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-slate-700'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-2">{reviewRating} de 5 Estrellas</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tu Opinión y Crítica:</label>
                <textarea
                  rows={3}
                  placeholder="¿Qué te pareció la trama, la fotografía o el sonido? Escribe tu reseña..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar Crítica</span>
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-3.5">
            <h2 className="text-base font-bold text-white">Últimas Críticas de la Comunidad</h2>

            <div className="space-y-3">
              {reviews.map((rev) => {
                const targetContent = catalog.find((i) => i.id === rev.contentId);

                return (
                  <div
                    key={rev.id}
                    className="bg-[#0d121f] border border-white/[0.08] rounded-2xl p-4 shadow-lg space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover border border-indigo-500/30"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{rev.userName}</h4>
                          <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                        </div>
                      </div>

                      {targetContent && (
                        <span className="text-[11px] bg-white/5 px-2.5 py-1 rounded-lg text-indigo-300 border border-white/5 font-semibold">
                          {targetContent.title}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Watch Parties */}
      {activeTab === 'parties' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Party Card */}
          <div className="bg-[#0d121f] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-4 h-fit">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>Crear Sala Watch Party</span>
            </h2>

            <form onSubmit={handlePartySubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre de la Sala:</label>
                <input
                  type="text"
                  placeholder="Ej. Maratón Cyberpunk con Amigos"
                  value={partyTitle}
                  onChange={(e) => setPartyTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Contenido a Sincronizar:</label>
                <select
                  value={partyContentId}
                  onChange={(e) => setPartyContentId(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {catalog.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Abrir Sala en Vivo</span>
              </button>
            </form>
          </div>

          {/* Active Parties List */}
          <div className="lg:col-span-2 space-y-3.5">
            <h2 className="text-base font-bold text-white">Salas Activas en Vivo</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {watchParties.map((room) => {
                const content = catalog.find((i) => i.id === room.contentId) || catalog[0];

                return (
                  <div
                    key={room.id}
                    className="bg-[#0d121f] border border-white/[0.08] hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                          SALA EN VIVO
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {room.participantsCount} Conectados
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-2">{room.title}</h3>
                      <p className="text-xs text-cyan-400 font-semibold">{content.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Anfitrión: {room.hostName}</p>
                    </div>

                    <button className="w-full py-2 bg-white/10 hover:bg-cyan-500 hover:text-black text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Unirme a la Sala</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Share & Mobile QR Handoff */}
      {activeTab === 'share' && (
        <div className="bg-[#0d121f] border border-white/[0.08] rounded-3xl p-6 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Share2 className="w-10 h-10 text-cyan-400 mx-auto" />
            <h2 className="text-xl font-bold text-white font-mono">Compartir & Sincronización Móvil</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Escanea el código QR desde tu celular o tableta para continuar viendo al instante en la aplicación móvil de AetherStream sin interrupciones.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">Selecciona Contenido:</label>
            <select
              value={shareContentId}
              onChange={(e) => setShareContentId(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {catalog.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title} ({i.year})
                </option>
              ))}
            </select>
          </div>

          {/* QR Code and Links */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Real SVG-style QR code */}
            <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`}
                alt="QR Handoff"
                className="w-36 h-36"
              />
              <span className="text-[10px] text-black font-bold mt-1 uppercase tracking-tight">
                Escanear con App
              </span>
            </div>

            <div className="space-y-3 flex-1">
              <h4 className="text-sm font-bold text-white">{selectedShareItem.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{selectedShareItem.synopsis}</p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Mira ${selectedShareItem.title} en 4K en AetherStream! ${shareUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[11px] text-center transition-all"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Disfrutando de ${selectedShareItem.title} en @AetherStream!`)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-[11px] text-center transition-all"
                >
                  X / Twitter
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Mira ${selectedShareItem.title} en ultra baja latencia`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-[11px] text-center transition-all"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
