import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Hash, 
  Send, 
  Smile, 
  Paperclip, 
  Image as ImageIcon, 
  Users, 
  Sparkles, 
  AtSign, 
  Search,
  MoreVertical,
  Heart,
  Flame,
  ThumbsUp,
  Plus,
  XCircle,
  Check,
  Bot,
  MessageSquare,
  Share2,
  X,
  ChevronDown
} from 'lucide-react';
import { ChatMessage, ChatChannel } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const TeamChatView: React.FC = () => {
  const { 
    teamMembers, 
    chatChannels, 
    chatMessages, 
    sendChatMessage, 
    addChatReaction, 
    addChatChannel, 
    user, 
    showToast,
    setStudioInitialDraft,
    setIsStudioModalOpen 
  } = useApp();

  const [activeChannelId, setActiveChannelId] = useState<string>(chatChannels[0]?.id || 'ch-general');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelTopic, setNewChannelTopic] = useState('');
  const [selectedEmojiMsgId, setSelectedEmojiMsgId] = useState<string | null>(null);
  const [isMobileChannelsOpen, setIsMobileChannelsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel: ChatChannel = chatChannels.find(c => c.id === activeChannelId) || chatChannels[0] || {
    id: 'ch-general',
    name: 'general',
    topic: 'Workspace announcements & general brainstorm',
    createdAt: '2026-08-01',
    membersCount: 8,
  };

  const rawMessages: ChatMessage[] = Array.isArray(chatMessages) 
    ? chatMessages 
    : (chatMessages[activeChannelId] || []);

  const channelMessages = searchQuery.trim()
    ? rawMessages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()) || m.senderName.toLowerCase().includes(searchQuery.toLowerCase()))
    : rawMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length, activeChannelId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendChatMessage(activeChannelId, messageText);
    setMessageText('');
  };

  const handleQuickAiPrompt = (promptText: string) => {
    sendChatMessage(activeChannelId, promptText);
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const formattedName = newChannelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    addChatChannel({
      name: formattedName,
      topic: newChannelTopic.trim() || 'Creative brainstorm & task sync',
    });

    setIsNewChannelModalOpen(false);
    setNewChannelName('');
    setNewChannelTopic('');
  };

  const quickReactions = ['👍', '🔥', '🚀', '💡', '❤️', '🙌'];

  return (
    <div id="team-chat-view" className="h-[calc(100vh-4.5rem)] flex flex-col md:flex-row overflow-hidden bg-[#080808] relative">
      {/* Channels Sidebar */}
      <div className={`w-full md:w-64 lg:w-72 border-r border-white/10 flex flex-col bg-[#0D0D0D] shrink-0 ${
        isMobileChannelsOpen ? 'flex absolute inset-0 z-30 bg-[#0D0D0D] md:relative' : 'hidden md:flex'
      }`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="font-mono-tag text-[9px] text-[#C8FF00] mb-0.5">COMMUNICATION</div>
            <h2 className="text-sm font-display font-bold text-white">Channels</h2>
          </div>

          <div className="flex items-center space-x-1">
            <button
              id="create-channel-btn"
              onClick={() => setIsNewChannelModalOpen(true)}
              className="p-1.5 rounded-lg bg-white/5 text-[#C8FF00] hover:bg-[#C8FF00]/10 border border-white/10 transition-colors cursor-pointer"
              title="Create channel"
            >
              <Plus className="w-4 h-4" />
            </button>
            {isMobileChannelsOpen && (
              <button
                id="close-mobile-channels-btn"
                onClick={() => setIsMobileChannelsOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-[#9A9A9A] hover:text-white bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="font-mono-tag text-[9px] text-[#707070]">CHANNELS ({chatChannels.length})</span>
          </div>

          {chatChannels.map((channel) => {
            const isActive = channel.id === activeChannelId;
            return (
              <button
                key={channel.id}
                id={`chat-channel-${channel.id}`}
                onClick={() => {
                  setActiveChannelId(channel.id);
                  setIsMobileChannelsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center justify-between transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#C8FF00] text-[#080808]'
                    : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Hash className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  <span className="truncate">{channel.name}</span>
                </div>
                {channel.unreadCount && channel.unreadCount > 0 ? (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    isActive ? 'bg-[#080808] text-[#C8FF00]' : 'bg-[#C8FF00] text-[#080808]'
                  }`}>
                    {channel.unreadCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Online Members Peek */}
        <div className="p-3 border-t border-white/10 bg-[#080808]">
          <div className="flex items-center justify-between text-[10px] font-mono-tag text-[#707070] mb-2">
            <span>ACTIVE CREW ({teamMembers.length})</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {teamMembers.map((m) => (
              <div key={m.id} className="flex items-center space-x-2 text-xs">
                <div className="relative">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-6 h-6 rounded-lg object-cover border border-white/10"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C8FF00] ring-1 ring-[#080808]" />
                </div>
                <div className="truncate flex-1">
                  <span className="font-medium text-[#F5F5F0] block truncate">{m.name}</span>
                </div>
                <span className="text-[9px] font-mono text-[#707070] uppercase">{m.role.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[#080808] overflow-hidden">
        {/* Channel Header */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0D0D0D]">
          <div className="flex items-center space-x-2 min-w-0">
            <button
              id="mobile-chat-channel-switcher"
              onClick={() => setIsMobileChannelsOpen(prev => !prev)}
              className="md:hidden flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white/5 text-white font-mono text-xs shrink-0"
            >
              <Hash className="w-3.5 h-3.5 text-[#C8FF00]" />
              <span className="truncate max-w-[110px]">{activeChannel.name}</span>
              <ChevronDown className="w-3 h-3 text-[#707070]" />
            </button>

            <div className="hidden md:flex items-center space-x-2 min-w-0">
              <Hash className="w-5 h-5 text-[#C8FF00] shrink-0" />
              <div className="min-w-0">
                <h3 className="font-display font-extrabold text-sm text-white truncate">#{activeChannel.name}</h3>
                <p className="text-[11px] font-mono text-[#707070] truncate max-w-md">{activeChannel.topic}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-[#707070] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="input-brivon pl-8 pr-3 py-1.5 rounded-xl text-xs w-36 lg:w-44 font-mono"
              />
            </div>

            <span className="text-xs font-mono text-[#C8FF00] flex items-center space-x-1 bg-[#C8FF00]/10 border border-[#C8FF00]/20 px-2.5 py-1 rounded-full shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
              <span className="hidden xs:inline">{teamMembers.length} Online</span>
              <span className="xs:hidden">{teamMembers.length}</span>
            </span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 text-center space-y-1 max-w-lg mx-auto">
            <h4 className="font-display font-bold text-xs text-white">
              Welcome to #{activeChannel.name}
            </h4>
            <p className="text-[11px] font-mono text-[#9A9A9A]">
              {activeChannel.topic}. All members can brainstorm, plan launches, and tag @AI for real-time copy assistance.
            </p>
          </div>

          {channelMessages.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#707070] font-mono">
              <MessageSquare className="w-8 h-8 mx-auto text-[#707070] mb-2" />
              <p>No messages yet in #{activeChannel.name}. Be the first to start the conversation!</p>
            </div>
          ) : (
            channelMessages.map((msg) => {
              const isMe = msg.senderId === user?.id || msg.senderName === user?.name;
              const isAi = msg.senderId === 'ai-agent';

              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start space-x-3 group relative hover:bg-white/5 p-2.5 rounded-2xl transition-colors ${
                    isAi ? 'bg-white/5 border border-[#C8FF00]/20' : ''
                  }`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className={`w-9 h-9 rounded-xl object-cover shrink-0 border ${
                      isAi ? 'border-[#C8FF00]' : 'border-white/10'
                    }`}
                  />
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-xs ${isAi ? 'text-[#C8FF00] flex items-center space-x-1 font-mono-tag' : 'text-white'}`}>
                        {isAi && <Sparkles className="w-3 h-3 text-[#C8FF00]" />}
                        <span>{msg.senderName}</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#707070]">{msg.timestamp}</span>
                      {isMe && (
                        <span className="text-[9px] font-mono-tag px-1.5 rounded bg-white/10 text-white">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-2xl whitespace-pre-wrap ${
                      isAi 
                        ? 'bg-[#151515] border border-white/10 text-[#F5F5F0]'
                        : isMe
                        ? 'bg-[#181818] border border-[#C8FF00]/20 text-[#F5F5F0]'
                        : 'bg-[#111111] border border-white/5 text-[#F5F5F0]'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Reactions display */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {msg.reactions && msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => addChatReaction(activeChannelId, msg.id, r.emoji)}
                          className="px-2 py-0.5 rounded-full bg-[#151515] hover:bg-white/10 text-[10px] font-mono text-[#F5F5F0] border border-white/10 transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}

                      {/* Add reaction trigger */}
                      <div className="relative inline-block">
                        <button
                          onClick={() => setSelectedEmojiMsgId(selectedEmojiMsgId === msg.id ? null : msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#707070] hover:text-white hover:bg-white/10 text-xs transition-opacity cursor-pointer"
                          title="Add reaction"
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>

                        {selectedEmojiMsgId === msg.id && (
                          <div className="absolute left-0 bottom-6 z-20 flex items-center space-x-1 p-1.5 bg-[#151515] rounded-xl shadow-xl border border-white/10">
                            {quickReactions.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  addChatReaction(activeChannelId, msg.id, emoji);
                                  setSelectedEmojiMsgId(null);
                                }}
                                className="p-1 hover:bg-white/10 rounded text-sm transition-transform hover:scale-125 cursor-pointer"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* AI Quick Prompt Pills */}
        <div className="px-4 py-2 bg-[#0D0D0D] border-t border-white/10 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="font-mono-tag text-[9px] text-[#C8FF00] flex items-center space-x-1 shrink-0">
            <Sparkles className="w-3 h-3" />
            <span>AI ACTIONS:</span>
          </span>
          <button
            onClick={() => handleQuickAiPrompt('@AI suggest 3 viral Instagram reel hooks for our product launch')}
            className="px-2.5 py-1 rounded-lg bg-[#151515] border border-white/10 hover:border-[#C8FF00] text-[#9A9A9A] hover:text-white font-mono text-[11px] shrink-0 transition-colors cursor-pointer"
          >
            💡 Reel hooks for launch
          </button>
          <button
            onClick={() => handleQuickAiPrompt('@AI generate high-converting hashtags and caption for our campaign')}
            className="px-2.5 py-1 rounded-lg bg-[#151515] border border-white/10 hover:border-[#C8FF00] text-[#9A9A9A] hover:text-white font-mono text-[11px] shrink-0 transition-colors cursor-pointer"
          >
            📸 Campaign caption & tags
          </button>
          <button
            onClick={() => handleQuickAiPrompt('@AI review our tone and positioning for LinkedIn thought leadership')}
            className="px-2.5 py-1 rounded-lg bg-[#151515] border border-white/10 hover:border-[#C8FF00] text-[#9A9A9A] hover:text-white font-mono text-[11px] shrink-0 transition-colors cursor-pointer"
          >
            💼 LinkedIn thought leadership
          </button>
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-white/10 bg-[#0D0D0D] shrink-0">
          <form onSubmit={handleSendMessage} className="space-y-2">
            <div className="relative">
              <input
                id="chat-message-input"
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Message #${activeChannel.name}... (Type @AI for intelligent assist)`}
                className="input-brivon w-full pl-4 pr-24 py-3 rounded-xl text-xs"
              />

              <div className="absolute right-2 top-2 flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMessageText((prev) => (prev ? `${prev} @AI ` : '@AI '));
                  }}
                  className="p-1.5 text-[#C8FF00] hover:bg-[#C8FF00]/10 rounded-lg text-xs font-bold transition-colors"
                  title="Mention AI assistant"
                >
                  <Bot className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2 btn-lime disabled:opacity-40 rounded-xl transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#080808]" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#707070] px-1">
              <span>Press <strong>Enter</strong> to send • Type <strong>@AI</strong> for generative assistance</span>
              <span>🔒 Encrypted Channel</span>
            </div>
          </form>
        </div>
      </div>

      {/* New Channel Modal */}
      <AnimatePresence>
        {isNewChannelModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md card-brivon bg-[#111111] rounded-2xl p-6 shadow-2xl border border-white/10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#151515] border border-white/10 text-[#C8FF00] flex items-center justify-center font-bold">
                    <Hash className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-display font-extrabold text-white">Create Channel</h3>
                </div>

                <button
                  onClick={() => setIsNewChannelModalOpen(false)}
                  className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateChannel} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                    CHANNEL NAME
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-[#707070] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="e.g. spring-launch or brand-reels"
                      className="input-brivon w-full pl-8 pr-3 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                    TOPIC / DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={newChannelTopic}
                    onChange={(e) => setNewChannelTopic(e.target.value)}
                    placeholder="e.g. Coordinating spring campaign assets & reels"
                    className="input-brivon w-full px-3 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewChannelModalOpen(false)}
                    className="flex-1 btn-secondary-dark py-2.5 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-lime py-2.5 text-xs font-bold cursor-pointer"
                  >
                    Create Channel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
