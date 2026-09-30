"use client";

import React, { useState, useEffect } from "react";
import { 
  Hammer, Clock, Plus, CheckCircle2, XCircle, 
  Bell, AlertCircle, HardHat, Sparkles, X 
} from "lucide-react";
import { fetchApi, UpgradeItem, BuilderSlot, MOCK_UPGRADES, MOCK_BUILDERS } from "@/lib/api";
import confetti from "canvas-confetti";

export default function UpgradesPage() {
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(MOCK_UPGRADES);
  const [builders, setBuilders] = useState<BuilderSlot[]>(MOCK_BUILDERS);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New upgrade modal form
  const [newTarget, setNewTarget] = useState("Wizard Tower");
  const [fromLevel, setFromLevel] = useState(14);
  const [toLevel, setToLevel] = useState(15);
  const [builderIdx, setBuilderIdx] = useState(5);
  const [durationDays, setDurationDays] = useState(14);
  const [costAmount, setCostAmount] = useState(18000000);
  const [costType, setCostType] = useState("gold");

  useEffect(() => {
    async function load() {
      try {
        const [upg, bld] = await Promise.all([
          fetchApi<UpgradeItem[]>("/upgrades"),
          fetchApi<BuilderSlot[]>("/builders"),
        ]);
        if (upg && Array.isArray(upg)) setUpgrades(upg);
        if (bld && Array.isArray(bld)) setBuilders(bld);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      target_type: "building",
      target_name: newTarget,
      from_level: Number(fromLevel),
      to_level: Number(toLevel),
      builder_index: Number(builderIdx),
      cost_type: costType,
      cost_amount: Number(costAmount),
      duration_seconds: durationDays * 86400,
    };

    try {
      const res = await fetchApi<UpgradeItem>("/upgrades", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res && res.id) {
        setUpgrades([res, ...upgrades]);
      }
    } catch {
      // Mock addition
      const mockNew: UpgradeItem = {
        id: Date.now(),
        target_type: "building",
        target_name: newTarget,
        from_level: Number(fromLevel),
        to_level: Number(toLevel),
        builder_index: Number(builderIdx),
        cost_type: costType,
        cost_amount: Number(costAmount),
        duration_seconds: durationDays * 86400,
        started_at: new Date().toISOString(),
        completes_at: new Date(Date.now() + durationDays * 86400 * 1000).toISOString(),
        status: "active",
        reminder_enabled: true,
      };
      setUpgrades([mockNew, ...upgrades]);
    }
    setModalOpen(false);
  };

  const handleCompleteUpgrade = async (id: number) => {
    try {
      await fetchApi(`/upgrades/${id}/complete`, { method: "POST" });
    } catch {}
    setUpgrades(upgrades.map(u => u.id === id ? { ...u, status: "completed" } : u));
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
  };

  const filteredUpgrades = upgrades.filter(u => {
    if (filter === "all") return true;
    return u.status === filter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Hammer className="text-amber-400" size={24} />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Active Upgrades & Timers</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time countdowns, builder allocations, and schedule reminders.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus size={15} /> Queue New Upgrade
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "active", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab} Upgrades
          </button>
        ))}
      </div>

      {/* Upgrades List */}
      <div className="space-y-3">
        {filteredUpgrades.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-panel border border-white/5 text-slate-400 text-xs">
            No upgrades found in this view.
          </div>
        ) : (
          filteredUpgrades.map((u) => {
            const now = Date.now();
            const comp = new Date(u.completes_at).getTime();
            const start = new Date(u.started_at).getTime();
            const total = Math.max(1, comp - start);
            const elapsed = Math.max(0, now - start);
            const pct = Math.min(100, Math.round((elapsed / total) * 100));

            const remMs = Math.max(0, comp - now);
            const remHours = Math.floor(remMs / (3600 * 1000));
            const remDays = Math.floor(remHours / 24);
            const remHoursMod = remHours % 24;
            const formatted = u.status === "completed" 
              ? "Completed" 
              : remDays > 0 ? `${remDays}d ${remHoursMod}h remaining` : `${remHours}h remaining`;

            return (
              <div 
                key={u.id}
                className="p-5 rounded-2xl glass-panel border border-white/5 hover:border-white/15 transition-all text-left space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                      {u.builder_index > 0 ? `#${u.builder_index}` : "Lab"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{u.target_name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Lv {u.from_level} → {u.to_level}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === "active" ? "bg-blue-500/15 text-blue-400" : "bg-emerald-500/15 text-emerald-400"
                        }`}>
                          {u.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {u.builder_index > 0 ? `Master Builder #${u.builder_index}` : "Laboratory Research Slot"} • Cost: {u.cost_amount.toLocaleString()} {u.cost_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${u.status === "completed" ? "text-emerald-400" : "text-amber-400"}`}>
                        {formatted}
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Finishes: {new Date(u.completes_at).toLocaleDateString()} {new Date(u.completes_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {u.status === "active" && (
                      <button
                        onClick={() => handleCompleteUpgrade(u.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
                      >
                        Finish Now
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                    style={{ width: `${u.status === "completed" ? 100 : pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Bell size={12} className="text-amber-400" />
                      {u.reminder_enabled ? "Alert configured (15m before)" : "Alerts off"}
                    </span>
                    <span>Started: {new Date(u.started_at).toLocaleDateString()}</span>
                  </div>
                  <span className="font-semibold text-slate-300">
                    {u.status === "completed" ? 100 : pct}% Done
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Queue Upgrade Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl glass-panel-gold p-6 border border-amber-500/30 text-left shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Hammer className="text-amber-400" size={18} />
                <h3 className="font-bold text-base text-white">Start New Upgrade</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUpgrade} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Structure</label>
                <input
                  type="text"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  placeholder="e.g. Spell Tower, Monolith, X-Bow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Current Level</label>
                  <input
                    type="number"
                    value={fromLevel}
                    onChange={(e) => setFromLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Level</label>
                  <input
                    type="number"
                    value={toLevel}
                    onChange={(e) => setToLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Assign Builder</label>
                  <select
                    value={builderIdx}
                    onChange={(e) => setBuilderIdx(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    <option value={5}>Builder #5 (Free)</option>
                    <option value={6}>Builder #6 (B.O.B Free)</option>
                    <option value={1}>Builder #1</option>
                    <option value={2}>Builder #2</option>
                    <option value={3}>Builder #3</option>
                    <option value={4}>Builder #4</option>
                    <option value={0}>Laboratory (Troop / Spell)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cost Resource</label>
                  <select
                    value={costType}
                    onChange={(e) => setCostType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    <option value="gold">Gold</option>
                    <option value="elixir">Elixir</option>
                    <option value="dark_elixir">Dark Elixir</option>
                    <option value="ore">Ores</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cost Amount</label>
                  <input
                    type="number"
                    value={costAmount}
                    onChange={(e) => setCostAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
