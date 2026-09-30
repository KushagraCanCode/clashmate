"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Hammer, HardHat, FlaskConical, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { MOCK_UPGRADES, UpgradeItem } from "@/lib/api";

export default function TimelinePage() {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [upgrades] = useState<UpgradeItem[]>(MOCK_UPGRADES);

  // Time window calculations
  const now = new Date();
  const daysToShow = viewMode === "day" ? 3 : viewMode === "week" ? 7 : 30;

  const dates: Date[] = [];
  for (let i = 0; i < daysToShow; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push(d);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="text-amber-400" size={24} />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Upgrade Timeline</h1>
          </div>
          <p className="text-xs text-slate-400">
            Horizontal scheduling matrix for builders, heroes, and laboratory research.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/5">
          {(["day", "week", "month"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                viewMode === mode
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {mode} view
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="lg:hidden flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-white/[0.03] border border-white/5 text-[11px] text-amber-400/90 text-center">
        <span>↔ Swipe horizontally to pan builder schedule matrix</span>
      </div>

      {/* Horizontal Gantt-Style Schedule Container */}
      <div className="p-4 sm:p-6 rounded-3xl glass-panel border border-white/5 space-y-6 overflow-x-auto text-left touch-pan-x">
        
        {/* Timeline Header Dates */}
        <div className="min-w-[750px]">
          <div className="grid grid-cols-12 gap-2 border-b border-white/10 pb-3 mb-4">
            <div className="col-span-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Track / Builder
            </div>
            <div className="col-span-9 flex justify-between text-xs text-slate-300 font-semibold px-2">
              {dates.slice(0, 6).map((d, idx) => (
                <div key={idx} className="text-center">
                  <span className="block font-bold text-white">{d.toLocaleDateString([], { weekday: 'short' })}</span>
                  <span className="text-[10px] text-slate-400">{d.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Builder Tracks */}
          <div className="space-y-4">
            {[
              { id: 1, label: "Builder #1", target: "Eagle Artillery Lv 6", left: 0, width: 65, color: "from-amber-500 to-amber-600", remaining: "1d 14h" },
              { id: 2, label: "Builder #2", target: "Monolith Lv 2", left: 0, width: 85, color: "from-amber-600 to-amber-700", remaining: "2d 6h" },
              { id: 3, label: "Builder #3", target: "Archer Queen Lv 89", left: 0, width: 35, color: "from-purple-500 to-indigo-600", remaining: "17h" },
              { id: 4, label: "Builder #4", target: "Clan Castle Lv 11", left: 0, width: 95, color: "from-blue-500 to-blue-600", remaining: "3d 10h" },
              { id: 5, label: "Builder #5", target: "Free / Idle", left: 0, width: 0, color: "", remaining: "Available" },
              { id: 6, label: "B.O.B Module", target: "Free / Idle", left: 0, width: 0, color: "", remaining: "Available" },
              { id: 0, label: "Laboratory", target: "Electro Titan Lv 3", left: 0, width: 45, color: "from-emerald-500 to-teal-600", remaining: "22h 30m" },
            ].map((track) => (
              <div key={track.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-white/[0.03]">
                {/* Track label */}
                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300">
                    {track.id === 0 ? <FlaskConical size={13} className="text-purple-400" /> : `#${track.id}`}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{track.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{track.target}</p>
                  </div>
                </div>

                {/* Timeline Gantt Bar */}
                <div className="col-span-9 relative h-10 rounded-xl bg-white/[0.02] border border-white/5 p-1 flex items-center">
                  {track.width > 0 ? (
                    <div 
                      className={`h-full rounded-lg bg-gradient-to-r ${track.color} px-3 flex items-center justify-between text-xs text-slate-950 font-bold shadow-md transition-all`}
                      style={{ width: `${track.width}%` }}
                    >
                      <span className="truncate pr-2">{track.target}</span>
                      <span className="text-[10px] font-mono shrink-0 bg-black/20 text-white px-1.5 py-0.5 rounded">
                        {track.remaining}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full text-center text-[11px] text-slate-500 font-medium">
                      Idle — Ready for immediate assignment
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Strategic timeline hint */}
      <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-400" />
          <span><b>Timeline Tip:</b> Builder #3 and Laboratory finish within 5 hours of each other tomorrow. Ensure you have ~35M Elixir/DE ready to maximize builder cycle.</span>
        </div>
        <Link href="/upgrades" className="text-amber-400 hover:underline font-semibold shrink-0">
          Manage Timers
        </Link>
      </div>

    </div>
  );
}
