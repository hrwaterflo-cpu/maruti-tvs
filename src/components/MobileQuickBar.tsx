"use client";

import { Phone, MessageCircle, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileQuickBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-blue-200/80 bg-white/95 backdrop-blur-xl px-3 py-2 shadow-[0_-8px_20px_rgba(11,34,101,0.08)]">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Quick Call: Mohitbhai */}
        <a
          href="tel:+919510441941"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] py-2 px-1 text-white shadow-sm active:scale-95 transition-transform"
          title="Call Mohitbhai"
        >
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-sky-300" />
            <span className="text-[11px] font-bold">Call Mohit</span>
          </div>
          <span className="text-[9px] text-blue-200 font-mono">9510441941</span>
        </a>

        {/* Quick Call: Sagarbhai */}
        <a
          href="tel:+916355366440"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-blue-50 border border-blue-200/90 py-2 px-1 text-[#0B2265] active:scale-95 transition-transform"
          title="Call Sagarbhai"
        >
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-[#1D4ED8]" />
            <span className="text-[11px] font-bold">Call Sagar</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">6355366440</span>
        </a>

        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/919510441941?text=Hi%20Maruti%20TVS,%20I%20am%20enquiring%20about%20TVS%20Genuine%20Parts%20/%20Scooters"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-emerald-600 py-2 px-1 text-white shadow-sm active:scale-95 transition-transform"
          title="WhatsApp Maruti TVS"
        >
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold">WhatsApp</span>
          </div>
          <span className="text-[9px] text-emerald-100 font-semibold">Instant Reply</span>
        </a>
      </div>
    </div>
  );
}
