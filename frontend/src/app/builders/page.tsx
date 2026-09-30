"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HardHat, Hammer, Clock, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from "lucide-react";
import { fetchApi, BuilderSlot, MOCK_BUILDERS } from "@/lib/api";

export default function BuildersPage() {
  const [builders, setBuilders] = useState<BuilderSlot[]>(MOCK_BUILDERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const b = await fetchApi<BuilderSlot[]>("/builders");
        if (b && Array.isArray(b)) setBuilders(b);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const busyCount = builders.filter(b => b.status === "busy").length;
  const freeCount = builders.length - busyCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HardHat className="text-amber-400" size={24} />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Builder Huts & Modules</h1>
          </div>
          <p className="text-xs text-slate-400">
            Monitor real-time builder availability and construction tasks across 6 builder huts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
            <span className="text-slate-400">Status: </span>
            <span className="font-bold text-amber-400">{busyCount} Busy</span>
            <span className="text-slate-500"> / </span>
            <span className="font-bold text-emerald-400">{freeCount} Free</span>
          </div>
          <Link
            href="/upgrades"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Assign Free Builder
          </Link>
        </div>
      </div>

      {/* 6 Builders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {builders.map((builder) => {
          const isBusy = builder.status === "busy";
          return (
            <div
              key={builder.id}
              className={`p-5 rounded-2xl glass-panel border transition-all text-left space-y-3 ${
                isBusy ? "border-amber-500/25 bg-amber-500/[0.02]" : "border-white/5 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isBusy ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-white/5 text-slate-400 border border-white/10"
                  }`}>
                    #{builder.builder_index}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{builder.name}</h3>
                    <p className="text-[10px] text-slate-400">
                      {builder.builder_index === 6 ? "Builder Base B.O.B Module" : "Main Village Master Builder"}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isBusy 
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                    : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                }`}>
                  {isBusy ? "Working" : "Idle (Available)"}
                </span>
              </div>

              {/* Status & Project Details */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Current Task:</span>
                  <span className="font-bold text-white truncate max-w-[180px]">
                    {builder.current_target_name || "None (Hut Idle)"}
                  </span>
                </div>
                {builder.finishes_at && (
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span className="text-slate-400">Finishes:</span>
                    <span className="font-mono text-amber-400">
                      {new Date(builder.finishes_at).toLocaleDateString()} {new Date(builder.finishes_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Action */}
              <div className="pt-1 flex justify-between items-center text-xs">
                {isBusy ? (
                  <Link
                    href="/upgrades"
                    className="text-amber-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    View Upgrade Timer <ArrowRight size={12} />
                  </Link>
                ) : (
                  <Link
                    href="/upgrades"
                    className="w-full py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-center text-xs block transition-colors"
                  >
                    + Assign Upgrade
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Builder Efficiency */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4 text-left">
        <h3 className="font-extrabold text-base text-white">Recent Builder Assignments Log</h3>
        <div className="space-y-2">
          {[
            { builder: "Builder #5", target: "Scattershot (Lv 4)", completed: "3 days ago", duration: "17 days" },
            { builder: "Builder #6 (B.O.B)", target: "X-Bow (Lv 10)", completed: "7 days ago", duration: "15 days" },
            { builder: "Builder #1", target: "Wizard Tower (Lv 15)", completed: "12 days ago", duration: "14 days" },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <div>
                  <span className="font-bold text-white">{item.target}</span>
                  <span className="text-slate-400 ml-2">by {item.builder}</span>
                </div>
              </div>
              <div className="text-right text-slate-400">
                <span className="text-slate-300 font-medium">{item.duration}</span> • {item.completed}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
