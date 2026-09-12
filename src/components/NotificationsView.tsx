import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Check, 
  Sparkles, 
  Calendar, 
  Share2, 
  MessageSquare, 
  CheckSquare, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    unreadNotificationsCount,
    setStudioInitialDraft,
    setIsStudioModalOpen,
    setActiveView
  } = useApp();

  return (
    <div id="notifications-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto text-[#F5F5F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">ACTIVITY PULSE</span>
            {unreadNotificationsCount > 0 && (
              <span className="font-mono-tag text-[9px] px-2 py-0.5 rounded bg-[#C8FF00] text-[#080808] font-bold">
                {unreadNotificationsCount} NEW
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Notifications & AI Signals
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 font-mono">
            Real-time activity alerts, AI event opportunities, approvals, and team chat mentions.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            id="notif-page-mark-all-read"
            onClick={markAllNotificationsRead}
            className="btn-secondary-dark px-4 py-2 text-xs font-mono font-semibold flex items-center space-x-2 transition-colors shrink-0 cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#C8FF00]" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="card-brivon rounded-2xl border border-white/10 divide-y divide-white/10 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-[#707070] space-y-2">
            <Bell className="w-8 h-8 mx-auto text-[#707070]" />
            <p className="font-mono text-sm text-[#9A9A9A]">No notifications right now.</p>
            <p className="text-xs font-mono text-[#707070]">Your inbox is clear and all pending alerts have been acknowledged.</p>
          </div>
        ) : (
          notifications.map(n => {
            const isAi = n.type === 'ai_suggestion';
            return (
              <div
                key={n.id}
                className={`p-4 sm:p-6 flex items-start space-x-4 transition-colors ${
                  !n.isRead ? 'bg-white/5' : 'hover:bg-white/5'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${isAi ? 'bg-[#C8FF00]' : 'bg-white'}`}
                  style={{ opacity: n.isRead ? 0.2 : 1 }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className={`text-sm font-bold ${isAi ? 'text-[#C8FF00] font-mono-tag' : 'text-white'}`}>
                      {n.title}
                    </h3>
                    <span className="text-[11px] text-[#707070] font-mono">{n.timestamp}</span>
                  </div>

                  <p className="text-xs text-[#9A9A9A] leading-relaxed max-w-2xl font-mono">{n.message}</p>

                  {n.aiSuggestedIdea && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#151515] border border-[#C8FF00]/30 text-xs space-y-2 max-w-xl">
                      <p className="font-bold text-[#C8FF00] font-mono">
                        💡 AI Proposed Angle: {n.aiSuggestedIdea.hook}
                      </p>
                      <p className="text-[#F5F5F0] italic font-mono text-[11px]">
                        "{n.aiSuggestedIdea.caption}"
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {n.aiSuggestedIdea.hashtags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 mt-3">
                    {n.aiSuggestedIdea && (
                      <button
                        onClick={() => {
                          setStudioInitialDraft({
                            title: n.title,
                            caption: n.aiSuggestedIdea?.caption || '',
                            hashtags: n.aiSuggestedIdea?.hashtags || [],
                          });
                          setIsStudioModalOpen(true);
                          markNotificationRead(n.id);
                        }}
                        className="btn-lime px-3 py-1.5 text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#080808]" />
                        <span>Compose Post</span>
                      </button>
                    )}

                    {!n.isRead && (
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="text-xs text-[#707070] hover:text-white font-mono flex items-center space-x-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
