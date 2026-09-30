"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, Moon, Bell, User, Clock, CheckCircle2, ChevronDown, 
  Menu, X, Sparkles, ExternalLink, LogOut, Settings as SettingsIcon 
} from "lucide-react";
import { fetchApi, BusyModeState, NotificationItem } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [busyState, setBusyState] = useState<BusyModeState | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [busyModalOpen, setBusyModalOpen] = useState(false);

  useEffect(() => {
    fetchApi<BusyModeState>("/busy-mode/status").then(setBusyState);
    fetchApi<NotificationItem[]>("/notifications").then(setNotifications);
  }, [pathname]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleQuickBusy = async (hours: number, label: string) => {
    const payload = {
      duration_label: label,
      duration_seconds: hours * 3600,
      allow_critical_only: true,
      notify_hero_finish: true,
      notify_lab_finish: true,
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
        duration_label: label,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + hours * 3600 * 1000).toISOString(),
        allow_critical_only: true,
        notify_hero_finish: true,
        notify_lab_finish: true,
        next_event_title: "Archer Queen to Lv 89",
        next_event_time: new Date(Date.now() + 17.2 * 3600 * 1000).toISOString(),
      };
      setBusyState(newState);
      if (typeof window !== "undefined") {
        localStorage.setItem("clashmate_busy_mode", JSON.stringify(newState));
      }
    }
    setBusyModalOpen(false);
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
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#090d16]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-400/30">
                <Shield className="w-5 h-5 text-slate-950 fill-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    Clash<span className="text-amber-400">Mate</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    TH15
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Your village. Your schedule.
                </p>
              </div>
            </Link>
          </div>

          {/* Center Navigation Shortcuts */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/dashboard" 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/village" 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/village" 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Village
            </Link>
            <Link 
              href="/upgrades" 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/upgrades" 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Upgrades
            </Link>
            <Link 
              href="/timeline" 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/timeline" 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Timeline
            </Link>
            <Link 
              href="/ai" 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                pathname === "/ai" 
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30" 
                  : "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              }`}
            >
              <Sparkles size={13} className="text-purple-400" />
              AI Advisor
            </Link>
          </nav>

          {/* Right Action Icons: Busy Mode, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* Signature Busy Mode Button */}
            {busyState?.is_active ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setBusyModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-pulse hover:bg-emerald-500/25 transition-all shadow-lg shadow-emerald-500/10"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  Busy Active ({busyState.duration_label})
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setBusyModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-102 active:scale-98 transition-all"
              >
                <Moon size={13} className="fill-slate-950" />
                I&apos;M BUSY
              </button>
            )}

            {/* Notifications Menu Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
                title="Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Notifications
                    </span>
                    <Link 
                      href="/notifications" 
                      onClick={() => setShowNotifMenu(false)}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.slice(0, 4).map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all border border-white/5 text-left">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-white mb-0.5">
                          <span>{n.title}</span>
                          {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-white/5 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  A
                </div>
                <span className="text-xs font-medium text-slate-200 hidden md:block">
                  Chief Arthur
                </span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl glass-panel border border-white/10 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs font-bold text-white">Chief Arthur</p>
                    <p className="text-[10px] text-slate-400">#9V8G2YLL • TH15</p>
                  </div>
                  <Link 
                    href="/profile/chief_arthur" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User size={14} className="text-amber-400" />
                    Public Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <SettingsIcon size={14} className="text-slate-400" />
                    Settings
                  </Link>
                  <Link 
                    href="/login" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#090d16]/95 backdrop-blur-2xl p-6 pt-24 animate-in fade-in duration-200">
          <div className="flex flex-col gap-3 text-base">
            <Link 
              href="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-white/5 font-semibold text-white"
            >
              Dashboard
            </Link>
            <Link 
              href="/village" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-white/5 font-semibold text-white"
            >
              Village Assets
            </Link>
            <Link 
              href="/upgrades" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-white/5 font-semibold text-white"
            >
              Upgrades & Timers
            </Link>
            <Link 
              href="/timeline" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-white/5 font-semibold text-white"
            >
              Upgrade Timeline
            </Link>
            <Link 
              href="/builders" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-white/5 font-semibold text-white"
            >
              Builders
            </Link>
            <Link 
              href="/busy-mode" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20"
            >
              Busy Mode
            </Link>
            <Link 
              href="/analytics" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-white/5 font-semibold text-white"
            >
              Analytics
            </Link>
            <Link 
              href="/ai" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20"
            >
              AI Assistant
            </Link>
            <Link 
              href="/settings" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-white/5 font-semibold text-white"
            >
              Settings
            </Link>
          </div>
        </div>
      )}

      {/* Busy Mode Quick Action Modal */}
      {busyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl glass-panel-gold p-6 border border-amber-500/30 text-left shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                  <Moon size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Busy Mode Quick Setup</h3>
                  <p className="text-xs text-slate-400">Step away with peace of mind</p>
                </div>
              </div>
              <button 
                onClick={() => setBusyModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {busyState?.is_active ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  <p className="font-bold text-sm mb-1">Busy Mode Active</p>
                  <p>You are protected for <b>{busyState.duration_label}</b>.</p>
                  <p className="mt-1 text-slate-300">Next event: {busyState.next_event_title || "Eagle Artillery Lv 6"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEndBusy}
                    className="w-full py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs transition-colors"
                  >
                    End Busy Mode Now
                  </button>
                  <Link
                    href="/busy-mode"
                    onClick={() => setBusyModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs text-center transition-colors"
                  >
                    Full Controls
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Choose how long you will be away. We will silence regular alerts while still warning you if your Hero sleeps or critical lab finishes.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "1 hour", hours: 1 },
                    { label: "2 hours", hours: 2 },
                    { label: "4 hours", hours: 4 },
                    { label: "8 hours", hours: 8 },
                    { label: "Until tomorrow", hours: 14 },
                    { label: "Full Day (24h)", hours: 24 },
                  ].map((dur) => (
                    <button
                      key={dur.label}
                      onClick={() => handleQuickBusy(dur.hours, dur.label)}
                      className="py-3 px-3 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-xs font-semibold text-slate-200 hover:text-amber-300 transition-all text-center flex items-center justify-center gap-2"
                    >
                      <Clock size={13} className="text-amber-400" />
                      {dur.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Want custom filters?</span>
                  <Link 
                    href="/busy-mode" 
                    onClick={() => setBusyModalOpen(false)}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    Open Busy Mode Dashboard <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
