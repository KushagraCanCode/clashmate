"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield, Moon, Sparkles, Hammer, HardHat, Clock, 
  ChevronRight, AlertTriangle, CheckCircle2, ArrowUpRight, 
  Zap, Swords, FlaskConical, Award, Activity 
} from "lucide-react";
import { 
  fetchApi, VillageSummary, BuilderSlot, HeroItem, 
  UpgradeItem, AIInsight, BusyModeState, MOCK_SUMMARY, 
  MOCK_BUILDERS, MOCK_HEROES, MOCK_UPGRADES, MOCK_INSIGHTS 
} from "@/lib/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState<VillageSummary>(MOCK_SUMMARY);
  const [builders, setBuilders] = useState<BuilderSlot[]>(MOCK_BUILDERS);
  const [heroes, setHeroes] = useState<HeroItem[]>(MOCK_HEROES);
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(MOCK_UPGRADES);
  const [insights, setInsights] = useState<AIInsight[]>(MOCK_INSIGHTS);
  const [busyState, setBusyState] = useState<BusyModeState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sum, bld, hro, upg, ins, bsy] = await Promise.all([
          fetchApi<VillageSummary>("/villages/active/summary"),
          fetchApi<BuilderSlot[]>("/builders"),
          fetchApi<HeroItem[]>("/heroes"),
          fetchApi<UpgradeItem[]>("/upgrades?status=active"),
          fetchApi<AIInsight[]>("/ai/insights"),
          fetchApi<BusyModeState>("/busy-mode/status"),
        ]);
        if (sum?.village) setSummary(sum);
        if (bld && Array.isArray(bld)) setBuilders(bld);
        if (hro && Array.isArray(hro)) setHeroes(hro);
        if (upg && Array.isArray(upg)) setUpgrades(upg);
        if (ins && Array.isArray(ins)) setInsights(ins);
        if (bsy) setBusyState(bsy);
      } catch (err) {
        // Fallback to mocks
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeUpgrades = upgrades.filter(u => u.status === "active");
  const busyCount = builders.filter(b => b.status === "busy").length;
  const freeCount = builders.length - busyCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            Good morning, <span className="gold-gradient-text">Chief Arthur</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Village Fortress (#9V8G2YLL) • Legends Alliance • 4,850 Trophies
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/busy-mode"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
              busyState?.is_active
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20"
            }`}
          >
            <Moon size={14} className={busyState?.is_active ? "text-emerald-400" : "fill-slate-950"} />
            {busyState?.is_active ? `Busy Active (${busyState.duration_label})` : "I'M BUSY"}
          </Link>
          <Link
            href="/upgrades"
            className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Hammer size={14} className="text-amber-400" />
            + New Upgrade
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Town Hall & Overall Progress */}
        <div className="p-5 rounded-2xl glass-panel border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Town Hall</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 font-extrabold text-xs border border-amber-500/20">
              TH15
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-black text-white">88.4%</span>
            <span className="text-xs text-emerald-400 font-semibold">+1.2% this week</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: "88.4%" }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Overall Village Maxed Progress</p>
        </div>

        {/* Builder Availability */}
        <div className="p-5 rounded-2xl glass-panel border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Builders</span>
            <HardHat size={16} className="text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-black text-white">{freeCount} Free</span>
            <span className="text-xs text-amber-400 font-semibold">{busyCount} / {builders.length} Busy</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full" 
              style={{ width: `${(busyCount / builders.length) * 100}%` }} 
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {freeCount > 0 ? `${freeCount} builders available for queue` : "All builders active"}
          </p>
        </div>

        {/* Laboratory Status */}
        <div className="p-5 rounded-2xl glass-panel border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Laboratory</span>
            <FlaskConical size={16} className="text-purple-400" />
          </div>
          <p className="text-sm font-bold text-white truncate mb-1">Electro Titan Lv 3</p>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-purple-400 font-mono font-semibold">22h 30m left</span>
            <span className="text-[10px] text-slate-400 font-semibold">92%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: "92%" }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Laboratory active without delay</p>
        </div>

        {/* Next Important Event */}
        <div className="p-5 rounded-2xl glass-panel-gold border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Next Finish</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <p className="text-sm font-bold text-white truncate mb-1">
            {summary.stats.next_event?.title || "Archer Queen to Lv 89"}
          </p>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xl font-mono font-black text-amber-400">
              {summary.stats.next_event?.formatted_remaining || "17h 12m"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span>Reminder will trigger 15m before</span>
          </div>
        </div>

      </div>

      {/* 3. Hero Status Row */}
      <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords size={16} className="text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Hero Altar Status</h3>
          </div>
          <Link href="/village" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">
            View All Heroes <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {heroes.map((hero) => (
            <div 
              key={hero.id} 
              className={`p-3.5 rounded-xl border transition-all text-left ${
                hero.is_upgrading 
                  ? "bg-amber-500/[0.06] border-amber-500/25" 
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white">{hero.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  hero.is_upgrading 
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                    : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                }`}>
                  {hero.is_upgrading ? "Upgrading 💤" : "Ready ⚔️"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Level {hero.level} / {hero.max_level}</span>
                <span className="text-[11px] text-slate-400">Ability: Lv {hero.ability_level}</span>
              </div>
              {hero.pet_assigned && (
                <p className="text-[10px] text-slate-400 mt-1">Pet: {hero.pet_assigned}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Upgrades & AI Insights Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Active Upgrades Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hammer size={16} className="text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">Active Upgrades in Progress</h3>
              <span className="text-xs text-slate-400">({activeUpgrades.length})</span>
            </div>
            <Link href="/upgrades" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">
              Manage All <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {activeUpgrades.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active upgrades running. Add your first upgrade to start tracking your village.
              </div>
            ) : (
              activeUpgrades.map((u) => {
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
                const formatted = remDays > 0 ? `${remDays}d ${remHoursMod}h` : `${remHours}h`;

                return (
                  <div key={u.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{u.target_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                          Lv {u.from_level} → {u.to_level}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {u.builder_index > 0 ? `Builder #${u.builder_index}` : "Laboratory"}
                        </span>
                      </div>
                      <span className="text-amber-400 font-mono font-bold text-xs">{formatted} left</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Cost: {u.cost_amount.toLocaleString()} {u.cost_type.replace('_', ' ')}</span>
                      <span>Finish: {new Date(u.completes_at).toLocaleDateString()} {new Date(u.completes_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right (1 col): AI Insights & Busy Mode Snapshot */}
        <div className="space-y-4">
          
          {/* AI Insights Card */}
          <div className="p-5 rounded-2xl glass-panel-ai border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-extrabold text-sm">
                <Sparkles size={16} />
                <span>AI Strategic Insights</span>
              </div>
              <Link href="/ai" className="text-[11px] text-purple-400 hover:underline flex items-center gap-1">
                Chat AI <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {insights.slice(0, 3).map((ins) => (
                <div key={ins.id} className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-purple-200">{ins.title}</p>
                    <span className="text-[9px] font-semibold text-purple-400 uppercase tracking-wider">{ins.impact}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug mb-2">{ins.description}</p>
                  {ins.action_label && ins.action_url && (
                    <Link
                      href={ins.action_url}
                      className="text-[10px] text-amber-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      {ins.action_label} <ArrowUpRight size={10} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Busy Mode Signature Shortcut */}
          <div className="p-5 rounded-2xl glass-panel-gold border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Moon size={16} />
                <span>Busy Mode Status</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                busyState?.is_active ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-400"
              }`}>
                {busyState?.is_active ? "Active" : "Standby"}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {busyState?.is_active 
                ? `Protected for ${busyState.duration_label}. Non-critical alerts are muted.`
                : "Stepping away for a movie, work, or sleep? Activate Busy Mode with 1 click."}
            </p>

            <Link
              href="/busy-mode"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs text-center block transition-colors shadow-md shadow-amber-500/10"
            >
              Configure Busy Mode
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
