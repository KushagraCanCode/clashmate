"use client";

import React, { useState } from "react";
import { 
  Shield, Moon, Bell, Copy, Check, Clock, 
  Sparkles, Hammer, Swords, ChevronUp, ChevronDown, X 
} from "lucide-react";

export default function MobileCompanionHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);
  const [villageType, setVillageType] = useState<"home" | "builder_base">("home");
  const [simulatedBanner, setSimulatedBanner] = useState<string | null>(null);

  const playerTag = "#9V8G2YLL";

  const handleCopyTag = () => {
    navigator.clipboard.writeText(playerTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const triggerMobileNotificationSim = (message: string) => {
    setSimulatedBanner(message);
    setTimeout(() => {
      setSimulatedBanner(null);
    }, 4500);
  };

  return (
    <>
      {/* Simulated Mobile Push Banner (iOS / Android Style) */}
      {simulatedBanner && (
        <div className="fixed top-3 left-3 right-3 z-50 max-w-sm mx-auto animate-in slide-in-from-top duration-300">
          <div className="p-3.5 rounded-2xl bg-[#111827]/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Shield size={16} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                <span className="font-semibold text-amber-400">ClashMate Mobile Alert</span>
                <span>now</span>
              </div>
              <p className="text-xs font-medium text-white leading-snug">{simulatedBanner}</p>
            </div>
            <button 
              onClick={() => setSimulatedBanner(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating HUD Trigger Button (Mobile Viewports Only) */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Mobile Companion HUD"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 shadow-xl shadow-amber-500/10 backdrop-blur-md active:scale-95 transition-all text-xs font-bold"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Mobile HUD</span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* Mobile In-Game Quick Companion Drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#0f172a] border-t border-amber-500/30 rounded-t-3xl p-5 pb-8 shadow-2xl max-w-md w-full mx-auto animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xs">
                  COC
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">In-Game Mobile Companion</h4>
                  <p className="text-[10px] text-slate-400">Quick-access telemetry while in Clash of Clans</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Village Selector Tab (Home Village vs Builder Base) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/5 mb-3 text-xs font-semibold">
              <button
                onClick={() => setVillageType("home")}
                className={`py-1.5 rounded-lg transition-colors ${
                  villageType === "home" 
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🏰 Home Village (TH15)
              </button>
              <button
                onClick={() => setVillageType("builder_base")}
                className={`py-1.5 rounded-lg transition-colors ${
                  villageType === "builder_base" 
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🔨 Builder Base (BH10)
              </button>
            </div>

            {/* Quick Player Tag Copy */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Player Tag:</span>
                <span className="font-mono font-bold text-amber-400">{playerTag}</span>
              </div>
              <button
                onClick={handleCopyTag}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[11px] font-semibold text-amber-300 transition-colors"
              >
                {copiedTag ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Tag</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Timers Summary */}
            {villageType === "home" ? (
              <div className="space-y-2 mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Hammer size={14} className="text-amber-400" />
                    <span className="text-slate-300 font-medium">Next Builder Free:</span>
                  </div>
                  <span className="text-amber-400 font-bold font-mono">2h 14m</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Swords size={14} className="text-purple-400" />
                    <span className="text-slate-300 font-medium">Hero Alert (Queen):</span>
                  </div>
                  <span className="text-purple-400 font-bold font-mono">Awake in 17m</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-400" />
                    <span className="text-slate-300 font-medium">Lab Research:</span>
                  </div>
                  <span className="text-blue-400 font-bold font-mono">Electro Titan Lv 3 (1d 4h)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Hammer size={14} className="text-indigo-400" />
                    <span className="text-slate-300 font-medium">B.O.B Builder:</span>
                  </div>
                  <span className="text-indigo-400 font-bold font-mono">Mega Tesla Lv 10 (14h)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Swords size={14} className="text-purple-400" />
                    <span className="text-slate-300 font-medium">Battle Copter:</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">Ready for Attack</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => triggerMobileNotificationSim("⚔️ Archer Queen finished upgrading to Lv 89! Ready for Clan War attack.")}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Bell size={13} className="text-amber-400" />
                <span>Test Phone Alert</span>
              </button>
              <button
                onClick={() => triggerMobileNotificationSim("🌙 Busy Mode activated for 2 hours. Normal notifications silenced.")}
                className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Moon size={13} className="text-amber-400" />
                <span>Quick 2h Silence</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
