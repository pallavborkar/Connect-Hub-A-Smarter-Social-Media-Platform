import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let borderClass = 'border-blue-200 dark:border-blue-900/40 bg-blue-50/95 dark:bg-slate-900/95 text-blue-900 dark:text-blue-200';
          let iconColor = 'text-blue-500';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            borderClass = 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/95 dark:bg-slate-900/95 text-emerald-900 dark:text-emerald-200';
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderClass = 'border-amber-200 dark:border-amber-900/40 bg-amber-50/95 dark:bg-slate-900/95 text-amber-900 dark:text-amber-200';
            iconColor = 'text-amber-500';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-rose-200 dark:border-rose-900/40 bg-rose-50/95 dark:bg-slate-900/95 text-rose-900 dark:text-rose-200';
            iconColor = 'text-rose-500';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-start space-x-3 ${borderClass}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed break-words">{toast.message}</p>
              </div>
              <button
                id={`toast-dismiss-${toast.id}`}
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
