import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Building2, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  Users,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';

export const EnterpriseModal: React.FC = () => {
  const { 
    isEnterpriseModalOpen, 
    closeEnterpriseModal, 
    workspace, 
    user, 
    showToast,
    triggerConfetti 
  } = useApp();

  if (!isEnterpriseModalOpen) return null;

  const [institutionName, setInstitutionName] = useState(workspace.name || 'JSPM Imperial College');
  const [contactName, setContactName] = useState(user.name || 'Pallav Borkar');
  const [workEmail, setWorkEmail] = useState(user.email || 'pallavborkar73@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [estimatedAccounts, setEstimatedAccounts] = useState('50 - 100 Accounts');
  const [specialRequirements, setSpecialRequirements] = useState(
    'Multi-campus social presence, ERP single sign-on integration, and dedicated institutional branding.'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    triggerConfetti();
    showToast('Inquiry Received', 'Our Enterprise Solutions team will contact you within 2 hours.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeEnterpriseModal}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8"
      >
        <div className="p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white relative">
          <button
            onClick={closeEnterpriseModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Socially Enterprise & Educational Trusts</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Custom Enterprise Quote
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Tailored pricing, custom team sizes, multi-campus governance, and dedicated account support.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Request Submitted Successfully!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Thank you, {contactName}. A senior Enterprise Specialist will reach out to <strong>{workEmail}</strong> shortly with a custom proposal and sandbox access.
            </p>
            <div className="pt-2">
              <button
                onClick={closeEnterpriseModal}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Organization / College Name
              </label>
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Social Channels Required
                </label>
                <select
                  value={estimatedAccounts}
                  onChange={(e) => setEstimatedAccounts(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option>25 - 50 Accounts</option>
                  <option>50 - 100 Accounts</option>
                  <option>100+ Accounts (Multi-Brand / Multi-Campus)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Custom Requirements & Notes
              </label>
              <textarea
                rows={3}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Enterprise Request</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
