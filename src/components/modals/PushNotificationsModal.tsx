import React from 'react';
import { PushNotificationItem } from '../../types';
import {
  Bell,
  Sparkles,
  Tv,
  Film,
  Users,
  Check,
  X,
  Volume2,
  Trash2,
} from 'lucide-react';

interface PushNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onSelectNotificationItem?: (contentId?: string) => void;
}

export const PushNotificationsModal: React.FC<PushNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  onSelectNotificationItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c101c] border border-cyan-500/30 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 relative max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-cyan-400" /> NOTIFICACIONES PUSH
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-mono">Avisos y Estrenos</h2>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors pr-8 sm:pr-10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar todo</span>
            </button>
          )}
        </div>

        {/* List of notifications */}
        <div className="space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p>No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            notifications.map((notif: any) => {
              const isRead = notif.read ?? notif.isRead ?? false;
              const contentId = notif.targetContentId || notif.contentId;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    if (contentId && onSelectNotificationItem) {
                      onSelectNotificationItem(contentId);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    !isRead
                      ? 'bg-cyan-950/30 border-cyan-500/40'
                      : 'bg-white/5 border-white/10 hover:border-white/20 opacity-80'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                    {notif.type === 'premiere' ? (
                      <Film className="w-4 h-4" />
                    ) : notif.type === 'live' || notif.type === 'live_event' ? (
                      <Tv className="w-4 h-4 text-red-400" />
                    ) : notif.type === 'recommendation' || notif.type === 'ai_pick' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{notif.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
