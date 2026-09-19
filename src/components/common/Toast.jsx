import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
    {toasts.map((toast) => (
      <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
    ))}
  </div>
);

const ToastItem = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-400 shrink-0" />,
  };
  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-950/40 text-rose-200',
    info: 'border-brand-500/30 bg-brand-950/40 text-brand-200',
  };

  return (
    <div className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl animate-fade-in ${borders[toast.type]}`}>
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button onClick={() => onDismiss(toast.id)} className="opacity-70 hover:opacity-100 p-0.5">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
