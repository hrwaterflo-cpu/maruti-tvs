"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogOut,
  Search,
  Plus,
  Minus,
  Edit3,
  Trash2,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Download,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Loader2,
  X,
  Layers,
} from "lucide-react";
import { supabase, SparePart, ModelSummary, Enquiry, getStockStatus } from "@/lib/supabase";
import { VEHICLES } from "@/data/vehicles";
import { INITIAL_TVS_MODELS } from "@/data/models";
import type { Session } from "@supabase/supabase-js";

const EMPTY_FORM = {
  part_no: "",
  name: "",
  assembly: "Cylinder Head Assembly",
  fig_no: "FIG.No. 01",
  vehicle_model: "TVS Scooty Streak",
  catalog_qty: 1,
  stock_qty: 10,
  min_stock: 5,
  rack_location: "A-01",
  remarks: "",
};

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

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login state (No demo autofill)
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"inventory" | "enquiries">("inventory");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [models, setModels] = useState<ModelSummary[]>(INITIAL_TVS_MODELS);
  const [modelParts, setModelParts] = useState<SparePart[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingParts, setLoadingParts] = useState(false);
  const [busyPartId, setBusyPartId] = useState<string | null>(null);

  // Filters (only visible AFTER selecting a model)
  const [search, setSearch] = useState("");
  const [assemblyFilter, setAssemblyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "in_stock" | "low_stock" | "out_of_stock">("ALL");
  const [visibleLimit, setVisibleLimit] = useState(50);

  // Add / Edit modal (NO MRP field)
  const [formOpen, setFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchModelsAndEnquiries();
    }
  }, [session]);

  async function fetchModelsAndEnquiries() {
    setLoadingModels(true);
    const [modelsRes, enqRes] = await Promise.all([
      supabase.rpc("get_tvs_model_summary"),
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
    ]);

    if (!modelsRes.error && modelsRes.data) {
      setModels(
        (modelsRes.data as ModelSummary[]).map((m) => ({
          ...m,
          total_parts: Number(m.total_parts),
          in_stock: Number(m.in_stock),
          low_stock: Number(m.low_stock),
          out_of_stock: Number(m.out_of_stock),
          total_units: Number(m.total_units),
        }))
      );
    }
    if (!enqRes.error && enqRes.data) {
      setEnquiries(enqRes.data as Enquiry[]);
    }
    setLoadingModels(false);
  }

  async function loadModelParts(modelName: string) {
    setSelectedModel(modelName);
    setSearch("");
    setAssemblyFilter("ALL");
    setStatusFilter("ALL");
    setVisibleLimit(50);
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

  async function handleRefresh() {
    await fetchModelsAndEnquiries();
    if (selectedModel) {
      await loadModelParts(selectedModel);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    const trimmed = adminId.trim();
    const mappedEmail = trimmed.includes("@")
      ? trimmed.toLowerCase()
      : `${trimmed.toLowerCase()}@marutitvs.in`;

    const { error } = await supabase.auth.signInWithPassword({
      email: mappedEmail,
      password,
    });

    setLoggingIn(false);
    if (error) {
      setLoginError("Invalid Admin ID or Password.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setModels([]);
    setModelParts([]);
    setEnquiries([]);
    setSelectedModel(null);
  }

  async function adjustStock(part: SparePart, delta: number) {
    const nextQty = Math.max(0, part.stock_qty + delta);
    if (nextQty === part.stock_qty) return;

    setBusyPartId(part.id);
    setModelParts((prev) =>
      prev.map((p) => (p.id === part.id ? { ...p, stock_qty: nextQty } : p))
    );

    const { error } = await supabase
      .from("spare_parts")
      .update({ stock_qty: nextQty })
      .eq("id", part.id);

    if (error) {
      setModelParts((prev) =>
        prev.map((p) => (p.id === part.id ? { ...p, stock_qty: part.stock_qty } : p))
      );
      alert("Stock update failed: " + error.message);
    } else {
      fetchModelsAndEnquiries();
    }
    setBusyPartId(null);
  }

  function openAddModal(defaultModel?: string) {
    setEditingPart(null);
    setForm({
      ...EMPTY_FORM,
      vehicle_model: defaultModel || selectedModel || "TVS Scooty Streak",
    });
    setFormError("");
    setFormOpen(true);
  }

  function openEditModal(part: SparePart) {
    setEditingPart(part);
    setForm({
      part_no: part.part_no,
      name: part.name,
      assembly: part.assembly,
      fig_no: part.fig_no,
      vehicle_model: part.vehicle_model,
      catalog_qty: part.catalog_qty,
      stock_qty: part.stock_qty,
      min_stock: part.min_stock,
      rack_location: part.rack_location,
      remarks: part.remarks || "",
    });
    setFormError("");
    setFormOpen(true);
  }

  async function handleSavePart(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      part_no: form.part_no.trim().toUpperCase(),
      name: form.name.trim().toUpperCase(),
      assembly: form.assembly.trim(),
      fig_no: form.fig_no.trim(),
      vehicle_model: form.vehicle_model.trim(),
      catalog_qty: Number(form.catalog_qty) || 1,
      stock_qty: Math.max(0, Number(form.stock_qty) || 0),
      min_stock: Math.max(0, Number(form.min_stock) || 0),
      price: 0,
      rack_location: form.rack_location.trim().toUpperCase() || "A-01",
      remarks: form.remarks.trim(),
    };

    if (editingPart) {
      const { data, error } = await supabase
        .from("spare_parts")
        .update(payload)
        .eq("id", editingPart.id)
        .select()
        .single();

      setSaving(false);
      if (error) {
        setFormError(error.message);
        return;
      }
      setModelParts((prev) =>
        prev.map((p) => (p.id === editingPart.id ? (data as SparePart) : p))
      );
      setFormOpen(false);
      fetchModelsAndEnquiries();
    } else {
      const { data, error } = await supabase
        .from("spare_parts")
        .insert(payload)
        .select()
        .single();

      setSaving(false);
      if (error) {
        setFormError(error.message);
        return;
      }
      if (selectedModel === payload.vehicle_model) {
        setModelParts((prev) => [data as SparePart, ...prev]);
      }
      setFormOpen(false);
      fetchModelsAndEnquiries();
    }
  }

  async function handleDeletePart(part: SparePart) {
    if (!confirm(`Delete ${part.name} (${part.part_no}) permanently?`)) return;

    const { error } = await supabase.from("spare_parts").delete().eq("id", part.id);
    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }
    setModelParts((prev) => prev.filter((p) => p.id !== part.id));
    fetchModelsAndEnquiries();
  }

  async function updateEnquiryStatus(id: string, status: Enquiry["status"]) {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (!error) {
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    }
  }

  const globalStats = useMemo(() => {
    return models.reduce(
      (acc, m) => ({
        total: acc.total + m.total_parts,
        inStock: acc.inStock + m.in_stock,
        lowStock: acc.lowStock + m.low_stock,
        outOfStock: acc.outOfStock + m.out_of_stock,
        totalUnits: acc.totalUnits + m.total_units,
      }),
      { total: 0, inStock: 0, lowStock: 0, outOfStock: 0, totalUnits: 0 }
    );
  }, [models]);

  const modelStats = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalUnits = 0;
    for (const p of modelParts) {
      const s = getStockStatus(p);
      if (s === "in_stock") inStock++;
      else if (s === "low_stock") lowStock++;
      else outOfStock++;
      totalUnits += p.stock_qty;
    }
    return { total: modelParts.length, inStock, lowStock, outOfStock, totalUnits };
  }, [modelParts]);

  const assemblies = useMemo(() => {
    return Array.from(new Set(modelParts.map((p) => p.assembly))).sort();
  }, [modelParts]);

  const filteredParts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return modelParts.filter((p) => {
      const st = getStockStatus(p);
      if (statusFilter !== "ALL" && st !== statusFilter) return false;
      if (assemblyFilter !== "ALL" && p.assembly !== assemblyFilter) return false;
      if (!q) return true;
      return (
        p.part_no.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.assembly.toLowerCase().includes(q)
      );
    });
  }, [modelParts, search, assemblyFilter, statusFilter]);

  function exportReorderCSV() {
    const reorderItems = modelParts.filter((p) => p.stock_qty <= p.min_stock);
    const headers = [
      "Part No.",
      "Part Description",
      "TVS Model",
      "Current Stock",
      "Min Alert",
      "Order Qty",
    ];
    const rows = reorderItems.map((p) => [
      p.part_no,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.vehicle_model}"`,
      p.stock_qty,
      p.min_stock,
      Math.max(5, p.min_stock * 2 - p.stock_qty),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const slug = (selectedModel || "model").toLowerCase().replace(/\s+/g, "-");
    link.download = `maruti-tvs-${slug}-reorder-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06133A]">
        <Loader2 className="h-7 w-7 animate-spin text-white" />
      </div>
    );
  }

  // LIGHT WHITE & BLUE GLASSMORPHISM LOGIN SCREEN (NO DEMO CREDENTIALS SHOWN)
  if (!session) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F8FF] via-white to-[#EBF3FF] tvs-grid-light p-4 overflow-hidden">
        <div className="fixed top-0 left-0 right-0 h-[3px] tvs-racing-bar z-20" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl animate-float-delayed" />

        <Link
          href="/"
          className="relative mb-6 inline-flex items-center gap-1.5 rounded-full glass-card px-4 py-1.5 text-xs font-bold text-[#0B2265] hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#1D4ED8]" />
          Back to Maruti TVS
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative w-full max-w-sm rounded-3xl glass-panel p-7"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex h-11 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B2265] to-[#1D4ED8] text-white font-black italic text-sm shadow-md shadow-blue-600/20 overflow-hidden">
              TVS
              <span className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#E31E24]" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-[#0B2265]">
                MARUTI <span className="text-[#E31E24] italic">TVS</span>
              </h1>
              <p className="text-xs text-slate-500">Dealer Inventory Sign In</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0B2265] mb-1.5">
                Admin ID
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="w-full rounded-xl border border-blue-200/80 bg-white/80 px-3.5 py-3 text-sm font-medium text-[#0B2265] placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2265] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-blue-200/80 bg-white/80 px-3.5 py-3 text-sm font-medium text-[#0B2265] placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-semibold text-[#E31E24]"
              >
                {loginError}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:brightness-110 disabled:opacity-60 transition-all"
            >
              {loggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4 text-sky-300" />
              )}
              {loggingIn ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // AUTHENTICATED LIGHT WHITE & BLUE GLASSMORPHISM ADMIN CONSOLE (NO MRP)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F8FF] via-white to-[#EBF3FF] flex flex-col">
      <header className="sticky top-0 z-30 border-b border-blue-100/80 bg-white/75 backdrop-blur-2xl text-[#0B2265]">
        <div className="h-[3px] w-full tvs-racing-bar" />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B2265] to-[#1D4ED8] text-white font-black italic text-xs overflow-hidden shadow-md shadow-blue-600/20">
              TVS
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E31E24]" />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-[#0B2265]">
                MARUTI <span className="text-[#E31E24] italic">TVS</span> Admin
              </h1>
              <p className="text-[11px] text-slate-500">
                {selectedModel ? selectedModel : `${models.length} TVS Models`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-blue-100 bg-white/80 px-3 py-2 text-xs font-semibold text-[#0B2265] hover:bg-blue-50"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#1D4ED8]" />
              Website
            </Link>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleRefresh}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-white/80 text-[#0B2265] hover:bg-blue-50"
              title="Refresh stock"
            >
              <RefreshCw className={`h-4 w-4 ${loadingModels || loadingParts ? "animate-spin" : ""}`} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] px-3 py-2 text-xs font-bold text-white shadow-sm hover:brightness-110 transition-all"
            >
              <LogOut className="h-3.5 w-3.5 text-sky-300" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 space-y-5">
        {/* Sliding Tab Switcher + Add Part Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex rounded-2xl border border-blue-100 bg-white p-1 shadow-2xs">
            {(["inventory", "enquiries"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                    isActive ? "text-white" : "text-slate-600 hover:text-[#0B2265]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="adminActiveTab"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-[#0B2265]"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {tab === "inventory" ? (
                      <>
                        <Package className="h-3.5 w-3.5" />
                        Parts Stock
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-3.5 w-3.5" />
                        Enquiries
                        {enquiries.filter((e) => e.status === "new").length > 0 && (
                          <span className="rounded-full bg-[#E31E24] px-1.5 py-0.5 text-[10px] text-white">
                            {enquiries.filter((e) => e.status === "new").length}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTab === "inventory" && selectedModel && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openAddModal(selectedModel)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-900/20 hover:bg-red-600 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Part
            </motion.button>
          )}
        </div>

        {/* TAB 1: MODEL-FIRST INVENTORY */}
        {activeTab === "inventory" && (
          <AnimatePresence mode="wait">
            {!selectedModel ? (
              <motion.div
                key="admin-model-picker"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Global KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-2xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total Parts
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-[#0B2265]">
                      {globalStats.total.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Across {models.length} TVS models
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-2xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      In Stock
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                      {globalStats.inStock.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-emerald-600">Healthy</p>
                  </div>
                  <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 shadow-2xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      Low Stock
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-amber-600">
                      {globalStats.lowStock.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-amber-600">Reorder soon</p>
                  </div>
                  <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-4 shadow-2xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#E31E24]">
                      Out of Stock
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-[#E31E24]">
                      {globalStats.outOfStock.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-red-600">Urgent</p>
                  </div>
                </div>

                {/* Model Selection Cards (NO search bar shown yet!) */}
                <div>
                  <div className="mb-3.5">
                    <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0B2265]">
                      Select TVS Model to Check Stock
                    </h2>
                    <p className="text-xs text-slate-500">
                      Tap any TVS model below to open its spare parts stock &amp; search.
                    </p>
                  </div>

                  {loadingModels && models.length === 0 ? (
                    <div className="rounded-2xl border border-blue-100 bg-white py-14 text-center text-slate-500">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#0B2265] mb-2" />
                      <p className="text-xs font-medium">Loading TVS models from Supabase...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {models.map((m) => {
                        const meta = getModelMeta(m.vehicle_model);
                        return (
                          <motion.button
                            key={m.vehicle_model}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => loadModelParts(m.vehicle_model)}
                            className="group text-left flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:border-[#0B2265] hover:shadow-xl hover:shadow-blue-950/10 transition-all duration-300"
                          >
                            <div className="h-1 w-full bg-slate-100 group-hover:bg-[#E31E24] transition-colors" />
                            <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                              <img
                                src={meta.image}
                                alt={m.vehicle_model}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute right-2.5 top-2.5 rounded-full bg-[#0B2265]/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                                {m.total_parts} Parts
                              </span>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#E31E24]">
                                  {meta.category}
                                </p>
                                <h3 className="mt-0.5 text-base font-extrabold text-[#0B2265]">
                                  {m.vehicle_model}
                                </h3>

                                <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-bold">
                                  <span className="rounded-lg bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-200/70">
                                    {m.in_stock} In
                                  </span>
                                  {m.low_stock > 0 && (
                                    <span className="rounded-lg bg-amber-50 text-amber-700 px-2 py-0.5 border border-amber-200/70">
                                      {m.low_stock} Low
                                    </span>
                                  )}
                                  {m.out_of_stock > 0 && (
                                    <span className="rounded-lg bg-red-50 text-[#E31E24] px-2 py-0.5 border border-red-200/70">
                                      {m.out_of_stock} Out
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B2265]">
                                <span>Open Stock</span>
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[#0B2265] group-hover:bg-[#E31E24] group-hover:text-white transition-colors">
                                  <ChevronRight className="h-4 w-4" />
                                </span>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* STEP 2: SELECTED MODEL INVENTORY (NO MRP) */
              <motion.div
                key={`admin-model-${selectedModel}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Back to Models Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white p-3.5 sm:p-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedModel(null);
                        setModelParts([]);
                        setSearch("");
                        setAssemblyFilter("ALL");
                        setStatusFilter("ALL");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-2 text-xs font-bold text-[#0B2265] hover:bg-blue-100"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      All Models
                    </motion.button>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-[#0B2265] leading-tight">
                        {selectedModel}
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        {modelStats.total} parts &bull; {modelStats.totalUnits} total units in stock
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={exportReorderCSV}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-bold text-[#0B2265] hover:bg-blue-50 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Reorder CSV ({modelStats.lowStock + modelStats.outOfStock})
                  </motion.button>
                </div>

                {/* Status Filter Pills */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: "ALL", label: "All", count: modelStats.total, active: "bg-[#0B2265] text-white border-[#0B2265]", idle: "bg-white text-[#0B2265] border-blue-100" },
                    { key: "in_stock", label: "In Stock", count: modelStats.inStock, active: "bg-emerald-600 text-white border-emerald-600", idle: "bg-white text-emerald-700 border-blue-100" },
                    { key: "low_stock", label: "Low", count: modelStats.lowStock, active: "bg-amber-500 text-white border-amber-500", idle: "bg-white text-amber-600 border-blue-100" },
                    { key: "out_of_stock", label: "Out", count: modelStats.outOfStock, active: "bg-[#E31E24] text-white border-[#E31E24]", idle: "bg-white text-[#E31E24] border-blue-100" },
                  ].map((pill) => (
                    <motion.button
                      key={pill.key}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setStatusFilter(pill.key as typeof statusFilter);
                        setVisibleLimit(50);
                      }}
                      className={`rounded-xl sm:rounded-2xl p-2 sm:p-2.5 text-center sm:text-left border shadow-2xs transition-all ${
                        statusFilter === pill.key ? pill.active : pill.idle
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase opacity-80">{pill.label}</p>
                      <p className="text-base sm:text-lg font-extrabold truncate">{pill.count}</p>
                    </motion.button>
                  ))}
                </div>

                {/* Search Bar + Assembly Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="relative sm:col-span-7">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setVisibleLimit(50);
                      }}
                      placeholder={`Search ${selectedModel} by Part No. or Part Description...`}
                      className="w-full rounded-xl border border-blue-100 bg-white pl-10 pr-4 py-2.5 text-sm text-[#06133A] shadow-2xs outline-none focus:border-[#0B2265] focus:ring-4 focus:ring-blue-900/10 transition-all"
                    />
                  </div>

                  <div className="relative sm:col-span-5">
                    <Layers className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={assemblyFilter}
                      onChange={(e) => {
                        setAssemblyFilter(e.target.value);
                        setVisibleLimit(50);
                      }}
                      className="w-full rounded-xl border border-blue-100 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 shadow-2xs outline-none focus:border-[#0B2265]"
                    >
                      <option value="ALL">All Assemblies ({assemblies.length})</option>
                      {assemblies.map((asm) => (
                        <option key={asm} value={asm}>
                          {asm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {loadingParts ? (
                  <div className="rounded-2xl border border-blue-100 bg-white py-14 text-center text-slate-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#0B2265] mb-2" />
                    <p className="text-xs font-medium">Loading {selectedModel} parts...</p>
                  </div>
                ) : filteredParts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center px-4">
                    <Package className="mx-auto h-9 w-9 text-slate-300 mb-2.5" />
                    <p className="text-sm font-bold text-[#0B2265]">No parts match your search</p>
                  </div>
                ) : (
                  <>
                    {/* MOBILE CARD VIEW (< md) — NO MRP */}
                    <div className="md:hidden space-y-3">
                      {filteredParts.slice(0, visibleLimit).map((part) => {
                        const status = getStockStatus(part);
                        const isBusy = busyPartId === part.id;
                        return (
                          <div
                            key={part.id}
                            className="rounded-2xl border border-blue-100 bg-white p-4 space-y-3 shadow-2xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-[#0B2265]">
                                  {part.part_no}
                                </span>
                                <h3 className="mt-1.5 text-sm font-extrabold text-[#06133A] leading-snug">
                                  {part.name}
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {part.vehicle_model} &bull; {part.assembly}
                                </p>
                              </div>

                              {status === "in_stock" && (
                                <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="h-3 w-3" />
                                  In Stock
                                </span>
                              )}
                              {status === "low_stock" && (
                                <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                                  <AlertTriangle className="h-3 w-3" />
                                  Low Stock
                                </span>
                              )}
                              {status === "out_of_stock" && (
                                <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-[#E31E24] border border-red-200">
                                  <XCircle className="h-3 w-3" />
                                  Out
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                              {/* Tactile Animated Stock Stepper */}
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileTap={{ scale: 0.88 }}
                                  disabled={isBusy || part.stock_qty <= 0}
                                  onClick={() => adjustStock(part, -1)}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#06133A] active:bg-red-100 disabled:opacity-40"
                                  aria-label="Decrease stock"
                                >
                                  <Minus className="h-4 w-4" />
                                </motion.button>
                                <motion.span
                                  key={part.stock_qty}
                                  initial={{ scale: 1.25, color: "#E31E24" }}
                                  animate={{ scale: 1, color: "#0B2265" }}
                                  transition={{ duration: 0.2 }}
                                  className="w-10 text-center text-lg font-extrabold"
                                >
                                  {part.stock_qty}
                                </motion.span>
                                <motion.button
                                  whileTap={{ scale: 0.88 }}
                                  disabled={isBusy}
                                  onClick={() => adjustStock(part, 1)}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#06133A] active:bg-emerald-100 disabled:opacity-40"
                                  aria-label="Increase stock"
                                >
                                  <Plus className="h-4 w-4" />
                                </motion.button>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => openEditModal(part)}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-[#0B2265] active:bg-blue-50"
                                  aria-label="Edit part"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePart(part)}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-[#E31E24] active:bg-red-50"
                                  aria-label="Delete part"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* DESKTOP TABLE VIEW (md+) — NO MRP */}
                    <div className="hidden md:block rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-blue-100 bg-blue-50/50 text-[11px] font-bold uppercase tracking-wider text-[#0B2265]/80">
                              <th className="py-3.5 px-4">Part No.</th>
                              <th className="py-3.5 px-4">Part Description</th>
                              <th className="py-3.5 px-4">TVS Model</th>
                              <th className="py-3.5 px-4 text-center">Stock Control</th>
                              <th className="py-3.5 px-4">Status</th>
                              <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredParts.slice(0, visibleLimit).map((part) => {
                              const status = getStockStatus(part);
                              const isBusy = busyPartId === part.id;
                              return (
                                <tr key={part.id} className="hover:bg-blue-50/35 transition-colors">
                                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#0B2265] whitespace-nowrap">
                                    {part.part_no}
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <p className="font-bold text-[#06133A]">{part.name}</p>
                                    <p className="text-[11px] text-slate-500">
                                      {part.assembly} &bull; {part.fig_no}
                                    </p>
                                  </td>
                                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 whitespace-nowrap">
                                    {part.vehicle_model}
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                      <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        disabled={isBusy || part.stock_qty <= 0}
                                        onClick={() => adjustStock(part, -1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-[#E31E24] disabled:opacity-40 transition-colors"
                                        title="Decrease stock"
                                      >
                                        <Minus className="h-3.5 w-3.5" />
                                      </motion.button>
                                      <motion.span
                                        key={part.stock_qty}
                                        initial={{ scale: 1.25, color: "#E31E24" }}
                                        animate={{ scale: 1, color: "#0B2265" }}
                                        transition={{ duration: 0.2 }}
                                        className="w-10 text-center text-sm font-extrabold"
                                      >
                                        {part.stock_qty}
                                      </motion.span>
                                      <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        disabled={isBusy}
                                        onClick={() => adjustStock(part, 1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 transition-colors"
                                        title="Increase stock"
                                      >
                                        <Plus className="h-3.5 w-3.5" />
                                      </motion.button>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    {status === "in_stock" && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="h-3 w-3" />
                                        In Stock
                                      </span>
                                    )}
                                    {status === "low_stock" && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                                        <AlertTriangle className="h-3 w-3" />
                                        Low Stock
                                      </span>
                                    )}
                                    {status === "out_of_stock" && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#E31E24] border border-red-200">
                                        <XCircle className="h-3 w-3" />
                                        Out of Stock
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        onClick={() => openEditModal(part)}
                                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#0B2265] transition-colors"
                                        title="Edit part"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePart(part)}
                                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-[#E31E24] transition-colors"
                                        title="Delete part"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {filteredParts.length > visibleLimit && (
                      <div className="text-center pt-1">
                        <button
                          onClick={() => setVisibleLimit((v) => v + 50)}
                          className="rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-xs font-bold text-[#0B2265] hover:bg-blue-50 transition-colors"
                        >
                          Load More ({filteredParts.length - visibleLimit} remaining)
                        </button>
                      </div>
                    )}

                    <p className="text-center text-xs text-slate-400 pb-4">
                      Showing {Math.min(visibleLimit, filteredParts.length)} of{" "}
                      {filteredParts.length} matching parts ({modelParts.length} total in{" "}
                      {selectedModel})
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === "enquiries" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-2xs"
          >
            {enquiries.length === 0 ? (
              <div className="py-14 text-center text-slate-500 px-4">
                <MessageSquare className="mx-auto h-9 w-9 text-slate-300 mb-2.5" />
                <p className="text-sm font-bold text-[#0B2265]">No enquiries yet</p>
                <p className="text-xs mt-1">
                  Customer part requests and test ride bookings will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-[#0B2265]">
                          {enq.enquiry_type.replace("_", " ")}
                        </span>
                        <span className="text-sm font-extrabold text-[#06133A]">
                          {enq.item_name}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {enq.customer_name} &bull;{" "}
                        <a href={`tel:${enq.phone}`} className="text-[#E31E24] hover:underline">
                          {enq.phone}
                        </a>
                      </p>
                      {enq.message && (
                        <p className="mt-1 text-xs text-slate-500">&ldquo;{enq.message}&rdquo;</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(["new", "contacted", "resolved"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateEnquiryStatus(enq.id, st)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize border transition-colors ${
                            enq.status === st
                              ? st === "resolved"
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : st === "contacted"
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-[#0B2265] text-white border-[#0B2265]"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
        {/* Admin Footer with Developer Signature */}
        <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-blue-100">
          <p>&copy; {new Date().getFullYear()} Maruti TVS &bull; Authorized Sub Dealer</p>
          <div className="flex items-center gap-1.5">
            <span>Website Designed &amp; Developed by</span>
            <span className="font-bold text-[#0B2265]">Astha Web-Developer</span>
          </div>
        </div>
      </main>

      {/* ANIMATED ADD / EDIT PART MODAL (NO MRP) */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#06133A]/65 backdrop-blur-sm p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl border border-blue-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setFormOpen(false)}
                className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-base font-extrabold text-[#0B2265] mb-4">
                {editingPart ? "Edit TVS Spare Part" : "Add TVS Spare Part"}
              </h2>

              <form onSubmit={handleSavePart} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Part No. *
                    </label>
                    <input
                      required
                      value={form.part_no}
                      onChange={(e) => setForm({ ...form, part_no: e.target.value })}
                      placeholder="e.g. K3080820"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-[#0B2265]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      TVS Model *
                    </label>
                    <input
                      required
                      value={form.vehicle_model}
                      onChange={(e) => setForm({ ...form, vehicle_model: e.target.value })}
                      placeholder="TVS Scooty Streak"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0B2265]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Part Description *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. V - BELT DRIVE"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0B2265]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assembly *
                  </label>
                  <input
                    required
                    value={form.assembly}
                    onChange={(e) => setForm({ ...form, assembly: e.target.value })}
                    placeholder="e.g. Clutch & Variamatic Assembly"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0B2265]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Stock Qty *
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={form.stock_qty}
                      onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold outline-none focus:border-[#0B2265]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={form.min_stock}
                      onChange={(e) => setForm({ ...form, min_stock: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0B2265]"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-[#E31E24]">
                    {formError}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-60"
                  >
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {editingPart ? "Save Changes" : "Add Part"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
