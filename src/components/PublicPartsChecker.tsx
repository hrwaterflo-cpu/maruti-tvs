"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  ArrowLeft,
  ChevronRight,
  Loader2,
  BellRing,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { supabase, SparePart, ModelSummary, getStockStatus } from "@/lib/supabase";
import { VEHICLES } from "@/data/vehicles";
import { INITIAL_TVS_MODELS } from "@/data/models";

interface PublicPartsCheckerProps {
  onRequestPart: (partLabel: string) => void;
}

function getModelMeta(modelName: string) {
  const lower = modelName.toLowerCase();
  const matched = VEHICLES.find((v) => v.name.toLowerCase() === lower);
  if (matched) {
    return { image: matched.image, category: matched.category };
  }
  if (lower.includes("iqube")) return { image: "/images/iqube-ev.png", category: "Electric" };
  if (lower.includes("jupiter")) return { image: "/images/jupiter-125.png", category: "Scooter" };
  if (lower.includes("ntorq") || lower.includes("raider") || lower.includes("apache") || lower.includes("ronin")) {
    return { image: "/images/ntorq-125.png", category: "Motorcycle" };
  }
  if (lower.includes("scooty") || lower.includes("pep") || lower.includes("wego")) {
    return { image: "/images/scooty-streak.png", category: "Scooter" };
  }
  if (lower.includes("xl")) return { image: "/images/jupiter-125.png", category: "Moped" };
  return { image: "/images/ntorq-125.png", category: "TVS Two-Wheeler" };
}

