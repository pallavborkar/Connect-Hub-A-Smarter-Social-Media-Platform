import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Users, 
  Plus, 
  Trash2, 
  Flame,
  CheckCircle2,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  GraduationCap,
  Briefcase,
  User,
  Layers,
  Sparkle,
  Calendar,
  TrendingUp,
  BarChart3,
  Target,
  Bot
} from 'lucide-react';
import { SocialPlatform } from '../types';

export const OnboardingWizard: React.FC = () => {
  const { 
    isOnboarding, 
    setIsOnboarding, 
    setWorkspace, 
    setActiveView, 
    showToast, 
    triggerConfetti,
    inviteTeamMember,
    managementType,
    setManagementType,
    onboardingGoals,
    setOnboardingGoals,
    connectedAccounts
  } = useApp();

  // Screen 0: Welcome Screen
  // Step 1: What are you managing?
  // Step 2: Connect Social Accounts
  // Step 3: Set Up Team
  // Step 4: Choose Goals
  // Step 5: First Action
  const [screen, setScreen] = useState<number>(0);
  const [workspaceName, setWorkspaceName] = useState('My Social Workspace');
  
  // Team state
  const [inviteEmails, setInviteEmails] = useState<{ email: string; role: string }[]>([
    { email: 'alex@example.com', role: 'Creator' }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Creator');

  // Connected status dummy toggle for onboarding
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(['instagram']);

  if (!isOnboarding) return null;

  const managementOptions = [
    { id: 'college', label: 'College / University', desc: 'Admissions, student life & campus events', icon: GraduationCap },
    { id: 'business', label: 'Business', desc: 'Product marketing, lead gen & brand reach', icon: Briefcase },
    { id: 'creator', label: 'Creator', desc: 'Reels, YouTube growth & content creation', icon: Sparkles },
    { id: 'agency', label: 'Agency', desc: 'Managing multiple client social media accounts', icon: Layers },
    { id: 'personal_brand', label: 'Personal Brand', desc: 'Thought leadership & executive presence', icon: User },
    { id: 'other', label: 'Other', desc: 'Custom community or organization', icon: Building2 },
  ];

  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', color: 'from-pink-500 via-purple-500 to-yellow-500', icon: Instagram },
    { id: 'facebook', name: 'Facebook', color: 'from-blue-600 to-blue-700', icon: Facebook },
    { id: 'linkedin', name: 'LinkedIn', color: 'from-blue-700 to-cyan-700', icon: Linkedin },
    { id: 'youtube', name: 'YouTube', color: 'from-red-600 to-red-700', icon: Youtube },
  ];

  const rolesList = ['Admin', 'Manager', 'Creator', 'Designer', 'Editor', 'Reviewer'];

  const goalOptions = [
    { id: 'create_content', label: 'Create content', icon: Sparkles },
    { id: 'schedule_posts', label: 'Schedule posts', icon: Calendar },
    { id: 'grow_engagement', label: 'Grow engagement', icon: TrendingUp },
    { id: 'analyze_performance', label: 'Analyze performance', icon: BarChart3 },
    { id: 'manage_team', label: 'Manage my team', icon: Users },
    { id: 'plan_campaigns', label: 'Plan campaigns', icon: Target },
    { id: 'find_events', label: 'Find event opportunities', icon: Calendar },
    { id: 'ai_generation', label: 'Generate content with AI', icon: Bot },
  ];

  const toggleGoal = (goalId: string) => {
    if (onboardingGoals.includes(goalId)) {
      setOnboardingGoals(onboardingGoals.filter(g => g !== goalId));
    } else {
      setOnboardingGoals([...onboardingGoals, goalId]);
    }
  };

  const toggleConnectPlatform = (id: string) => {
    if (connectedPlatforms.includes(id)) {
      setConnectedPlatforms(connectedPlatforms.filter(p => p !== id));
      showToast('Disconnected', `Disconnected ${id}`, 'info');
    } else {
      setConnectedPlatforms([...connectedPlatforms, id]);
      showToast('Connected!', `Successfully connected ${id} account.`, 'success');
    }
  };

  const addInvite = () => {
    if (newEmail.trim() && !inviteEmails.some(i => i.email === newEmail.trim())) {
      setInviteEmails([...inviteEmails, { email: newEmail.trim(), role: newRole }]);
      setNewEmail('');
    }
  };

  const removeInvite = (idx: number) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== idx));
  };

  const handleFinish = (targetView: 'create' | 'ai_assistant' | 'dashboard') => {
    setWorkspace({
      id: `ws-${Date.now()}`,
      name: workspaceName,
      type: managementType as any,
      memberCount: inviteEmails.length + 1,
      plan: 'pro',
      createdAt: new Date().toISOString().split('T')[0],
    });

    inviteEmails.forEach((item) => {
      inviteTeamMember(item.email, item.email.split('@')[0], item.role.toLowerCase() as any);
    });

    setIsOnboarding(false);
    setActiveView(targetView);
    triggerConfetti();
    showToast('Welcome to Socially! 🚀', 'Your personalized workspace is ready.', 'success');
  };

  return (
    <div id="onboarding-container" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Progress Header */}
        {screen > 0 && (
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-2 font-bold text-sm text-slate-800 dark:text-slate-200">
              <Flame className="w-5 h-5 text-indigo-600" />
              <span>Socially Workspace Setup</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    screen === s ? 'w-6 bg-indigo-600' : screen > s ? 'w-3 bg-emerald-500' : 'w-3 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* SCREEN 0: WELCOME */}
          {screen === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-xl">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Welcome to Socially 👋
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
                  Your social media workspace is almost ready. Let's personalize it for your exact needs in under 30 seconds.
                </p>
              </div>

              <div className="pt-4">
                <button
                  id="onboarding-get-started-btn"
                  onClick={() => setScreen(1)}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-98 flex items-center space-x-2 mx-auto"
                >
                  <span>Let's Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: CHOOSE WHAT YOU MANAGE */}
          {screen === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 1 of 5</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  What are you managing?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  We'll customize your dashboard presets and AI recommendations accordingly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {managementOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = managementType === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`onboarding-type-${item.id}`}
                      onClick={() => setManagementType(item.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.label}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: CONNECT SOCIAL ACCOUNTS */}
          {screen === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 2 of 5</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Connect Social Accounts
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Connect the accounts you manage to enable scheduling & analytics.
                </p>
              </div>

              <div className="space-y-3">
                {socialPlatforms.map((p) => {
                  const Icon = p.icon;
                  const isConnected = connectedPlatforms.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.color} text-white flex items-center justify-center font-bold shadow-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{p.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {isConnected ? 'Account linked & active' : 'Click connect to authorize'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleConnectPlatform(p.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isConnected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Connected</span>
                          </>
                        ) : (
                          <span>Connect</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setScreen(3)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline"
                >
                  I'll do this later
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SET UP TEAM */}
          {screen === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 3 of 5</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Who's working with you?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Invite team members and assign specific workflow permissions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  id="onboarding-invite-input"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  {rolesList.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <button
                  id="onboarding-add-invite-btn"
                  onClick={addInvite}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Invite Team</span>
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Invited members:</p>
                {inviteEmails.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {item.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{item.email}</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">{item.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeInvite(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setScreen(4)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline"
                >
                  I'll do this later
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CHOOSE GOALS */}
          {screen === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 4 of 5</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  What do you want Socially to help you with?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select all that apply. We'll tailor your quick actions and AI prompts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goalOptions.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = onboardingGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                        <span className="text-xs">{goal.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 5: FIRST ACTION */}
          {screen === 5 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  You're ready to go.
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                  Your workspace is set up. What would you like to do first?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  id="onboarding-action-create"
                  onClick={() => handleFinish('create')}
                  className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200 font-bold text-xs flex flex-col items-center justify-center space-y-2 transition-all shadow-xs"
                >
                  <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <span>Create Your First Post</span>
                </button>

                <button
                  id="onboarding-action-ai"
                  onClick={() => handleFinish('ai_assistant')}
                  className="p-4 rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-900 dark:text-purple-200 font-bold text-xs flex flex-col items-center justify-center space-y-2 transition-all shadow-xs"
                >
                  <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <span>Generate with AI</span>
                </button>

                <button
                  id="onboarding-action-dashboard"
                  onClick={() => handleFinish('dashboard')}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white font-bold text-xs flex flex-col items-center justify-center space-y-2 transition-all shadow-xs"
                >
                  <BarChart3 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  <span>Explore Dashboard</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Controls */}
        {screen > 0 && screen < 5 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => setScreen(screen - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Back
            </button>

            <button
              id="onboarding-next-btn"
              onClick={() => setScreen(screen + 1)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md"
            >
              <span>{screen === 4 ? 'Continue' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

