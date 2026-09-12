import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Eye, 
  CheckCircle2, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Youtube, 
  Share2,
  Building2,
  List,
  Grid,
  Columns,
  RotateCcw,
  Check
} from 'lucide-react';
import { ClientContentReviewModal } from './ClientContentReviewModal';
import { Post, SocialPlatform } from '../../types';

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  x: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Share2,
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  linkedin: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  x: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  facebook: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  youtube: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
};

export const ClientCalendarView: React.FC = () => {
  const { posts, activeClient, approvePost } = useApp();
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [selectedReviewPostId, setSelectedReviewPostId] = useState<string | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // August 2026

  const monthNames = [
    'January 2026', 'February 2026', 'March 2026', 'April 2026',
    'May 2026', 'June 2026', 'July 2026', 'August 2026',
    'September 2026', 'October 2026', 'November 2026', 'December 2026'
  ];

  // Calendar Days generator for August 2026 (starts Saturday, 31 days)
  const daysInMonth = 31;
  const startDayOffset = 6; // Saturday
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group posts by date
  const postsByDate = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const d = post.scheduledDate || '2026-08-15';
    if (!acc[d]) acc[d] = [];
    acc[d].push(post);
    return acc;
  }, {});

  const dates = Object.keys(postsByDate).sort();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Content Schedule & Calendar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              {activeClient?.name || 'Client Brand'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual publication timeline across all verified social channels.
          </p>
        </div>

        {/* View Mode Switcher & Month Navigation */}
        <div className="flex items-center space-x-3">
          {/* Month Stepper */}
          <div className="flex items-center space-x-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <button
              onClick={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-2">
              {monthNames[currentMonthIndex]}
            </span>
            <button
              onClick={() => setCurrentMonthIndex(prev => Math.min(11, prev + 1))}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Buttons (Month / Week / List) */}
          <div className="flex items-center space-x-1 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <button
              onClick={() => setCalendarViewMode('month')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calendarViewMode === 'month'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Month View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCalendarViewMode('week')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calendarViewMode === 'week'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Week View"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCalendarViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calendarViewMode === 'list'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MONTH VIEW GRID */}
      {calendarViewMode === 'month' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 text-center py-2.5 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Cells Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {/* Empty padding cells for start of month */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[110px] p-2 bg-slate-50/20 dark:bg-slate-950/20" />
            ))}

            {/* Actual day cells */}
            {days.map((day) => {
              const dayString = `2026-08-${String(day).padStart(2, '0')}`;
              const dayPosts = posts.filter(p => p.scheduledDate === dayString);
              const isToday = day === 16;

              return (
                <div 
                  key={day} 
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    isToday ? 'bg-purple-50/30 dark:bg-purple-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${
                      isToday 
                        ? 'w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {day}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                        {dayPosts.length}
                      </span>
                    )}
                  </div>

                  {/* Day Posts Mini Tags */}
                  <div className="space-y-1 my-1">
                    {dayPosts.map((post) => {
                      const Icon = PLATFORM_ICONS[post.platform] || Share2;
                      return (
                        <button
                          key={post.id}
                          onClick={() => setSelectedReviewPostId(post.id)}
                          className={`w-full text-left p-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 truncate border cursor-pointer ${
                            post.status === 'pending_review'
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                              : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          <Icon className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{post.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[9px] text-slate-400 text-right">
                    {dayPosts.length > 0 ? `${dayPosts[0].scheduledTime || '7:30 PM'}` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {calendarViewMode === 'week' && (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
          {['Sun, Aug 10', 'Mon, Aug 11', 'Tue, Aug 12', 'Wed, Aug 13', 'Thu, Aug 14', 'Fri, Aug 15', 'Sat, Aug 16'].map((dayHeader, idx) => {
            const dayString = `2026-08-${String(10 + idx).padStart(2, '0')}`;
            const dayPosts = posts.filter(p => p.scheduledDate === dayString);

            return (
              <div
                key={dayHeader}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col space-y-3 min-h-[300px]"
              >
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{dayHeader}</span>
                  <span className="text-[10px] font-bold text-purple-600">{dayPosts.length} posts</span>
                </div>

                <div className="space-y-2 flex-1">
                  {dayPosts.map((post) => {
                    const Icon = PLATFORM_ICONS[post.platform] || Share2;
                    return (
                      <div
                        key={post.id}
                        onClick={() => setSelectedReviewPostId(post.id)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer hover:border-purple-500 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-purple-600 flex items-center gap-1 capitalize">
                            <Icon className="w-3 h-3" />
                            {post.platform}
                          </span>
                          <span className="text-[9px] text-slate-400">{post.scheduledTime}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{post.title}</p>
                      </div>
                    );
                  })}

                  {dayPosts.length === 0 && (
                    <div className="h-full flex items-center justify-center text-center p-4">
                      <p className="text-[11px] text-slate-400">No broadcasts</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST / TIMELINE VIEW */}
      {calendarViewMode === 'list' && (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <CalendarIcon className="w-4 h-4 text-purple-600" />
                <span className="uppercase tracking-wider">{date}</span>
                <span className="px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px]">
                  {postsByDate[date].length} Posts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {postsByDate[date].map((post) => {
                  const Icon = PLATFORM_ICONS[post.platform] || Share2;
                  return (
                    <div
                      key={post.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize flex items-center gap-1 ${PLATFORM_COLORS[post.platform] || 'bg-slate-100'}`}>
                            <Icon className="w-3 h-3" />
                            {post.platform}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.scheduledTime}
                          </span>
                        </div>

                        {post.mediaUrl && (
                          <div className="h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {post.content}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          post.status === 'pending_review'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {post.status.replace('_', ' ')}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedReviewPostId(post.id)}
                          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Post</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal Trigger */}
      <ClientContentReviewModal
        postId={selectedReviewPostId}
        onClose={() => setSelectedReviewPostId(null)}
      />
    </div>
  );
};
