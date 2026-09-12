import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ClientMessage } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Check, 
  CheckCheck, 
  Building2, 
  Sparkles, 
  Smile, 
  FileText, 
  ExternalLink,
  Bot,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export const ClientMessagesView: React.FC = () => {
  const { 
    filteredClientMessages, 
    sendClientMessage, 
    activeClient, 
    isClientViewMode, 
    currentRole,
    posts,
    user 
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isClient = currentRole === 'client' || isClientViewMode;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredClientMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !mediaUrl) return;

    const attachedPost = posts.find(p => p.id === selectedPostId);

    sendClientMessage(
      messageText.trim(),
      mediaUrl || undefined,
      mediaUrl ? 'image' : undefined,
      undefined,
      attachedPost ? attachedPost.id : undefined,
      attachedPost ? attachedPost.title : undefined
    );

    setMessageText('');
    setMediaUrl('');
    setSelectedPostId('');
    setShowAttachMenu(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isClient ? 'Agency Direct Messaging' : 'Client Communication Channel'}
            </h1>
            {activeClient && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                {activeClient.name}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isClient
              ? `Real-time discussion with your dedicated Socially account manager (${activeClient?.assignedManager?.name || 'Aarav Sharma'}).`
              : `Official communication thread for ${activeClient?.name || 'the client'}. Note: Internal team chat is strictly private.`}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SLA Window: &lt; {activeClient?.slaHours || 24}h</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col h-[650px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        {/* Chat Room Banner */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={activeClient?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'} 
              alt="" 
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white" 
            />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {activeClient?.name || 'Client Hub'}
                <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">#official-thread</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Managed by {activeClient?.assignedManager?.name || 'Aarav Sharma'} • End-to-end encrypted client logs
              </p>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredClientMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No messages yet in this client thread</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Use this space to discuss upcoming campaigns, provide revision feedback on drafts, or ask questions.
              </p>
            </div>
          ) : (
            filteredClientMessages.map((msg) => {
              const isCurrentUser = msg.isFromClient === isClient;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <img 
                    src={msg.senderAvatar} 
                    alt={msg.senderName} 
                    className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                  />
                  <div className={`max-w-[75%] space-y-1 ${isCurrentUser ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {msg.senderRole}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Post context card if attached */}
                    {msg.postTitle && (
                      <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-left mb-1.5">
                        <div className="flex items-center space-x-1.5 text-purple-700 dark:text-purple-300 font-bold mb-0.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Regarding Draft: {msg.postTitle}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">Post ID: #{msg.postId}</p>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.mediaUrl && (
                        <div className="mt-2 rounded-xl overflow-hidden max-h-48 border border-white/20">
                          <img src={msg.mediaUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Read receipt */}
                    {isCurrentUser && (
                      <div className="flex items-center justify-end space-x-1 text-[10px] text-slate-400">
                        <CheckCheck className="w-3 h-3 text-purple-500" />
                        <span>Delivered</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          {/* Post Reference Selector */}
          {selectedPostId && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-xs text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Referencing: {posts.find(p => p.id === selectedPostId)?.title || selectedPostId}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPostId('')}
                className="text-[11px] font-bold hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Attach creative asset or reference draft"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {showAttachMenu && (
                <div className="absolute bottom-12 left-0 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2 z-20">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Attach Content</p>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Link Post Draft:
                    </label>
                    <select
                      value={selectedPostId}
                      onChange={(e) => setSelectedPostId(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="">None (General note)</option>
                      {posts.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Image URL (Optional):
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            <input
              id="client-message-input"
              type="text"
              placeholder={isClient ? "Type your question, revision feedback, or note..." : "Reply to client stakeholder..."}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />

            <button
              id="send-client-message-btn"
              type="submit"
              disabled={!messageText.trim() && !mediaUrl}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
