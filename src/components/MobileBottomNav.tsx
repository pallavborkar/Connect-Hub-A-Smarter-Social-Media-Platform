import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Plus, 
  Sparkles, 
  Menu,
  CheckSquare
} from 'lucide-react';
import { motion } from 'motion/react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    setIsStudioModalOpen, 
    setStudioInitialDraft,
    setIsMobileDrawerOpen,
    unreadNotificationsCount,
    posts,
    tasks
  } = useApp();

  const pendingApprovalsCount = posts.filter(p => p.status === 'pending_review').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'in_progress').length;
  const totalBadges = unreadNotificationsCount + pendingApprovalsCount + inProgressTasksCount;

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-lg border-t border-[#E2E8F0] dark:border-slate-800 px-2 py-1.5 shadow-md safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Dashboard / Home */}
        <button
          id="mobile-nav-dashboard"
          onClick={() => {
            setActiveView('dashboard');
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'dashboard'
              ? 'text-[#4F46E5] dark:text-indigo-400 font-bold'
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-slate-200 font-medium'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Calendar */}
        <button
          id="mobile-nav-calendar"
          onClick={() => {
            setActiveView('calendar');
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'calendar'
              ? 'text-[#4F46E5] dark:text-indigo-400 font-bold'
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-slate-200 font-medium'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Calendar</span>
        </button>

        {/* Floating Quick Compose Button - Create */}
        <button
          id="mobile-nav-compose"
          onClick={() => {
            setStudioInitialDraft(null);
            setIsStudioModalOpen(true);
          }}
          className="relative -top-3.5 p-3 rounded-2xl bg-[#F97360] hover:bg-[#E0523D] text-white shadow-md active:scale-95 transition-transform flex items-center justify-center cursor-pointer ring-4 ring-white dark:ring-[#111827]"
          aria-label="Create new post"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* AI Assistant */}
        <button
          id="mobile-nav-ai"
          onClick={() => {
            setActiveView('ai_assistant');
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'ai_assistant' || activeView === 'ai_prompts' || activeView === 'ai_analyzer'
              ? 'text-[#4F46E5] dark:text-indigo-400 font-bold'
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-slate-200 font-medium'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-[#4F46E5] dark:text-indigo-400" />
          <span className="text-[10px]">AI</span>
        </button>

        {/* More */}
        <button
          id="mobile-nav-menu-toggle"
          onClick={() => setIsMobileDrawerOpen(prev => !prev)}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-slate-200 font-medium transition-all cursor-pointer"
        >
          <div className="relative">
            <Menu className="w-5 h-5 mb-0.5" />
            {totalBadges > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F97360] rounded-full ring-2 ring-white dark:ring-[#111827]" />
            )}
          </div>
          <span className="text-[10px]">More</span>
        </button>
      </div>
    </nav>
  );
};
