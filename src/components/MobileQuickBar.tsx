"use client";

import { Phone, MessageCircle } from "lucide-react";

export default function MobileQuickBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-3 py-2.5 shadow-[0_-8px_25px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Quick Call: Mohitbhai */}
        <a
          href="tel:+919510441941"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-[#090E1A] py-2 px-1 text-white shadow-2xs active:scale-95 transition-transform"
          title="Call Mohitbhai"
        >
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-[11px] font-bold">Call Mohit</span>
          </div>
          <span className="text-[9px] text-slate-300 font-mono">95104 41941</span>
        </a>

        {/* Quick Call: Sagarbhai */}
        <a
          href="tel:+916355366440"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-slate-100 border border-slate-200/90 py-2 px-1 text-slate-900 active:scale-95 transition-transform"
          title="Call Sagarbhai"
        >
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-slate-700" />
            <span className="text-[11px] font-bold">Call Sagar</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">63553 66440</span>
        </a>

        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/919510441941?text=Hi%20Maruti%20TVS,%20I%20am%20enquiring%20about%20TVS%20Genuine%20Parts%20/%20Scooters"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-emerald-600 py-2 px-1 text-white shadow-2xs active:scale-95 transition-transform"
          title="WhatsApp Maruti TVS"
        >
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold">WhatsApp</span>
          </div>
          <span className="text-[9px] text-emerald-100 font-medium">Quick Chat</span>
        </a>
      </div>
    </div>
  );
}
