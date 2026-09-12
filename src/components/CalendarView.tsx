import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Share2,
  FileText,
  X
} from 'lucide-react';
import { Post, SocialPlatform, PostStatus } from '../types';
import { motion } from 'motion/react';

export const CalendarView: React.FC = () => {
  const { 
    posts, 
    events, 
    setIsStudioModalOpen, 
    setStudioInitialDraft, 
    updatePost, 
    showToast,
    formatDate,
    userTimezone,
    liveClock,
    currentTime
  } = useApp();

  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
  });
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [dayPopoverDate, setDayPopoverDate] = useState<{
    day: number;
    dateLabel: string;
    posts: Post[];
    events: any[];
  } | null>(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  const jumpToToday = () => {
    setCurrentMonth(new Date(currentTime.getFullYear(), currentTime.getMonth(), 1));
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate days for the active month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-indexed
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysArray.push(d);
  }

  // Current today in user timezone
  const todayYear = currentTime.getFullYear();
  const todayMonth = currentTime.getMonth();
  const todayDate = currentTime.getDate();

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const postPlatforms = Array.isArray(p.platforms) 
      ? p.platforms 
      : (p.platform ? [p.platform] : []);
    if (selectedPlatform !== 'all' && !postPlatforms.includes(selectedPlatform as SocialPlatform)) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    return true;
  });

  const getPostsForDay = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const datePrefix = `${year}-${formattedMonth}-${formattedDay}`;
    return filteredPosts.filter(p => p.scheduledDate.startsWith(datePrefix));
  };

  const getEventsForDay = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return events.filter(e => e.date === dateStr);
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return 'bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/30';
      case 'scheduled':
        return 'bg-white/10 text-white border-white/20';
      case 'approved':
        return 'bg-[#C8FF00]/15 text-[#C8FF00] border-[#C8FF00]/40';
      case 'pending_review':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'changes_requested':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-white/5 text-[#9A9A9A] border-white/10';
    }
  };

  return (
    <div id="calendar-view" className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#F5F5F0]">
      {/* Calendar Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold tracking-wider">
            [ BROADCAST MATRIX ]
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-1">
            Content Calendar
          </h1>
          <p className="font-mono-tag text-xs text-[#9A9A9A] mt-1">
            MULTI-CHANNEL CHRONOLOGICAL FEED OF REELS, CAROUSELS, AND CULTURAL OCCASIONS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Stepper */}
          <div className="flex items-center space-x-1.5 bg-[#111111] border border-white/10 rounded-lg p-1 shadow-xs">
            <button 
              onClick={jumpToToday} 
              className="px-2.5 py-1 font-mono-tag text-[10px] font-bold text-[#C8FF00] hover:bg-white/5 rounded transition-colors"
              title="Jump to Current Month"
            >
              TODAY
            </button>
            <div className="h-4 w-px bg-white/10" />
            <button onClick={prevMonth} className="p-1 rounded hover:bg-white/10 text-[#9A9A9A] hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono-tag text-xs font-bold text-white px-2 min-w-[130px] text-center uppercase">
              {monthName}
            </span>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-white/10 text-[#9A9A9A] hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Timezone pill */}
          <div className="hidden lg:flex items-center space-x-1 px-3 py-2 rounded-lg bg-[#111111] border border-white/10 font-mono-tag text-[10px] text-[#707070]">
            <span>{liveClock.tzAbbrev}</span>
            <span>({liveClock.tzOffset})</span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#111111] p-1 rounded-lg font-mono-tag text-xs font-bold text-[#9A9A9A] border border-white/10">
            {(['month', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded uppercase transition-all ${
                  viewMode === mode
                    ? 'bg-[#C8FF00] text-[#080808] font-bold'
                    : 'hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            id="calendar-create-post-btn"
            onClick={() => {
              setStudioInitialDraft(null);
              setIsStudioModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag text-xs font-bold rounded-lg shadow-md transition-all flex items-center space-x-1.5 active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#080808]" />
            <span>SCHEDULE POST →</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#111111] border border-white/10 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono-tag text-[10px] text-[#707070] font-bold uppercase flex items-center space-x-1">
            <Filter className="w-3 h-3 text-[#C8FF00]" />
            <span>PLATFORM:</span>
          </span>
          {['all', 'instagram', 'linkedin', 'facebook', 'youtube', 'x'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-2.5 py-1 rounded font-mono-tag text-[10px] uppercase font-bold transition-colors ${
                selectedPlatform === p
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'text-[#9A9A9A] hover:text-white hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono-tag text-[10px] text-[#707070] font-bold uppercase">STATUS:</span>
          {['all', 'scheduled', 'approved', 'pending_review', 'published'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2 py-0.5 rounded font-mono-tag text-[10px] uppercase font-bold transition-colors ${
                selectedStatus === st
                  ? 'bg-white text-[#080808]'
                  : 'text-[#707070] hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Month Grid View */}
      {viewMode === 'month' && (
        <div className="bg-[#111111] rounded-2xl border border-white/10 shadow-sm overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-white/10 text-center font-mono-tag text-[10px] font-bold uppercase text-[#707070] py-3 bg-[#151515]">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Grid cells */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/5">
              {daysArray.map((day, idx) => {
                if (!day) {
                  return <div key={idx} className="min-h-[110px] sm:min-h-[130px] bg-[#0A0A0A] p-2" />;
                }

                const dayPosts = getPostsForDay(day);
                const dayEvents = getEventsForDay(day);
                const isToday = day === todayDate && month === todayMonth && year === todayYear;

                return (
                  <div
                    key={idx}
                    className={`min-h-[110px] sm:min-h-[130px] p-2 sm:p-2.5 transition-colors relative flex flex-col justify-between group ${
                      isToday ? 'bg-[#C8FF00]/5 ring-1 ring-inset ring-[#C8FF00]/40' : 'hover:bg-white/5'
                    }`}
                  >
                    <div>
                      {/* Date Number & Quick Add Button */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`font-mono-tag text-xs font-bold w-6 h-6 rounded flex items-center justify-center ${
                            isToday
                              ? 'bg-[#C8FF00] text-[#080808] font-black'
                              : 'text-[#9A9A9A]'
                          }`}
                        >
                          {day}
                        </span>
                        <button
                          onClick={() => {
                            const formattedMonth = String(month + 1).padStart(2, '0');
                            const formattedDay = String(day).padStart(2, '0');
                            setStudioInitialDraft({
                              scheduledDate: `${year}-${formattedMonth}-${formattedDay}T10:00:00Z`,
                              title: `New Post for ${monthName.split(' ')[0]} ${day}`,
                            });
                            setIsStudioModalOpen(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#707070] hover:text-[#C8FF00] transition-opacity cursor-pointer"
                          title="Add post for this date"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Observance Event Tags & Scheduled Posts */}
                      {(() => {
                        const totalItems = dayEvents.length + dayPosts.length;
                        const maxVisible = 2;
                        let renderedCount = 0;

                        return (
                          <div className="space-y-1">
                            {/* Events first */}
                            {dayEvents.map(e => {
                              if (renderedCount >= maxVisible) return null;
                              renderedCount++;
                              return (
                                <div
                                  key={e.id}
                                  className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono-tag text-[9px] font-bold text-[#C8FF00] truncate"
                                  title={e.title}
                                >
                                  ★ {e.title}
                                </div>
                              );
                            })}

                            {/* Posts second */}
                            {dayPosts.map(p => {
                              if (renderedCount >= maxVisible) return null;
                              renderedCount++;
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => setSelectedPost(p)}
                                  className={`p-1.5 rounded border text-[11px] font-semibold cursor-pointer transition-all hover:scale-101 ${getStatusBadge(
                                    p.status
                                  )}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="truncate">{p.title}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 font-mono-tag text-[8px] opacity-75 mt-0.5">
                                    <Clock className="w-2.5 h-2.5 shrink-0" />
                                    <span>{formatDate(p.scheduledDate, 'time')}</span>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Overflow badge */}
                            {totalItems > maxVisible && (
                              <button
                                id={`calendar-day-overflow-btn-${day}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDayPopoverDate({
                                    day,
                                    dateLabel: `${monthName.split(' ')[0]} ${day}, ${year}`,
                                    posts: dayPosts,
                                    events: dayEvents,
                                  });
                                }}
                                className="w-full font-mono-tag text-[9px] font-bold text-[#C8FF00] hover:bg-[#C8FF00]/10 py-0.5 px-1 rounded bg-white/5 border border-white/10 transition-colors text-center mt-1 cursor-pointer"
                              >
                                +{totalItems - maxVisible} MORE
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-[#111111] rounded-2xl border border-white/10 shadow-sm divide-y divide-white/5">
          {filteredPosts.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedPost(p)}
              className="p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                {p.mediaUrl ? (
                  <img src={p.mediaUrl} alt={p.title} className="w-16 h-16 rounded-lg object-cover ring-1 ring-white/10 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#C8FF00] shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white">{p.title}</h4>
                    <span className={`px-2 py-0.5 rounded font-mono-tag text-[9px] font-bold uppercase border ${getStatusBadge(p.status)}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#9A9A9A] mt-1 line-clamp-2">{p.caption}</p>
                  <div className="mt-2 flex items-center space-x-4 font-mono-tag text-[10px] text-[#707070]">
                    <span>🕒 {formatDate(p.scheduledDate, 'datetime')}</span>
                    <span>📱 {Array.isArray(p.platforms) ? p.platforms.join(', ') : (p.platform || 'instagram')}</span>
                    <span>✍️ By {p.authorName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPost(p);
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-white/15 font-mono-tag text-[10px] font-bold text-white hover:bg-white/10"
                >
                  INSPECT →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Details Inspector Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto text-[#F5F5F0]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className={`px-2.5 py-1 rounded font-mono-tag text-xs font-bold uppercase border ${getStatusBadge(selectedPost.status)}`}>
                {selectedPost.status.replace('_', ' ')}
              </span>
              <button onClick={() => setSelectedPost(null)} className="p-1 text-[#707070] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedPost.mediaUrl && (
              <img
                src={selectedPost.mediaUrl}
                alt={selectedPost.title}
                className="w-full h-48 rounded-xl object-cover ring-1 ring-white/10"
              />
            )}

            <div>
              <h3 className="font-display text-lg font-bold text-white uppercase">{selectedPost.title}</h3>
              <p className="font-mono-tag text-[10px] text-[#707070] mt-0.5">
                SCHEDULED: {formatDate(selectedPost.scheduledDate, 'full')} ({userTimezone})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#181818] border border-white/10 text-xs whitespace-pre-line text-[#F5F5F0]">
              {selectedPost.caption}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedPost.tags?.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono-tag text-[9px] text-[#C8FF00]">
                  #{t}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  updatePost(selectedPost.id, { status: 'published' });
                  setSelectedPost(null);
                  showToast('Post Broadcasted!', 'Published live across selected channels.', 'success');
                }}
                className="px-4 py-2 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag text-xs font-bold rounded-lg"
              >
                PUBLISH NOW →
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono-tag text-xs font-bold rounded-lg"
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Day Events & Posts Modal */}
      {dayPopoverDate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#111111] rounded-2xl p-6 shadow-2xl border border-white/10 space-y-4 max-h-[85vh] overflow-y-auto text-[#F5F5F0]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-white uppercase">
                  SCHEDULED ITEMS ({dayPopoverDate.dateLabel})
                </h3>
                <p className="font-mono-tag text-[10px] text-[#707070]">
                  {dayPopoverDate.posts.length} POSTS • {dayPopoverDate.events.length} CULTURAL OBSERVANCES
                </p>
              </div>
              <button
                onClick={() => setDayPopoverDate(null)}
                className="p-1.5 text-[#707070] hover:text-white rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Events List */}
            {dayPopoverDate.events.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono-tag text-[10px] font-bold uppercase text-[#C8FF00]">
                  National / Cultural Moments
                </span>
                {dayPopoverDate.events.map(e => (
                  <div
                    key={e.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center space-x-2 text-xs font-bold text-[#C8FF00]"
                  >
                    <Sparkles className="w-4 h-4 text-[#C8FF00] shrink-0" />
                    <span>★ {e.title}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-2">
              <span className="font-mono-tag text-[10px] font-bold uppercase text-[#707070]">
                Scheduled Content
              </span>
              {dayPopoverDate.posts.length === 0 ? (
                <p className="text-xs text-[#707070] italic py-2">No scheduled posts for this date.</p>
              ) : (
                dayPopoverDate.posts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPost(p);
                      setDayPopoverDate(null);
                    }}
                    className={`p-3.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between hover:scale-101 transition-transform ${getStatusBadge(
                      p.status
                    )}`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">{p.title}</h4>
                      <p className="text-[11px] text-[#9A9A9A] line-clamp-1 mt-0.5">{p.caption}</p>
                      <div className="flex items-center space-x-3 font-mono-tag text-[9px] text-[#707070] mt-1">
                        <span>⏰ {formatDate(p.scheduledDate, 'time')}</span>
                        <span>📱 {(p.platforms || [p.platform]).join(', ')}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono-tag text-[9px] font-bold uppercase border bg-white/5">
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setStudioInitialDraft({
                    scheduledDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(dayPopoverDate.day).padStart(2, '0')}T10:00:00Z`,
                    title: `New Post for ${dayPopoverDate.dateLabel}`,
                  });
                  setIsStudioModalOpen(true);
                  setDayPopoverDate(null);
                }}
                className="px-4 py-2 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag text-xs font-bold rounded-lg flex items-center space-x-1"
              >
                <Plus className="w-4 h-4 text-[#080808]" />
                <span>ADD POST FOR THIS DAY →</span>
              </button>
              <button
                onClick={() => setDayPopoverDate(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono-tag text-xs font-bold rounded-lg"
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
