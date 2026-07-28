import React from 'react';
import { X, MapPin, Mail, Phone, Globe, Star, ShieldCheck } from 'lucide-react';

export default function VendorModal({ vendor, onClose }) {
  if (!vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="accent-glass w-full max-w-lg p-6 rounded-3xl border border-slate-200 dark:border-white/20 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
            {vendor.name ? vendor.name.charAt(0) : 'V'}
          </div>
          <div>
            <h3 className="text-card-title text-slate-900 dark:text-white flex items-center gap-2">
              {vendor.name}
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">XYZ Verified Corporate Partner</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-200 dark:border-white/10 pt-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{vendor.location || 'San Francisco, CA'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{vendor.email || 'contact@partner.com'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>+1 (800) 555-0199</span>
          </div>

          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <span>www.xyzwellness-partner.com</span>
          </div>

          <div className="pt-2 flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-4 h-4 fill-amber-500" />
            <span>4.9 / 5.0 (124 Employee Reviews)</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md"
          >
            Close Vendor Details
          </button>
        </div>
      </div>
    </div>
  );
}
