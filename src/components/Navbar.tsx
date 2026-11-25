"use client";

import Link from "next/link";
import { Lock, ArrowUpRight, Menu, X, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-2xl">
      {/* TVS Pure Luxury Racing Hairline */}
      <div className="h-[2px] w-full tvs-racing-bar" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Minimalist Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex h-10 w-11 items-center justify-center rounded-xl bg-[#090E1A] text-white font-black italic tracking-tighter text-sm shadow-sm overflow-hidden"
          >
            <span className="relative z-10 tracking-tight">TVS</span>
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E31E24]" />
          </motion.div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-[#090E1A]">
                MARUTI <span className="text-[#E31E24] italic">TVS</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200/80">
                Sub Dealer
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Scooters &amp; Genuine Parts Counter</p>
          </div>
        </Link>

        {/* Minimalist Pill Nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/70 backdrop-blur-md p-1 text-xs font-semibold text-slate-600 shadow-2xs">
          <a
            href="#spare-parts"
            className="rounded-full px-4 py-1.5 hover:bg-white hover:text-[#090E1A] hover:shadow-2xs transition-all"
          >
            Genuine Parts
          </a>
          <a
            href="#scooters"
            className="rounded-full px-4 py-1.5 hover:bg-white hover:text-[#090E1A] hover:shadow-2xs transition-all"
          >
            TVS Scooters
          </a>
          <a
            href="#contact"
            className="rounded-full px-4 py-1.5 hover:bg-white hover:text-[#090E1A] hover:shadow-2xs transition-all"
          >
            Showroom
          </a>
        </nav>

        {/* Desktop Hotline & Admin CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <a href="tel:+919510441941" className="hover:text-[#090E1A] transition-colors" title="Mohitbhai">
              Mohit: 95104 41941
            </a>
            <span className="text-slate-300">|</span>
            <a href="tel:+916355366440" className="hover:text-[#090E1A] transition-colors" title="Sagarbhai">
              Sagar: 63553 66440
            </a>
          </div>

          <Link
            href="/admin"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-[#090E1A] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1E293B] transition-all"
          >
            <Lock className="h-3.5 w-3.5 text-slate-300" />
            Admin
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="tel:+919510441941"
            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800"
            title="Call Maruti TVS"
          >
            <Phone className="h-3 w-3 text-slate-700" />
            Call
          </a>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 rounded-xl bg-[#090E1A] px-3 py-1.5 text-xs font-bold text-white shadow-sm"
          >
            <Lock className="h-3 w-3 text-slate-300" />
            Admin
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-slate-200 bg-white/90 p-2 text-slate-800 hover:bg-slate-50"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl"
          >
            <div className="px-4 py-3 space-y-2">
              <a
                href="#spare-parts"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#090E1A] active:bg-slate-100"
              >
                Check Genuine Parts Stock
              </a>
              <a
                href="#scooters"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#090E1A] active:bg-slate-100"
              >
                TVS Scooter Models
              </a>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#090E1A] active:bg-slate-100"
              >
                Showroom &amp; Contacts
              </a>

              {/* Direct Owner Calls for Mobile Visitors */}
              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Authorized Sub Dealer Desk
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+919510441941"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-800 border border-slate-200 active:bg-slate-200"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-700" />
                    Mohitbhai
                  </a>
                  <a
                    href="tel:+916355366440"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-800 border border-slate-200 active:bg-slate-200"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-700" />
                    Sagarbhai
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href="https://wa.me/919510441941?text=Hi%20Mohitbhai,%20I%20am%20enquiring%20about%20Maruti%20TVS%20Parts%20/%20Scooters"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2 text-[11px] font-bold text-emerald-800 border border-emerald-200"
                  >
                    <MessageCircle className="h-3 w-3 text-emerald-600" />
                    WhatsApp Mohit
                  </a>
                  <a
                    href="https://wa.me/916355366440?text=Hi%20Sagarbhai,%20I%20am%20enquiring%20about%20Maruti%20TVS%20Parts%20/%20Scooters"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2 text-[11px] font-bold text-emerald-800 border border-emerald-200"
                  >
                    <MessageCircle className="h-3 w-3 text-emerald-600" />
                    WhatsApp Sagar
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
