"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, Check, ArrowRight, ArrowLeft, Castle, Bell, 
  Moon, Sparkles, User, CheckCircle2, ChevronRight, Zap 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 2 intentions
  const [intentions, setIntentions] = useState<string[]>([
    "Upgrade tracking", "Notifications", "AI insights"
  ]);

  // Step 3 village
  const [villageData, setVillageData] = useState({
    name: "Arthur's Citadel",
    playerTag: "#9V8G2YLL",
    townHall: 15,
    builderCount: 6,
  });

  // Step 4 notifications
  const [notifPrefs, setNotifPrefs] = useState({
    upgrades: true,
    heroes: true,
    laboratory: true,
    dailySummary: true,
    timing: "15m_before",
  });

  // Step 5 busy mode
  const [busyDefault, setBusyDefault] = useState({
    duration: "4 hours",
    allowCriticalOnly: true,
    notifyHeroes: true,
  });

  const toggleIntention = (item: string) => {
    if (intentions.includes(item)) {
      setIntentions(intentions.filter((i) => i !== item));
    } else {
      setIntentions([...intentions, item]);
    }
  };

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    setTimeout(() => {
      router.push("/dashboard");
    }, 900);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 max-w-3xl mx-auto">
      <div className="w-full rounded-3xl glass-panel border border-white/10 p-6 sm:p-10 shadow-2xl relative text-left">
        
        {/* Progress Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-bold text-amber-400">Step {step} of 6</span>
            <span className="text-[11px] uppercase tracking-wider">Onboarding Setup</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Welcome to ClashMate</h2>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                &ldquo;Your village. Your schedule. Your Clash companion.&rdquo;
              </p>
              <p className="text-xs text-slate-400 mt-3 max-w-lg mx-auto leading-relaxed">
                ClashMate is an unofficial, community-focused platform built to keep you on top of your village timers, builders, and war readiness while you are away from the game.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 max-w-md mx-auto text-left text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Strict Fair-Play Platform</span>
              </div>
              <p className="text-[11px]">
                No gameplay bots, no automatic attacks, no resource collection. You remain in complete manual control of the game at all times.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Intentions */}
        {step === 2 && (
          <div className="space-y-6 py-2">
            <div>
              <h2 className="text-2xl font-extrabold text-white">How do you intend to use ClashMate?</h2>
              <p className="text-xs text-slate-400 mt-1">Select all categories that match your gameplay style and goals.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Casual player", desc: "Keep an eye on builders and avoid idle days" },
                { title: "Competitive player", desc: "Maximize hero timing and Clan War attack readiness" },
                { title: "Upgrade tracking", desc: "Accurate countdowns and builder assignment logs" },
                { title: "Analytics", desc: "Inspect builder utilization and monthly resource metrics" },
                { title: "Notifications", desc: "Configurable alerts before builders or lab finish" },
                { title: "AI insights", desc: "Strategic upgrade recommendations and village summaries" },
              ].map((opt) => {
                const selected = intentions.includes(opt.title);
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => toggleIntention(opt.title)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      selected
                        ? "bg-amber-500/15 border-amber-500/40 text-white"
                        : "bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{opt.title}</span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        selected ? "bg-amber-400 border-amber-400 text-slate-950" : "border-slate-600"
                      }`}>
                        {selected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Connect / Add Village */}
        {step === 3 && (
          <div className="space-y-6 py-2">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Add Your Village</h2>
              <p className="text-xs text-slate-400 mt-1">Connect using your player tag or initialize with realistic sample data.</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-300">Quick 1-Click Setup</p>
                  <p className="text-[11px] text-slate-400">Preload a realistic Town Hall 15 with 6 builders & active projects</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVillageData({ name: "Chief Arthur's Fortress", playerTag: "#9V8G2YLL", townHall: 15, builderCount: 6 })}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                >
                  Use Sample TH15
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Village Name</label>
                  <input
                    type="text"
                    value={villageData.name}
                    onChange={(e) => setVillageData({ ...villageData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Player Tag</label>
                  <input
                    type="text"
                    value={villageData.playerTag}
                    onChange={(e) => setVillageData({ ...villageData, playerTag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Town Hall Level (1 - 16)</label>
                  <select
                    value={villageData.townHall}
                    onChange={(e) => setVillageData({ ...villageData, townHall: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    {[16, 15, 14, 13, 12, 11, 10, 9].map((lvl) => (
                      <option key={lvl} value={lvl}>Town Hall {lvl}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Builders Count</label>
                  <select
                    value={villageData.builderCount}
                    onChange={(e) => setVillageData({ ...villageData, builderCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    <option value={6}>6 Builders (Includes B.O.B / Master Builder)</option>
                    <option value={5}>5 Builders</option>
                    <option value={4}>4 Builders</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Notifications Preferences */}
        {step === 4 && (
          <div className="space-y-6 py-2">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Notification Preferences</h2>
              <p className="text-xs text-slate-400 mt-1">Configure exactly what alerts you want and when.</p>
            </div>

            <div className="space-y-3">
              {[
                { key: "upgrades", title: "Building Upgrade Alerts", desc: "Notify when defense or resource construction finishes" },
                { key: "heroes", title: "Hero Upgrade & Awake Alerts", desc: "Notify when King, Queen, Warden, or RC is ready for battle" },
                { key: "laboratory", title: "Laboratory Research Alerts", desc: "Notify when troop or spell research concludes" },
                { key: "dailySummary", title: "Daily Village Digest", desc: "Morning summary of active builder timers and resources" },
              ].map((item) => {
                const checked = (notifPrefs as any)[item.key];
                return (
                  <div key={item.key} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </div>
                );
              })}

              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notification Timing Advance</label>
                <select
                  value={notifPrefs.timing}
                  onChange={(e) => setNotifPrefs({ ...notifPrefs, timing: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                >
                  <option value="immediately">Exactly when finished</option>
                  <option value="5m_before">5 minutes before</option>
                  <option value="15m_before">15 minutes before (Recommended)</option>
                  <option value="30m_before">30 minutes before</option>
                  <option value="1h_before">1 hour before</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Busy Mode Defaults */}
        {step === 5 && (
          <div className="space-y-6 py-2">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Busy Mode Defaults</h2>
              <p className="text-xs text-slate-400 mt-1">Configure your signature 1-click &ldquo;I&apos;M BUSY&rdquo; profile.</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Moon size={16} />
                <span>Default Duration when you click &ldquo;I&apos;M BUSY&rdquo;</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["1 hour", "2 hours", "4 hours", "8 hours"].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setBusyDefault({ ...busyDefault, duration: dur })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      busyDefault.duration === dur
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Only Critical Alerts During Busy Mode</p>
                  <p className="text-[11px] text-slate-400">Silence minor notifications, only alert for hero or lab completions</p>
                </div>
                <input
                  type="checkbox"
                  checked={busyDefault.allowCriticalOnly}
                  onChange={(e) => setBusyDefault({ ...busyDefault, allowCriticalOnly: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Notify on Hero Awakening</p>
                  <p className="text-[11px] text-slate-400">Always notify when a Hero finishes upgrading so you can plan Clan War attacks</p>
                </div>
                <input
                  type="checkbox"
                  checked={busyDefault.notifyHeroes}
                  onChange={(e) => setBusyDefault({ ...busyDefault, notifyHeroes: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation & Launch */}
        {step === 6 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">You Are All Set, Chief!</h2>
              <p className="text-sm text-slate-300 mt-2">
                Your village companion is primed and ready.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Village:</span>
                <span className="font-semibold text-white">{villageData.name} ({villageData.playerTag})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Town Hall:</span>
                <span className="font-semibold text-amber-400">Level {villageData.townHall}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Builders:</span>
                <span className="font-semibold text-white">{villageData.builderCount} Available</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Busy Mode Default:</span>
                <span className="font-semibold text-emerald-400">{busyDefault.duration}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all inline-flex items-center gap-2"
            >
              Open Dashboard <Zap size={16} />
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 6 && (
          <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              Next Step <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
