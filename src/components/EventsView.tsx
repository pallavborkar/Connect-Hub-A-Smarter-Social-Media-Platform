import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarDays, 
  Sparkles, 
  Plus, 
  Bell, 
  BellRing, 
  Share2, 
  PenSquare, 
  Filter, 
  X,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventDay } from '../types';

export const EventsView: React.FC = () => {
  const { 
    events, 
    addCustomEvent, 
    toggleEventReminder, 
    setIsStudioModalOpen, 
    setStudioInitialDraft,
    showToast,
    formatDate,
    getEventCountdown,
    liveClock,
    userTimezone
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'indian' | 'global' | 'college' | 'custom'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(liveClock.isoDate || new Date().toISOString().slice(0, 10));
  const [newCategory, setNewCategory] = useState<'indian' | 'global' | 'college' | 'custom'>('college');
  const [newDesc, setNewDesc] = useState('');
  const [newIdeas, setNewIdeas] = useState('');

  const eventsWithCalculatedTimes = events.map(e => {
    const cd = getEventCountdown(e.date);
    return { ...e, cd };
  }).sort((a, b) => {
    if (a.cd.daysAway >= 0 && b.cd.daysAway < 0) return -1;
    if (a.cd.daysAway < 0 && b.cd.daysAway >= 0) return 1;
    return a.cd.daysAway - b.cd.daysAway;
  });

  const filteredEvents = eventsWithCalculatedTimes.filter(e => {
    if (activeCategory === 'all') return true;
    return e.category === activeCategory;
  });

  const handleCreateCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCustomEvent({
      title: newTitle,
      date: newDate,
      category: newCategory,
      description: newDesc || 'Custom workspace milestone event.',
      suggestedIdeas: newIdeas ? newIdeas.split(',').map(s => s.trim()) : ['Behind the scenes reel', 'Special brand story announcement'],
      reminderSet: true,
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewIdeas('');
  };

  return (
    <div id="events-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto text-[#F5F5F0]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">CALENDAR RADAR</span>
            <span className="text-xs text-[#9A9A9A] font-mono">TREND & OBSERVANCE TRACKING</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Important Days & Observances
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl font-mono">
            Cultural festivals, global holidays, and custom brand milestones with 1-click AI content ideation.
          </p>
        </div>

        <button
          id="add-custom-event-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-lime px-4 py-2.5 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
        >
          <Plus className="w-4 h-4 text-[#080808]" />
          <span>Add Custom Event</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Days' },
          { id: 'indian', label: 'Cultural & Festive' },
          { id: 'global', label: 'Global Observances' },
          { id: 'college', label: 'Brand & Community' },
          { id: 'custom', label: 'Custom Milestones' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#C8FF00] text-[#080808]'
                : 'bg-[#111111] text-[#9A9A9A] border border-white/5 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const isUrgent = evt.cd.daysAway >= 0 && evt.cd.daysAway <= 7;
          return (
            <motion.div
              key={evt.id}
              whileHover={{ y: -2 }}
              className={`p-6 rounded-2xl card-brivon flex flex-col justify-between space-y-4 border ${
                isUrgent ? 'border-[#C8FF00]/40 ring-1 ring-[#C8FF00]/20' : 'border-white/10'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tag text-[9px] px-2 py-0.5 rounded bg-white/5 text-[#9A9A9A] uppercase">
                    {evt.category}
                  </span>
                  <div className="flex items-center space-x-1.5 font-mono text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#C8FF00]" />
                    <span className={evt.cd.daysAway < 0 ? 'text-[#707070]' : isUrgent ? 'text-[#C8FF00] font-bold' : 'text-white'}>
                      {evt.cd.formatted}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-white">{evt.title}</h3>
                  <p className="text-xs font-mono text-[#707070] mt-0.5">{formatDate(evt.date)}</p>
                </div>

                <p className="text-xs font-mono text-[#9A9A9A] leading-relaxed">{evt.description}</p>

                {evt.suggestedIdeas && evt.suggestedIdeas.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#0D0D0D] border border-white/5 space-y-1.5">
                    <span className="font-mono-tag text-[9px] text-[#C8FF00] flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI ANGLE:</span>
                    </span>
                    <p className="text-xs font-mono text-[#F5F5F0]">"{evt.suggestedIdeas[0]}"</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => toggleEventReminder(evt.id)}
                  className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                    evt.reminderSet
                      ? 'bg-[#C8FF00]/10 border-[#C8FF00]/30 text-[#C8FF00]'
                      : 'bg-white/5 border-white/10 text-[#707070] hover:text-white'
                  }`}
                  title={evt.reminderSet ? 'Reminder Active' : 'Set Reminder'}
                >
                  <Bell className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setStudioInitialDraft({
                      title: evt.title,
                      caption: `Celebrating ${evt.title}! ${evt.suggestedIdeas?.[0] || ''}`,
                    });
                    setIsStudioModalOpen(true);
                  }}
                  className="btn-lime px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#080808]" />
                  <span>Draft Post</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Custom Event Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md card-brivon bg-[#111111] rounded-2xl p-6 shadow-2xl border border-white/10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-display font-extrabold text-white">Add Custom Milestone</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                    EVENT TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Annual Tech Symposium or Founders Day"
                    className="input-brivon w-full px-3 py-2.5 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                      DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="input-brivon w-full px-3 py-2 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="input-brivon w-full px-3 py-2 rounded-xl text-xs font-mono"
                    >
                      <option value="college" className="bg-[#111111] text-white">Brand / Campus</option>
                      <option value="custom" className="bg-[#111111] text-white">Custom Milestone</option>
                      <option value="indian" className="bg-[#111111] text-white">Cultural</option>
                      <option value="global" className="bg-[#111111] text-white">Global</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Key highlights and context..."
                    className="input-brivon w-full p-3 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 btn-secondary-dark py-2.5 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-lime py-2.5 text-xs font-bold cursor-pointer"
                  >
                    Save Event
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
