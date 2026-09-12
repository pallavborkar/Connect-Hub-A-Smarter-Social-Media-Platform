import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { SocialAccountsView } from './components/SocialAccountsView';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { EventsView } from './components/EventsView';
import { ContentStudioView } from './components/ContentStudioView';
import { AIAssistantView } from './components/AIAssistantView';
import { AIContentAnalyzerView } from './components/AIContentAnalyzerView';
import { AIPromptGeneratorView } from './components/AIPromptGeneratorView';
import { MediaLibraryView } from './components/MediaLibraryView';
import { CampaignsView } from './components/CampaignsView';
import { ApprovalsView } from './components/ApprovalsView';
import { TasksView } from './components/TasksView';
import { TeamChatView } from './components/TeamChatView';
import { TeamView } from './components/TeamView';
import { SettingsView } from './components/SettingsView';
import { NotificationsView } from './components/NotificationsView';
import { PricingView } from './components/PricingView';
import { ClientsView } from './components/clients/ClientsView';
import { BrandAssetsView } from './components/clients/BrandAssetsView';
import { ClientMessagesView } from './components/clients/ClientMessagesView';
import { MonthlyReportsView } from './components/clients/MonthlyReportsView';
import { ClientPortalDashboard } from './components/client_portal/ClientPortalDashboard';
import { ClientApprovalsView } from './components/client_portal/ClientApprovalsView';
import { ClientContentView } from './components/client_portal/ClientContentView';
import { ClientCalendarView } from './components/client_portal/ClientCalendarView';
import { ClientCampaignsView } from './components/client_portal/ClientCampaignsView';
import { ClientAnalyticsView } from './components/client_portal/ClientAnalyticsView';
import { ClientProfileView } from './components/client_portal/ClientProfileView';
import { UpgradeModal } from './components/UpgradeModal';
import { CheckoutModal } from './components/CheckoutModal';
import { EnterpriseModal } from './components/EnterpriseModal';
import { GoogleSignInGate } from './components/GoogleSignInGate';
import { LandingPage } from './components/LandingPage';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ToastContainer } from './components/ToastContainer';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    isAuthenticated,
    activeView, 
    isStudioModalOpen, 
    setIsStudioModalOpen 
  } = useApp();

  // Google Sign In Identity Verification Gate at Starting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#F5F5F0] font-sans selection:bg-[#C8FF00] selection:text-[#080808]">
        <GoogleSignInGate />
        <ToastContainer />
      </div>
    );
  }

  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-[#080808] text-[#F5F5F0] selection:bg-[#C8FF00] selection:text-[#080808] font-sans">
        <LandingPage />
        <AuthModal />
        <OnboardingWizard />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div id="socially-app-root" className="flex h-screen w-full bg-[#080808] text-[#F5F5F0] overflow-hidden font-sans selection:bg-[#C8FF00] selection:text-[#080808]">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-[#080808]">
        <TopHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#080808] pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'clients' && <ClientsView />}
              {activeView === 'brand_assets' && <BrandAssetsView />}
              {activeView === 'client_messages' && <ClientMessagesView />}
              {activeView === 'monthly_reports' && <MonthlyReportsView />}
              {activeView === 'client_dashboard' && <ClientPortalDashboard />}
              {activeView === 'client_approvals' && <ClientApprovalsView />}
              {activeView === 'client_content' && <ClientContentView />}
              {activeView === 'client_calendar' && <ClientCalendarView />}
              {activeView === 'client_campaigns' && <ClientCampaignsView />}
              {activeView === 'client_brand_assets' && <BrandAssetsView />}
              {activeView === 'client_brand' && <BrandAssetsView />}
              {activeView === 'client_media' && <MediaLibraryView />}
              {activeView === 'client_analytics' && <ClientAnalyticsView />}
              {activeView === 'client_reports' && <MonthlyReportsView />}
              {activeView === 'client_profile' && <ClientProfileView />}
              {activeView === 'accounts' && <SocialAccountsView />}
              {activeView === 'analytics' && <AnalyticsView />}
              {activeView === 'calendar' && <CalendarView />}
              {activeView === 'events' && <EventsView />}
              {activeView === 'studio' && <ContentStudioView />}
              {activeView === 'ai_assistant' && <AIAssistantView />}
              {activeView === 'ai_analyzer' && <AIContentAnalyzerView />}
              {activeView === 'ai_prompts' && <AIPromptGeneratorView />}
              {activeView === 'media' && <MediaLibraryView />}
              {activeView === 'campaigns' && <CampaignsView />}
              {activeView === 'approvals' && <ApprovalsView />}
              {activeView === 'tasks' && <TasksView />}
              {activeView === 'chat' && <TeamChatView />}
              {activeView === 'team' && <TeamView />}
              {activeView === 'settings' && <SettingsView />}
              {activeView === 'notifications' && <NotificationsView />}
              {activeView === 'pricing' && <PricingView />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Sticky Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>

      {/* Studio Floating / Quick Compose Modal */}
      <AnimatePresence>
        {isStudioModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-5xl bg-[#111111] rounded-2xl shadow-2xl border border-white/10 overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#151515]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">COMPOSER</span>
                    <h3 className="font-display font-extrabold text-white text-base tracking-tight">Quick Content Studio</h3>
                  </div>
                  <p className="text-[11px] text-[#9A9A9A]">Generate, refine and schedule multi-platform posts in seconds</p>
                </div>
                <button
                  id="close-studio-modal-btn"
                  onClick={() => setIsStudioModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <ContentStudioView isModal={true} onCloseModal={() => setIsStudioModalOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Interactive Overlays & Modals */}
      <UpgradeModal />
      <CheckoutModal />
      <EnterpriseModal />
      <CommandPalette />
      <AuthModal />
      <OnboardingWizard />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
