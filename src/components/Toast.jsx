import React from 'react';
import { CheckCircle2, Heart, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 animate-slide-up text-xs sm:text-sm font-semibold max-w-sm">
      {toast.type === 'cart' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {toast.type === 'wishlist' && <Heart className="w-5 h-5 text-red-400 fill-red-400 shrink-0" />}
      {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />}
      
      <span className="flex-1 text-right">{toast.message}</span>

      <button onClick={onClose} className="text-slate-400 hover:text-white transition mr-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
