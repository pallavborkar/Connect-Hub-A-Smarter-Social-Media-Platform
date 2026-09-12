import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    setUser, 
    setIsAuthenticated,
    signInWithGoogle,
    showToast,
    setIsOnboarding,
    triggerConfetti 
  } = useApp();

  const [email, setEmail] = useState('pallavborkar73@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Pallav Borkar');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'forgot') {
      showToast('Password Reset Sent', `Reset instructions sent to ${email}`, 'info');
      setAuthMode('login');
      return;
    }

    if (authMode === 'signup') {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setAuthModalOpen(false);
        setIsOnboarding(true);
        triggerConfetti();
      }, 1000);
      return;
    }

    // Login flow
    setUser({
      id: 'user-pallav',
      name: name || 'Pallav Borkar',
      email: email || 'pallavborkar73@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'owner',
      workspaceId: 'ws-jspm-01',
    });
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    showToast('Welcome Back!', 'Logged in as Workspace Owner.', 'success');
  };

  return (
    <div id="auth-backdrop" className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        id="auth-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative"
      >
        <button
          id="auth-close-btn"
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-md mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {authMode === 'login' && 'Welcome to Socially'}
              {authMode === 'signup' && 'Create Your Workspace'}
              {authMode === 'forgot' && 'Reset Your Password'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {authMode === 'login' && 'Sign in to access your social media team command center.'}
              {authMode === 'signup' && 'Join JSPM and top creators managing content with AI.'}
              {authMode === 'forgot' && 'Enter your email and we will send a recovery magic link.'}
            </p>
          </div>

          {/* Google SSO Button */}
          {authMode !== 'forgot' && (
            <div className="space-y-3 mb-6">
              <button
                type="button"
                id="auth-google-btn"
                onClick={() => {
                  signInWithGoogle({
                    name: 'Pallav Borkar',
                    email: 'pallavborkar73@gmail.com',
                  });
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center space-x-2.5 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.7 0 3 .7 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold uppercase text-slate-400">or</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pallav Borkar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu or name@agency.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      id="auth-forgot-link"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'login' && 'Sign In to Workspace'}
                    {authMode === 'signup' && 'Create Account & Continue'}
                    {authMode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode footer */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {authMode === 'login' ? (
              <p>
                Don't have a workspace?{' '}
                <button
                  id="auth-switch-signup"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create one here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  id="auth-switch-login"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
