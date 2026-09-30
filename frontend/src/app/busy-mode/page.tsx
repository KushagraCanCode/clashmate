"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Moon, Clock, Shield, Bell, CheckCircle2, 
  AlertCircle, XCircle, ArrowRight, Zap, Check 
} from "lucide-react";
import { fetchApi, BusyModeState } from "@/lib/api";

export default function BusyModePage() {
  const [busyState, setBusyState] = useState<BusyModeState | null>(null);
  const [selectedDuration, setSelectedDuration] = useState("4 hours");
  const [customHours, setCustomHours] = useState(6);
  const [allowCriticalOnly, setAllowCriticalOnly] = useState(true);
  const [notifyHeroFinish, setNotifyHeroFinish] = useState(true);
  const [notifyLabFinish, setNotifyLabFinish] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi<BusyModeState>("/busy-mode/status").then((res) => {
      if (res) setBusyState(res);
    });
  }, []);

  const getDurationSeconds = (label: string) => {
    switch (label) {
      case "1 hour": return 3600;
      case "2 hours": return 7200;
      case "4 hours": return 14400;
      case "8 hours": return 28800;
      case "Until tomorrow": return 14 * 3600;
      case "Custom": return customHours * 3600;
      default: return 14400;
    }
  };

  const handleStartBusy = async () => {
    setLoading(true);
    const seconds = getDurationSeconds(selectedDuration);
    const payload = {
      duration_label: selectedDuration === "Custom" ? `${customHours} hours` : selectedDuration,
      duration_seconds: seconds,
      allow_critical_only: allowCriticalOnly,
      notify_hero_finish: notifyHeroFinish,
      notify_lab_finish: notifyLabFinish,
    };

    try {
      const res = await fetchApi<BusyModeState>("/busy-mode/start", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setBusyState(res);
      if (typeof window !== "undefined") {
        localStorage.setItem("clashmate_busy_mode", JSON.stringify(res));
      }
    } catch {
      // Mock fallback
      const newState: BusyModeState = {
        id: Date.now(),
        is_active: true,
        duration_label: payload.duration_label,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + seconds * 1000).toISOString(),
        allow_critical_only: allowCriticalOnly,
        notify_hero_finish: notifyHeroFinish,
        notify_lab_finish: notifyLabFinish,
        next_event_title: "Archer Queen to Lv 89",
        next_event_time: new Date(Date.now() + 17.2 * 3600 * 1000).toISOString(),
      };
      setBusyState(newState);
      if (typeof window !== "undefined") {
        localStorage.setItem("clashmate_busy_mode", JSON.stringify(newState));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEndBusy = async () => {
    try {
      await fetchApi("/busy-mode/end", { method: "POST" });
    } catch {}
    const newState: BusyModeState = {
      id: null,
      is_active: false,
      duration_label: null,
      start_time: null,
      end_time: null,
      allow_critical_only: true,
      notify_hero_finish: true,
      notify_lab_finish: true,
      next_event_title: null,
      next_event_time: null,
    };
    setBusyState(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("clashmate_busy_mode", JSON.stringify(newState));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Moon className="text-amber-400" size={24} />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Busy Mode</h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            Signature Feature
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Guard your real-world focus. Silence non-critical village notifications while keeping tabs on critical events.
        </p>
      </div>

      {/* ACTIVE STATE DISPLAY */}
      {busyState?.is_active ? (
        <div className="p-8 rounded-3xl glass-panel-gold border border-emerald-500/40 bg-emerald-950/15 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Moon size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Busy Mode Active
                </span>
                <h2 className="text-xl font-black text-white">
                  You&apos;re covered until {new Date(busyState.end_time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h2>
              </div>
            </div>

            <button
              onClick={handleEndBusy}
              className="px-5 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs shadow-lg transition-all"
            >
              End Busy Mode Early
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[11px] text-slate-400 block mb-1">Next Important Event:</span>
              <p className="font-extrabold text-sm text-white">
                {busyState.next_event_title || "Archer Queen to Lv 89"}
              </p>
              <p className="text-xs text-amber-400 mt-1 font-mono">
                Scheduled finish in ~17h 12m
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 text-xs text-slate-300">
              <span className="text-[11px] text-slate-400 block mb-1">Active Filter Rules:</span>
              <p className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={13} /> Hero awake notifications enabled
              </p>
              <p className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={13} /> Critical defense finishes enabled
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* INACTIVE / ACTIVATION CONTROLS */
        <div className="space-y-6">
          
          {/* Main Activation Hero Card */}
          <div className="p-8 rounded-3xl glass-panel-gold border border-amber-500/30 text-center space-y-4 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ready to step away from Clash?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Activate Busy Mode to filter noise and silence low-priority pings. We monitor your builders in the background.
            </p>

            {/* Duration Selector */}
            <div className="pt-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                Select Away Duration:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  "1 hour",
                  "2 hours",
                  "4 hours",
                  "8 hours",
                  "Until tomorrow",
                  "Custom",
                ].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSelectedDuration(dur)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                      selectedDuration === dur
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-102"
                        : "bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>

              {selectedDuration === "Custom" && (
                <div className="mt-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center gap-3">
                  <span className="text-xs text-slate-300">Custom hours:</span>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={customHours}
                    onChange={(e) => setCustomHours(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white text-center"
                  />
                  <span className="text-xs text-slate-400">hours</span>
                </div>
              )}
            </div>

            {/* Notification Filters During Busy Mode */}
            <div className="pt-4 max-w-xl mx-auto text-left space-y-2.5 border-t border-white/10">
              <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                Event Notification Filters:
              </span>

              <label className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-white">Critical Events Only</p>
                  <p className="text-[11px] text-slate-400">Mute minor building finishes; only alert for high tier defense & hero readiness</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowCriticalOnly}
                  onChange={(e) => setAllowCriticalOnly(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-white">Hero Wake-Up Alerts</p>
                  <p className="text-[11px] text-slate-400">Always ping when a Hero finishes sleeping so you don&apos;t miss Clan War timing</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHeroFinish}
                  onChange={(e) => setNotifyHeroFinish(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-white">Laboratory Research Finished</p>
                  <p className="text-[11px] text-slate-400">Alert immediately when laboratory research finishes so lab is never idle</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyLabFinish}
                  onChange={(e) => setNotifyLabFinish(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>
            </div>

            {/* Huge Hero Action Button */}
            <div className="pt-4 max-w-md mx-auto">
              <button
                onClick={handleStartBusy}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wider uppercase shadow-2xl shadow-amber-500/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Moon size={18} className="fill-slate-950" />
                {loading ? "Activating..." : `Activate Busy Mode (${selectedDuration})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <Clock className="text-amber-400 mb-2" size={18} />
          <h4 className="font-bold text-xs text-white mb-1">Zero Downtime Guarantee</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Busy Mode calculates your next open builder hut and gently alerts you right as it finishes.
          </p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <Shield className="text-emerald-400 mb-2" size={18} />
          <h4 className="font-bold text-xs text-white mb-1">War Readiness Protection</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Never miss an attack window because a hero finished upgrading while your phone was on silent.
          </p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <Zap className="text-purple-400 mb-2" size={18} />
          <h4 className="font-bold text-xs text-white mb-1">Intelligent Priority Filter</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            You define what counts as critical: Heroes, Spells, Laboratory, or Town Hall milestones.
          </p>
        </div>
      </div>

    </div>
  );
}
