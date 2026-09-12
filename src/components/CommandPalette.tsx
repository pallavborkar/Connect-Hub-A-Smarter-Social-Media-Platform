import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Layers, 
  MessageSquare, 
  Users, 
  Image, 
  BarChart3, 
  Plus, 
  ArrowRight,
  X
} from 'lucide-react';
import { ActiveView } from '../types';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setActiveView, 
    posts, 
    tasks, 
    campaigns, 
    events, 
    teamMembers,
    setIsStudioModalOpen,
    setStudioInitialDraft
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  const quickNavigations = [
    { name: 'Dashboard Overview', icon: BarChart3, view: 'dashboard' as ActiveView, category: 'Navigation' },
    { name: 'AI Studio & Prompt Lab', icon: Sparkles, view: 'ai_assistant' as ActiveView, category: 'Navigation' },
    { name: 'Content Calendar', icon: Calendar, view: 'calendar' as ActiveView, category: 'Navigation' },
    { name: 'Events & Observances Radar', icon: Calendar, view: 'events' as ActiveView, category: 'Navigation' },
    { name: 'Content Approvals Workflow', icon: CheckSquare, view: 'approvals' as ActiveView, category: 'Navigation' },
    { name: 'Team Chat & Channels', icon: MessageSquare, view: 'chat' as ActiveView, category: 'Navigation' },
    { name: 'Performance Analytics', icon: BarChart3, view: 'analytics' as ActiveView, category: 'Navigation' },
    { name: 'Media Library & Assets', icon: Image, view: 'media' as ActiveView, category: 'Navigation' },
    { name: 'Campaign Manager', icon: Layers, view: 'campaigns' as ActiveView, category: 'Navigation' },
    { name: 'Team Roster & Roles', icon: Users, view: 'team' as ActiveView, category: 'Navigation' },
  ];

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        navs: quickNavigations.slice(0, 5),
        posts: posts.slice(0, 3),
        tasks: tasks.slice(0, 3),
        events: events.slice(0, 3),
      };
    }

    return {
      navs: quickNavigations.filter(n => n.name.toLowerCase().includes(q)),
      posts: posts.filter(p => p.title.toLowerCase().includes(q) || p.caption.toLowerCase().includes(q)),
      tasks: tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)),
      events: events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
    };
  }, [query, posts, tasks, events]);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="command-palette-backdrop"
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center p-4 pt-[12vh]"
        onClick={() => setIsCommandPaletteOpen(false)}
      >
        <motion.div
          id="command-palette-modal"
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
            <input
              id="command-palette-input"
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search posts, tasks, campaigns, events..."
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Quick Action Bar */}
          <div className="px-4 py-2 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Quick Actions:</span>
            <div className="flex items-center space-x-2">
              <button
                id="cmd-quick-post"
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setStudioInitialDraft(null);
                  setIsStudioModalOpen(true);
                }}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-1 font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Post</span>
              </button>
              <button
                id="cmd-quick-ai"
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setActiveView('ai_assistant');
                }}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-1 font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Prompt Lab</span>
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Navigations */}
            {filteredItems.navs.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1.5">Navigation & Tools</p>
                <div className="space-y-1">
                  {filteredItems.navs.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        id={`cmd-nav-${item.view}`}
                        onClick={() => {
                          setActiveView(item.view);
                          setIsCommandPaletteOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-sm group transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Posts */}
            {filteredItems.posts.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1.5">Posts & Content</p>
                <div className="space-y-1">
                  {filteredItems.posts.map(post => (
                    <button
                      key={post.id}
                      id={`cmd-post-${post.id}`}
                      onClick={() => {
                        setActiveView('calendar');
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-sm group transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div className="truncate">
                          <p className="font-medium truncate">{post.title}</p>
                          <p className="text-xs text-slate-400 truncate">{post.caption}</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 ml-2">
                        {post.status.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {filteredItems.tasks.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1.5">Tasks</p>
                <div className="space-y-1">
                  {filteredItems.tasks.map(task => (
                    <button
                      key={task.id}
                      id={`cmd-task-${task.id}`}
                      onClick={() => {
                        setActiveView('tasks');
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-sm group transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-medium truncate">{task.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 ml-2">Due {task.deadline}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {filteredItems.events.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1.5">Upcoming Events & Days</p>
                <div className="space-y-1">
                  {filteredItems.events.map(event => (
                    <button
                      key={event.id}
                      id={`cmd-event-${event.id}`}
                      onClick={() => {
                        setActiveView('events');
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-sm group transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="font-medium truncate">{event.title}</span>
                      </div>
                      <span className="text-xs text-rose-500 font-medium shrink-0 ml-2">
                        {event.daysAway === 0 ? 'Today' : event.daysAway > 0 ? `${event.daysAway}d away` : 'Past'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Navigation hint: Click any result or press ESC to dismiss</span>
            <span className="font-mono text-indigo-500">Socially v2.4</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
