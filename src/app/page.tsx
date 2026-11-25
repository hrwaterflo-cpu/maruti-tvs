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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PublicPartsChecker from "@/components/PublicPartsChecker";
import EnquiryModal from "@/components/EnquiryModal";
import MobileQuickBar from "@/components/MobileQuickBar";
import { VEHICLES } from "@/data/vehicles";

const MARQUEE_ITEMS = [
  "TVS Genuine Parts Counter",
  "20 TVS Lineups Live",
  "16,500+ Original OEM Spares",
  "TVS Jupiter 125",
  "TVS Apache RTR Series",
  "TVS Raider 125",
  "TVS iQube Electric EV",
  "TVS Scooty Streak & Pep+",
  "TVS Ronin 225",
  "TVS XL 100 Heavy Duty",
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
    <div className="min-h-screen flex flex-col bg-white text-[#090E1A] pb-20 md:pb-0">
      <Navbar />

      {/* PURE LUXURY MINIMAL LIGHT HERO */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-slate-50/60 via-white to-white">
        {/* Soft Ambient Diffuse Spotlights */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-slate-200/35 blur-3xl" />
        <div className="pointer-events-none absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-blue-100/25 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200/90 px-3.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1D4ED8] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1D4ED8]" />
                </span>
                MARUTI TVS &bull; AUTHORIZED SUB DEALER
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold tracking-tight leading-[1.1] text-[#090E1A]">
                Official TVS Showroom &amp;
                <span className="block mt-1 text-slate-600 font-normal">
                  Genuine Parts Counter<span className="text-[#1D4ED8] font-bold">.</span>
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Direct digital counter for Maruti TVS — inspect TVS scooters and verify real-time
                OEM spare parts availability across <strong>20 TVS models</strong> before you visit.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  href="#spare-parts"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#090E1A] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#1E293B] transition-all"
                >
                  <Wrench className="h-4 w-4 text-slate-300" />
                  Check TVS Spare Parts
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  href="#scooters"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  Explore Scooters
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </motion.a>
              </div>

              {/* Direct Hotline Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <PhoneCall className="h-3 w-3 text-slate-500" /> Direct Desk:
                </span>
                <a
                  href="tel:+919510441941"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:border-slate-400 transition-all"
                  title="Call Mohitbhai"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Mohit: 95104 41941
                </a>
                <a
                  href="tel:+916355366440"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:border-slate-400 transition-all"
                  title="Call Sagarbhai"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Sagar: 63553 66440
                </a>
              </div>

              {/* Minimal Luxury Bento Metrics */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                {[
                  { value: "20", label: "TVS Lineups", accent: "text-[#090E1A]" },
                  { value: "16.5k+", label: "Original Spares", accent: "text-slate-800" },
                  { value: "Live", label: "Counter Sync", accent: "text-emerald-700" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
                    className="rounded-2xl bg-white border border-slate-200/90 p-2.5 sm:p-3.5 shadow-2xs text-center sm:text-left"
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

            {/* Right Showroom Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-6"
            >
              <div className="relative">
                <div className="relative rounded-3xl bg-white border border-slate-200/90 p-2.5 shadow-lg shadow-slate-900/5">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                    <img
                      src="/images/hero-showroom.png"
                      alt="Maruti TVS Showroom"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Top Floating Pill */}
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-xl px-3.5 py-1.5 text-[11px] font-bold text-slate-900 shadow-sm border border-slate-200/80">
                      <Award className="h-3.5 w-3.5 text-[#E31E24]" />
                      100% Genuine TVS Parts
                    </div>

                    {/* Bottom Telemetry Bar */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 rounded-2xl bg-white/95 backdrop-blur-xl px-4 py-3 border border-slate-200/80 shadow-md">
                      <div>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-emerald-600" />
                          Maruti TVS Live Counter
                        </p>
                        <p className="text-[11px] text-slate-500">
                          20 TVS models synchronized in real time
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#090E1A] px-2.5 py-1 text-[10px] font-bold text-white shrink-0">
                        <Zap className="h-3 w-3 text-emerald-400" />
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* REFINED MARQUEE TICKER */}
        <div className="relative border-t border-slate-200/70 bg-slate-50/70 py-2.5 overflow-hidden">
          <div className="animate-marquee flex items-center gap-8 text-xs font-semibold tracking-wide text-slate-600">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODEL-FIRST TVS GENUINE PARTS AVAILABILITY (NO MRP) */}
      <PublicPartsChecker onRequestPart={(label) => openEnquiry("spare_part", label)} />

      {/* PURE LUXURY SCOOTERS LINEUP */}
      <section id="scooters" className="relative py-16 sm:py-24 bg-white overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Showroom Showcase
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#090E1A]">
                Popular TVS Scooters
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 max-w-lg">
                Book a showroom test ride or enquire about exchange &amp; finance offers at Maruti TVS.
              </p>
            </div>
            <button
              onClick={() => openEnquiry("service", "Showroom Test Ride Booking")}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-[#090E1A] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#1E293B] transition-all"
            >
              Book Test Ride
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VEHICLES.map((v) => (
              <motion.div
                key={v.id}
                whileHover={{ y: -5 }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-slate-50/80 overflow-hidden border-b border-slate-100">
                  <img
                    src={v.image}
                    alt={v.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  {v.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-slate-900 border border-slate-200/80 shadow-2xs">
                      {v.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {v.category}
                    </span>
                    <h3 className="mt-0.5 text-base font-extrabold text-[#090E1A]">{v.name}</h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{v.tagline}</p>

                    <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-[11px] font-semibold text-slate-700 border border-slate-200/70">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5 text-slate-600" />
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

                  <button
                    onClick={() => openEnquiry("vehicle", v.name)}
                    className="mt-5 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-900 hover:bg-[#090E1A] hover:text-white transition-all"
                  >
                    Enquire Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWROOM & DIRECT OWNER CONTACTS SECTION */}
      <section id="contact" className="relative py-16 sm:py-20 border-t border-slate-200/80 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 shadow-2xs">
              Authorized TVS Sub Dealer
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#090E1A]">
              Connect with Maruti TVS
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              For new TVS scooter bookings, test rides, or genuine spare parts verification, speak directly with our authorized team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Mohitbhai */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Authorized Sub Dealer
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                    <Phone className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-[#090E1A]">Mohitbhai</h3>
                <p className="text-xs text-slate-500 mt-1">Maruti TVS Sub Dealer Desk</p>
                <p className="mt-3 font-mono text-lg font-bold text-slate-900 tracking-tight">
                  +91 95104 41941
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <a
                  href="tel:+919510441941"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#090E1A] py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#1E293B] transition-all"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call Now
                </a>
                <a
                  href="https://wa.me/919510441941?text=Hi%20Mohitbhai,%20I%20am%20enquiring%20about%20Maruti%20TVS%20Parts%20/%20Scooters"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Card 2: Sagarbhai */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Authorized Sub Dealer
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                    <Phone className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-[#090E1A]">Sagarbhai</h3>
                <p className="text-xs text-slate-500 mt-1">Maruti TVS Sub Dealer Desk</p>
                <p className="mt-3 font-mono text-lg font-bold text-slate-900 tracking-tight">
                  +91 63553 66440
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <a
                  href="tel:+916355366440"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#090E1A] py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#1E293B] transition-all"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call Now
                </a>
                <a
                  href="https://wa.me/916355366440?text=Hi%20Sagarbhai,%20I%20am%20enquiring%20about%20Maruti%20TVS%20Parts%20/%20Scooters"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Card 3: Showroom & Timing */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200/80">
                    Showroom Desk
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-[#090E1A]">Maruti TVS Showroom</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Main Highway Road, Authorized TVS Sub Dealer Counter. Genuine Spare Parts &amp; New Scooters Showcase.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Clock className="h-4 w-4 text-slate-500" />
                  Mon – Sat: 9:30 AM – 7:30 PM
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openEnquiry("service", "Showroom Visit & Enquiry")}
                  className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-900 border border-slate-200/70 transition-colors"
                >
                  Schedule Showroom Visit
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PURE LUXURY MINIMAL LIGHT FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white mt-auto">
        <div className="h-[2px] w-full tvs-racing-bar" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-10 items-center justify-center rounded-xl bg-[#090E1A] text-white font-black italic text-xs overflow-hidden">
                  TVS
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31E24]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#090E1A]">
                    MARUTI <span className="text-[#E31E24] italic">TVS</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Authorized TVS Sub Dealer</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-xs">
                Official Maruti TVS sub-dealership offering TVS scooters and a live genuine spare parts catalog across 20 TVS models.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-bold uppercase tracking-wider text-slate-400">Direct Contact</p>
              <p className="flex items-center gap-2 text-slate-700 font-medium">
                <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <a href="tel:+919510441941" className="hover:text-slate-900 transition-colors">
                  <strong>Mohitbhai:</strong> +91 95104 41941
                </a>
              </p>
              <p className="flex items-center gap-2 text-slate-700 font-medium">
                <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <a href="tel:+916355366440" className="hover:text-slate-900 transition-colors">
                  <strong>Sagarbhai:</strong> +91 63553 66440
                </a>
              </p>
              <p className="flex items-center gap-2 text-slate-700 font-medium">
                <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                Mon – Sat: 9:30 AM – 7:30 PM
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Authorized Access
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-[#090E1A] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#1E293B] transition-all"
              >
                <Lock className="h-3.5 w-3.5 text-slate-300" />
                Admin Inventory Login
              </Link>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Protected owner inventory counter
              </p>
            </div>
          </div>

          {/* BOTTOM SIGNATURE BAR: WITH "WEBSITE DESIGNED & DEVELOPED BY ASTHA WEB-DEVELOPER" */}
          <div className="mt-10 border-t border-slate-200/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} <strong className="text-slate-900">Maruti TVS</strong> &bull; Authorized TVS Sub Dealer. All rights reserved.
            </p>

            {/* Signature Pill */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Website</span>
              <span className="text-slate-500 font-medium">Designed &amp; Developed by</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-900 border border-slate-200/80 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-900 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-900" />
                </span>
                <span className="font-extrabold text-slate-900 tracking-tight">
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