export default function PublicPartsChecker({ onRequestPart }: PublicPartsCheckerProps) {
  const [models, setModels] = useState<ModelSummary[]>(INITIAL_TVS_MODELS);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modelParts, setModelParts] = useState<SparePart[]>([]);
  const [loadingParts, setLoadingParts] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedAssembly, setSelectedAssembly] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "in_stock" | "low_stock" | "out_of_stock">("ALL");
  const [showCount, setShowCount] = useState(18);

  useEffect(() => {
    async function loadModels() {
      const { data, error } = await supabase.rpc("get_tvs_model_summary");
      if (!error && data && Array.isArray(data) && data.length > 0) {
        setModels(
          (data as ModelSummary[]).map((m) => ({
            ...m,
            total_parts: Number(m.total_parts),
            in_stock: Number(m.in_stock),
            low_stock: Number(m.low_stock),
            out_of_stock: Number(m.out_of_stock),
            total_units: Number(m.total_units),
          }))
        );
      }
    }
    loadModels();
  }, []);

  async function selectModel(modelName: string) {
    setSelectedModel(modelName);
    setSearch("");
    setSelectedAssembly("ALL");
    setStatusFilter("ALL");
    setShowCount(18);
    setLoadingParts(true);

    const allRows: SparePart[] = [];
    let from = 0;
    const step = 999;
    while (true) {
      const { data, error } = await supabase
        .from("spare_parts")
        .select("*")
        .eq("vehicle_model", modelName)
        .order("fig_no", { ascending: true })
        .order("name", { ascending: true })
        .range(from, from + step);

      if (error || !data || data.length === 0) break;
      allRows.push(...(data as SparePart[]));
      if (data.length <= step) break;
      from += step + 1;
    }

    setModelParts(allRows);
    setLoadingParts(false);
  }

  const assemblies = useMemo(() => {
    return Array.from(new Set(modelParts.map((p) => p.assembly))).sort();
  }, [modelParts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return modelParts.filter((part) => {
      const status = getStockStatus(part);
      if (statusFilter !== "ALL" && status !== statusFilter) return false;
      if (selectedAssembly !== "ALL" && part.assembly !== selectedAssembly) return false;
      if (!q) return true;
      return (
        part.name.toLowerCase().includes(q) ||
        part.part_no.toLowerCase().includes(q) ||
        part.assembly.toLowerCase().includes(q)
      );
    });
  }, [modelParts, search, selectedAssembly, statusFilter]);

  return (
    <section
      id="spare-parts"
      className="relative py-16 sm:py-24 bg-slate-50/50 tvs-dot-light border-y border-slate-200/70"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
              TVS Genuine Parts &bull; {models.length} Models Supported
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#090E1A]">
              {selectedModel ? `${selectedModel} Spare Parts` : "Select Your TVS Model"}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 max-w-xl">
              {selectedModel
                ? "Live real-time inventory counter for Maruti TVS Authorized Sub Dealer."
                : "Choose your TVS model first to check genuine spare parts availability."}
            </p>
          </div>

          {selectedModel && (
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSelectedModel(null);
                setModelParts([]);
                setSearch("");
                setSelectedAssembly("ALL");
                setStatusFilter("ALL");
              }}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 shadow-2xs transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All TVS Models
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!selectedModel ? (
            /* STEP 1: ALL TVS MODELS GRID */
            <div
              key="model-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {models.map((m) => {
                const meta = getModelMeta(m.vehicle_model);
                const available = m.in_stock + m.low_stock;
                return (
                  <motion.button
                    key={m.vehicle_model}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectModel(m.vehicle_model)}
                    className="group relative text-left flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-400 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300"
                  >
                    <div className="relative aspect-[16/9] w-full bg-slate-50/80 overflow-hidden border-b border-slate-100">
                      <img
                        src={meta.image}
                        alt={m.vehicle_model}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500"
                      />
                      <span className="absolute right-2.5 top-2.5 rounded-full bg-[#090E1A]/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                        {m.total_parts} Parts
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {meta.category}
                        </p>
                        <h3 className="mt-0.5 text-base font-extrabold text-[#090E1A]">
                          {m.vehicle_model}
                        </h3>
                      </div>

                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        <span className="inline-flex items-center gap-1.5 text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {available} Available
                        </span>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 group-hover:bg-[#090E1A] group-hover:text-white transition-colors">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            /* STEP 2: SELECTED MODEL PARTS LIST (NO MRP) */
            <motion.div
              key={`model-parts-${selectedModel}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="relative sm:col-span-6">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowCount(18);
                      }}
                      placeholder={`Search ${selectedModel} part no. or name...`}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#090E1A] focus:ring-2 focus:ring-slate-900/10 transition-all"
                    />
                  </div>

                  <div className="relative sm:col-span-4">
                    <Layers className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={selectedAssembly}
                      onChange={(e) => {
                        setSelectedAssembly(e.target.value);
                        setShowCount(18);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-[#090E1A]"
                    >
                      <option value="ALL">All Assemblies ({assemblies.length})</option>
                      {assemblies.map((asm) => (
                        <option key={asm} value={asm}>
                          {asm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#090E1A]"
                    >
                      <option value="ALL">All Status</option>
                      <option value="in_stock">Available</option>
                      <option value="low_stock">Limited</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {["Brake", "Piston", "Clutch", "Spark Plug", "Gasket", "Cable", "Head Lamp"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setSearch(term)}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-[#090E1A] hover:text-white transition-colors"
                      >
                        {term}
                      </button>
                    )
                  )}
                  {(search || selectedAssembly !== "ALL" || statusFilter !== "ALL") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setSelectedAssembly("ALL");
                        setStatusFilter("ALL");
                      }}
                      className="ml-auto text-xs font-bold text-[#E31E24] hover:underline"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {loadingParts ? (
                <div className="flex flex-col items-center justify-center py-14 text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin text-[#090E1A] mb-2.5" />
                  <p className="text-xs font-medium">Loading {selectedModel} genuine parts...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center px-4">
                  <Package className="mx-auto h-8 w-8 text-slate-400 mb-2.5" />
                  <h3 className="text-base font-bold text-[#090E1A]">No matching spare part found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Send a quick request and Maruti TVS will arrange the genuine part directly.
                  </p>
                  <button
                    onClick={() =>
                      onRequestPart(`${selectedModel} — ${search || "Spare Part Request"}`)
                    }
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#090E1A] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                  >
                    <BellRing className="h-3.5 w-3.5" />
                    Request Part
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.slice(0, showCount).map((part) => {
                      const status = getStockStatus(part);
                      return (
                        <div
                          key={part.id}
                          className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800">
                                {part.part_no}
                              </span>
                              {status === "in_stock" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/80">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Available
                                </span>
                              )}
                              {status === "low_stock" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/80">
                                  <AlertTriangle className="h-3 w-3" />
                                  Limited
                                </span>
                              )}
                              {status === "out_of_stock" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 border border-slate-200">
                                  <XCircle className="h-3 w-3" />
                                  Out of Stock
                                </span>
                              )}
                            </div>

                            <h3 className="mt-2.5 text-sm font-bold text-[#090E1A] leading-snug">
                              {part.name}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {part.assembly} &bull; {part.fig_no}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-400">
                              {part.vehicle_model}
                            </span>
                            <button
                              onClick={() => onRequestPart(`${part.name} (${part.part_no})`)}
                              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                                status === "out_of_stock"
                                  ? "bg-slate-100 text-slate-700 hover:bg-[#090E1A] hover:text-white"
                                  : "bg-slate-100 text-slate-800 hover:bg-[#090E1A] hover:text-white"
                              }`}
                            >
                              {status === "out_of_stock" ? "Notify Me" : "Reserve"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filtered.length > showCount && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => setShowCount((c) => c + 24)}
                        className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors"
                      >
                        Load More Parts ({filtered.length - showCount} remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
