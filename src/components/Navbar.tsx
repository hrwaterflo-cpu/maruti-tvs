"use client";

import Link from "next/link";
import { Lock, ArrowUpRight, Menu, X, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/75 backdrop-blur-2xl">
      {/* TVS Racing Top Accent */}
      <div className="h-[3px] w-full tvs-racing-bar" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Light TVS Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-10 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B2265] to-[#1D4ED8] text-white font-black italic tracking-tighter text-sm shadow-md shadow-blue-600/20 overflow-hidden"
          >
            <span className="relative z-10">TVS</span>
            <span className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#E31E24]" />
          </motion.div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-[#0B2265]">
                MARUTI <span className="text-[#E31E24] italic">TVS</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] border border-blue-200/80">
                Sub Dealer
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Scooters &amp; Genuine Parts OS</p>
          </div>
        </Link>

        {/* Frosted Pill Nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-blue-100 bg-white/70 backdrop-blur-md p-1 text-xs font-semibold text-slate-600 shadow-2xs">
          <a
            href="#spare-parts"
            className="rounded-full px-4 py-1.5 hover:bg-blue-50 hover:text-[#0B2265] transition-all"
          >
            Genuine Parts
          </a>
          <a
            href="#scooters"
            className="rounded-full px-4 py-1.5 hover:bg-blue-50 hover:text-[#0B2265] transition-all"
          >
            TVS Scooters
          </a>
          <a
            href="#contact"
            className="rounded-full px-4 py-1.5 hover:bg-blue-50 hover:text-[#0B2265] transition-all"
          >
            Showroom
          </a>
        </nav>

        {/* Desktop Hotline & Admin CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/70 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-[#0B2265] shadow-2xs">
            <Phone className="h-3 w-3 text-[#1D4ED8]" />
            <a href="tel:+919510441941" className="hover:text-[#1D4ED8] transition-colors" title="Mohitbhai">
              Mohit: 9510441941
            </a>
            <span className="text-slate-300">|</span>
            <a href="tel:+916355366440" className="hover:text-[#1D4ED8] transition-colors" title="Sagarbhai">
              Sagar: 6355366440
            </a>
          </div>

          <Link
            href="/admin"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:brightness-110 transition-all"
          >
            <Lock className="h-3.5 w-3.5 text-sky-300" />
            Admin Console
            <ArrowUpRight className="h-3.5 w-3.5 text-blue-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="tel:+919510441941"
            className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-xs font-bold text-[#0B2265]"
            title="Call Maruti TVS"
          >
            <Phone className="h-3 w-3 text-[#1D4ED8]" />
            Call
          </a>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] px-3 py-1.5 text-xs font-bold text-white shadow-sm"
          >
            <Lock className="h-3 w-3 text-sky-300" />
            Admin
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-blue-100 bg-white/80 p-2 text-[#0B2265] hover:bg-blue-50"
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
            className="overflow-hidden md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-2">
              <a
                href="#spare-parts"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#0B2265] active:bg-blue-50"
              >
                Check Genuine Parts Stock
              </a>
              <a
                href="#scooters"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#0B2265] active:bg-blue-50"
              >
                TVS Scooter Models
              </a>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#0B2265] active:bg-blue-50"
              >
                Showroom &amp; Contacts
              </a>

              {/* Direct Owner Calls for Mobile Visitors */}
              <div className="pt-2 border-t border-blue-100/80 space-y-2">
                <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Direct Contact &bull; Maruti TVS
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+919510441941"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-50/90 py-2.5 text-xs font-bold text-[#0B2265] border border-blue-200/80 active:bg-blue-100"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#1D4ED8]" />
                    Mohitbhai
                  </a>
                  <a
                    href="tel:+916355366440"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-50/90 py-2.5 text-xs font-bold text-[#0B2265] border border-blue-200/80 active:bg-blue-100"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#1D4ED8]" />
                    Sagarbhai
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href="https://wa.me/919510441941?text=Hi%20Mohitbhai,%20I%20am%20enquiring%20about%20Maruti%20TVS%20Parts%20/%20Scooters"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2 text-[11px] font-bold text-emerald-700 border border-emerald-200"
                  >
                    <MessageCircle className="h-3 w-3" />
                    WhatsApp Mohit
                  </a>
                  <a
                    href="https://wa.me/916355366440?text=Hi%20Sagarbhai,%20I%20am%20enquiring%20about%20Maruti%20TVS%20Parts%20/%20Scooters"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2 text-[11px] font-bold text-emerald-700 border border-emerald-200"
                  >
                    <MessageCircle className="h-3 w-3" />
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
