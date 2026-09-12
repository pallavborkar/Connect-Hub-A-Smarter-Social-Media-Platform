import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  User as UserIcon, 
  Mail, 
  Building2, 
  Flame, 
  Check, 
  Key, 
  Globe, 
  ShieldAlert,
  Loader2,
  RefreshCw
} from 'lucide-react';

export const GoogleSignInGate: React.FC = () => {
  const { 
    signInWithGoogle, 
    isGoogleVerifying, 
    googleVerificationStep,
    user,
    setIsAuthenticated,
    showToast
  } = useApp();

  const [useCustomAccount, setUseCustomAccount] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState<'owner' | 'admin' | 'social_media_manager'>('owner');

  const defaultUser = {
    name: 'Pallav Borkar',
    email: 'pallavborkar73@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'owner' as const,
    workspaceId: 'ws-jspm-01'
  };

  const handleDefaultSignIn = () => {
    signInWithGoogle(defaultUser);
  };

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      showToast('Invalid Email', 'Please provide a valid Google Workspace or Gmail address.', 'warning');
      return;
    }
    const derivedName = customName.trim() || customEmail.split('@')[0];
    const customAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=6366f1&color=fff&size=150`;

    signInWithGoogle({
      name: derivedName,
      email: customEmail.trim(),
      avatar: customAvatar,
      role: customRole,
      workspaceId: 'ws-jspm-01'
    });
  };

  const handleGuestBypass = () => {
    setIsAuthenticated(true);
    showToast('Guest Access Granted', 'Exploring Socially in demonstration mode.', 'info');
  };

  return (
    <div id="google-signin-gate" className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Decorative Gradients & Mesh */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Flame className="w-6 h-6 fill-white/20" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Socially
            </span>
            <span className="text-[10px] block font-semibold text-slate-400 uppercase tracking-wider">
              JSPM Command Center
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Identity SSO</span>
          </span>
          <button
            id="google-gate-guest-btn"
            onClick={handleGuestBypass}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-colors"
          >
            Demo Preview →
          </button>
        </div>
      </header>

      {/* Main Verification Card Area */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top Brand & Badge */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Identity Verification Required</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sign in with Google
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              Verify your Google identity to access JSPM College of Engineering's social media and AI publishing workspace.
            </p>
          </div>

          {/* Verification in Progress State */}
          {isGoogleVerifying ? (
            <div className="py-8 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                {/* Spinning loader ring */}
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-2 rounded-full bg-slate-950 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.7 0 3 .7 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">
                  Verifying Google Account...
                </h3>
                <p className="text-xs text-indigo-400 font-mono animate-pulse">
                  {googleVerificationStep || 'Authenticating with Google Identity Services...'}
                </p>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="max-w-xs mx-auto space-y-2 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-[11px]">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Google OAuth 2.0 Handshake</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified Identity Token & SSL Cert</span>
                </div>
                <div className="flex items-center space-x-2 text-indigo-400 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                  <span>Loading JSPM Command Workspace...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {!useCustomAccount ? (
                <>
                  {/* Primary Verified Account Card (Pallav Borkar) */}
                  <div
                    onClick={handleDefaultSignIn}
                    className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-800/50 border border-indigo-500/30 hover:border-indigo-500 transition-all cursor-pointer group relative shadow-md hover:shadow-indigo-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={defaultUser.avatar}
                            alt={defaultUser.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/50"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center ring-1 ring-slate-800">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                              <path fill="#EA4335" d="M12 5c1.7 0 3 .7 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
                              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
                            </svg>
                          </div>
                        </div>

                        <div className="text-left">
                          <div className="flex items-center space-x-1.5">
                            <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors">
                              {defaultUser.name}
                            </h4>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono">
                            {defaultUser.email}
                          </p>
                          <span className="text-[10px] text-indigo-400 font-medium">
                            Workspace Owner • JSPM College
                          </span>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Official Google Sign In Button */}
                  <button
                    id="google-signin-primary-btn"
                    onClick={handleDefaultSignIn}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all flex items-center justify-center space-x-3 shadow-lg shadow-white/10 active:scale-[0.98] cursor-pointer"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.7 0 3 .7 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
                    </svg>
                    <span>Continue as Pallav Borkar</span>
                  </button>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-slate-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      or
                    </span>
                  </div>

                  {/* Switch to Custom Google Account */}
                  <button
                    id="google-signin-use-another-btn"
                    onClick={() => setUseCustomAccount(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all flex items-center justify-center space-x-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Use another Google account</span>
                  </button>
                </>
              ) : (
                /* Custom Google Account Form */
                <form onSubmit={handleCustomSignIn} className="space-y-4 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-200">
                      Enter Google Workspace or Gmail
                    </h3>
                    <button
                      type="button"
                      onClick={() => setUseCustomAccount(false)}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      ← Back to {defaultUser.name}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Google Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        id="custom-google-email"
                        type="email"
                        required
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="e.g. yourname@gmail.com or @jspm.edu.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        id="custom-google-name"
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Dr. A. Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Workspace Role</label>
                    <select
                      id="custom-google-role"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="owner">Workspace Owner / HOD</option>
                      <option value="admin">Administrator / Lead Editor</option>
                      <option value="social_media_manager">Social Media Manager</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    id="custom-google-submit-btn"
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 cursor-pointer mt-2"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.7 0 3 .7 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
                    </svg>
                    <span>Verify with Google Identity</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Security Guarantee Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 256-Bit Encrypted</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>JSPM Official SSO</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-400">
        <p>© 2026 JSPM College of Engineering & Socially Media Operations. Protected by Google Identity Services.</p>
      </footer>
    </div>
  );
};
