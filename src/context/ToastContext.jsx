import React, { createContext, useContext, useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
  error:   <XCircle      size={18} className="text-rose-400 shrink-0"    />,
  warning: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
  info:    <Info          size={18} className="text-blue-400 shrink-0"   />,
};

const BORDERS = {
  success: "border-emerald-500/30",
  error:   "border-rose-500/30",
  warning: "border-amber-500/30",
  info:    "border-blue-500/30",
};

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, type = "info", duration = 3500 }) => {
    const id = ++_id;
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast Container — fixed bottom-right */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
        role="status"
      >
        <AnimatePresence initial={false}>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              role="alert"
              aria-label={`${t.type}: ${t.title}`}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`
                pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-sm
                bg-zinc-900/95 backdrop-blur-xl border rounded-xl px-4 py-3
                shadow-2xl shadow-black/40 ${BORDERS[t.type]}
              `}
            >
              {ICONS[t.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-snug">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{t.description}</p>
                )}
              </div>
              <button
                aria-label="Dismiss notification"
                onClick={() => dismiss(t.id)}
                className="text-white/30 hover:text-white transition-colors shrink-0 mt-0.5 rounded focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
}
