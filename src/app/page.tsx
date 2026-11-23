"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  Lock,
  Wrench,
  Gauge,
  Fuel,
  ShieldCheck,
  Zap,
  Check,
  Activity,
  Award,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PublicPartsChecker from "@/components/PublicPartsChecker";
import EnquiryModal from "@/components/EnquiryModal";
import MobileQuickBar from "@/components/MobileQuickBar";
import { VEHICLES } from "@/data/vehicles";

const MARQUEE_ITEMS = [
  "TVS Genuine Parts",
  "20 TVS Models Live",
  "16,500+ Original Parts",
  "TVS Jupiter 125",
  "TVS Apache RTR 180",
  "TVS Raider 125",
  "TVS iQube Electric",
  "TVS Scooty Streak & Pep+",
  "TVS Ronin 225",
  "TVS XL 100",
];

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"vehicle" | "spare_part" | "service">("vehicle");
  const [modalItem, setModalItem] = useState("");

  function openEnquiry(type: "vehicle" | "spare_part" | "service", item: string) {
    setModalType(type);
    setModalItem(item);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col text-[#0B2265] pb-20 md:pb-0">
      <Navbar />

      {/* LIGHT WHITE & BLUE GLASSMORPHISM SAAS HERO */}
      <section className="relative overflow-hidden tvs-grid-light border-b border-blue-100/80">
        {/* Soft Blue & Sky Glassmorphism Background Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl animate-float-delayed" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl animate-float-slow" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-22">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-6 space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08, duration: 0.35 }}
                className="inline-flex items-center gap-2 rounded-full glass-card px-3.5 py-1.5 text-xs font-bold text-[#0B2265]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1D4ED8] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1D4ED8]" />
                </span>
                MARUTI TVS &bull; AUTHORIZED SUB DEALER
              </motion.div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.08]">
                <span className="text-tvs-blue-gradient">TVS Showroom &amp;</span>
                <span className="block text-[#0B2265] mt-1">
                  Live Genuine Parts <span className="text-[#1D4ED8]">OS.</span>
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Official Maruti TVS digital counter — explore TVS scooters and check real-time
                genuine spare parts availability across <strong>20 TVS models</strong> before you
                visit.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  href="#spare-parts"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:brightness-110 transition-all"
                >
                  <Wrench className="h-4 w-4 text-sky-300" />
                  Check TVS Spare Parts
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  href="#scooters"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl glass-card px-6 py-3.5 text-sm font-bold text-[#0B2265] hover:bg-white transition-colors"
                >
                  Explore Scooters
                  <ArrowRight className="h-4 w-4 text-[#1D4ED8]" />
                </motion.a>
              </div>

              {/* Quick Direct Hotline Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <PhoneCall className="h-3 w-3 text-[#1D4ED8]" /> Direct Call:
                </span>
                <a
                  href="tel:+919510441941"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-blue-200/90 px-3 py-1 text-xs font-bold text-[#0B2265] shadow-2xs hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-all"
                  title="Call Mohitbhai"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Mohit: 95104 41941
                </a>
                <a
                  href="tel:+916355366440"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-blue-200/90 px-3 py-1 text-xs font-bold text-[#0B2265] shadow-2xs hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-all"
                  title="Call Sagarbhai"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Sagar: 63553 66440
                </a>
              </div>

              {/* Frosted Glass Bento Metrics */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                {[
                  { value: "20", label: "TVS Models", accent: "text-[#0B2265]" },
                  { value: "16.5k+", label: "Genuine Parts", accent: "text-[#1D4ED8]" },
                  { value: "Live", label: "Stock Sync", accent: "text-emerald-600" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                    className="rounded-2xl glass-card p-2.5 sm:p-3.5 text-center sm:text-left"
                  >
                    <p className={`text-lg sm:text-2xl font-extrabold ${stat.accent}`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Glassmorphic Showroom Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="lg:col-span-6"
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-blue-400/25 via-sky-300/25 to-white/60 blur-2xl" />

                <div className="relative rounded-3xl glass-panel p-3">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-blue-950">
                    <img
                      src="/images/hero-showroom.png"
                      alt="Maruti TVS Showroom"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2265]/65 via-transparent to-transparent" />

                    {/* Top Floating Frosted Glass Pill */}
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-3.5 left-3.5 inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-xl px-3.5 py-1.5 text-[11px] font-bold text-[#0B2265] shadow-md border border-white"
                    >
                      <Award className="h-3.5 w-3.5 text-[#E31E24]" />
                      100% Genuine TVS Spares
                    </motion.div>

                    {/* Bottom Frosted Glass Telemetry Bar */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 rounded-2xl bg-white/85 backdrop-blur-xl px-4 py-3 border border-white shadow-lg">
                      <div>
                        <p className="text-xs font-extrabold text-[#0B2265] flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-emerald-600" />
                          Maruti TVS Live Inventory
                        </p>
                        <p className="text-[11px] text-slate-600">
                          20 TVS models synced in real time
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1D4ED8] px-2.5 py-1 text-[10px] font-bold text-white shrink-0">
                        <Zap className="h-3 w-3" />
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* LIGHT GLASS MARQUEE TICKER */}
        <div className="relative border-t border-blue-100/80 bg-white/65 backdrop-blur-md py-3 overflow-hidden">
          <div className="animate-marquee flex items-center gap-8 text-xs font-bold tracking-wide text-[#0B2265]/80">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1D4ED8]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODEL-FIRST TVS GENUINE PARTS AVAILABILITY (NO MRP) */}
      <PublicPartsChecker onRequestPart={(label) => openEnquiry("spare_part", label)} />

      {/* LIGHT GLASS SCOOTERS LINEUP */}
      <section id="scooters" className="relative py-16 sm:py-24 overflow-hidden">
        <div className="pointer-events-none absolute top-10 right-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full glass-card px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                Maruti TVS Showroom
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B2265]">
                Popular TVS Scooters
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 max-w-lg">
                Book a test ride or enquire about finance &amp; exchange offers at Maruti TVS.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openEnquiry("service", "Showroom Test Ride Booking")}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:brightness-110 transition-all"
            >
              Book Test Ride
              <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VEHICLES.map((v) => (
              <motion.div
                key={v.id}
                whileHover={{ y: -6 }}
                className="group flex flex-col overflow-hidden rounded-3xl glass-card hover:border-blue-300 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-blue-50/60 overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {v.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#0B2265] shadow-xs">
                      {v.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider">
                      {v.category}
                    </span>
                    <h3 className="mt-0.5 text-base font-extrabold text-[#0B2265]">{v.name}</h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{v.tagline}</p>

                    <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-blue-50/70 p-2.5 text-[11px] font-semibold text-slate-700 border border-blue-100/80">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5 text-[#1D4ED8]" />
                        <span className="truncate">{v.engine}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="h-3.5 w-3.5 text-[#E31E24]" />
                        <span className="truncate">{v.mileage}</span>
                      </div>
                    </div>

                    <ul className="mt-3.5 space-y-1.5">
                      {v.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openEnquiry("vehicle", v.name)}
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-110 transition-all"
                  >
                    Enquire Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWROOM & DIRECT OWNER CONTACTS SECTION */}
      <section id="contact" className="relative py-16 sm:py-20 border-t border-blue-100 bg-white/60 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full glass-card px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">
              Authorized TVS Sub Dealer
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B2265]">
              Get in Touch with Maruti TVS
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              For new TVS scooter bookings, test rides, or genuine spare parts verification, call or WhatsApp our authorized team directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Mohitbhai */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl glass-card p-6 border border-blue-200/80 shadow-md shadow-blue-900/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1D4ED8] border border-blue-200/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Authorized Sub Dealer
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-[#0B2265]">
                    <Phone className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-[#0B2265]">Mohitbhai</h3>
                <p className="text-xs text-slate-500 mt-1">Maruti TVS Sub Dealer</p>
                <p className="mt-3 font-mono text-lg font-black text-[#0B2265] tracking-tight">
                  +91 95104 41941
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <a
                  href="tel:+919510441941"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-110 transition-all"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call Now
                </a>
                <a
                  href="https://wa.me/919510441941?text=Hi%20Mohitbhai,%20I%20am%20enquiring%20about%20Maruti%20TVS%20Parts%20/%20Scooters"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Card 2: Sagarbhai */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl glass-card p-6 border border-blue-200/80 shadow-md shadow-blue-900/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1D4ED8] border border-blue-200/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Authorized Sub Dealer
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-[#0B2265]">
                    <Phone className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-[#0B2265]">Sagarbhai</h3>
                <p className="text-xs text-slate-500 mt-1">Maruti TVS Sub Dealer</p>
                <p className="mt-3 font-mono text-lg font-black text-[#0B2265] tracking-tight">
                  +91 63553 66440
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <a
                  href="tel:+916355366440"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-110 transition-all"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call Now
                </a>
                <a
                  href="https://wa.me/916355366440?text=Hi%20Sagarbhai,%20I%20am%20enquiring%20about%20Maruti%20TVS%20Parts%20/%20Scooters"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Card 3: Showroom & Timing */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl glass-card p-6 border border-blue-200/80 shadow-md shadow-blue-900/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#E31E24] border border-red-200/80">
                    Authorized Sub Dealer
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-[#E31E24]">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-[#0B2265]">Maruti TVS Showroom</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Main Highway Road, Authorized TVS Sub Dealer Counter. Genuine Spare Parts &amp; New Scooters Showcase.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Clock className="h-4 w-4 text-[#1D4ED8]" />
                  Mon – Sat: 9:30 AM – 7:30 PM
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openEnquiry("service", "Showroom Visit & Enquiry")}
                  className="w-full rounded-xl bg-blue-50 hover:bg-blue-100 py-2.5 text-xs font-bold text-[#0B2265] border border-blue-200 transition-colors"
                >
                  Schedule Showroom Visit
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LIGHT WHITE & BLUE GLASS FOOTER */}
      <footer className="border-t border-blue-100 bg-white/80 backdrop-blur-xl mt-auto">
        <div className="h-[3px] w-full tvs-racing-bar" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B2265] to-[#1D4ED8] text-white font-black italic text-xs overflow-hidden">
                  TVS
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E31E24]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0B2265]">
                    MARUTI <span className="text-[#E31E24] italic">TVS</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Authorized TVS Sub Dealer</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-xs">
                Official Maruti TVS sub-dealership offering new TVS scooters and a live genuine spare parts catalog across 20 TVS models.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-bold uppercase tracking-wider text-slate-400">Direct Contact</p>
              <p className="flex items-center gap-2 text-slate-700 font-medium">
                <Phone className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                <a href="tel:+919510441941" className="hover:text-[#1D4ED8] transition-colors">
                  <strong>Mohitbhai:</strong> +91 95104 41941
                </a>
              </p>
              <p className="flex items-center gap-2 text-slate-700 font-medium">
                <Phone className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                <a href="tel:+916355366440" className="hover:text-[#1D4ED8] transition-colors">
                  <strong>Sagarbhai:</strong> +91 63553 66440
                </a>
              </p>
              <p className="flex items-center gap-2 text-slate-700 font-medium">
                <Clock className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                Mon – Sat: 9:30 AM – 7:30 PM
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dealer Management
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:brightness-110 transition-all"
              >
                <Lock className="h-3.5 w-3.5 text-sky-300" />
                Admin Inventory Login
              </Link>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Authorized Maruti TVS owner access
              </p>
            </div>
          </div>

          {/* BOTTOM SIGNATURE BAR: WITH "WEBSITE DESIGNED & DEVELOPED BY ASTHA WEB-DEVELOPER" */}
          <div className="mt-10 border-t border-blue-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} <strong className="text-[#0B2265]">Maruti TVS</strong> &bull; Authorized TVS Sub Dealer. All rights reserved.
            </p>

            {/* Signature Pill */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Website</span>
              <span className="text-slate-500 font-medium">Designed &amp; Developed by</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 px-3 py-1 text-xs font-bold text-[#0B2265] border border-blue-200/90 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1D4ED8] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1D4ED8]" />
                </span>
                <span className="tracking-tight bg-gradient-to-r from-[#0B2265] via-[#1D4ED8] to-[#0B2265] bg-clip-text text-transparent font-extrabold">
                  Astha Web-Developer
                </span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      <EnquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        enquiryType={modalType}
        itemName={modalItem}
      />

      {/* Floating Bottom Quick Action Dock on Mobile */}
      <MobileQuickBar />
    </div>
  );
}
