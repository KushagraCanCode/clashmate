"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Castle, Hammer, Moon, Bot, 
  Menu, X, CalendarDays, HardHat, BarChart3, 
  Bell, Settings, UserCheck, Shield, ExternalLink
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  // Hide on landing or auth pages
  const isAuthOrLanding = 
    pathname === "/" || 
    pathname === "/login" || 
    pathname === "/register" || 
    pathname === "/forgot-password" || 
    pathname === "/onboarding";

  if (isAuthOrLanding) return null;

  const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/village", label: "Village", icon: Castle },
    { 
      href: "/busy-mode", 
      label: "Busy Mode", 
      icon: Moon, 
      isHero: true 
    },
    { href: "/upgrades", label: "Upgrades", icon: Hammer },
    { href: "/ai", label: "AI Advisor", icon: Bot },
  ];

  const MORE_LINKS = [
    { href: "/timeline", label: "Upgrade Timeline", icon: CalendarDays, desc: "Gantt matrix schedule" },
    { href: "/builders", label: "Builder Huts (6)", icon: HardHat, desc: "B.O.B module & logs" },
    { href: "/analytics", label: "Deep Analytics", icon: BarChart3, desc: "Utilization & velocity" },
    { href: "/notifications", label: "Notification Center", icon: Bell, desc: "Dispatched alerts" },
    { href: "/settings", label: "Player Settings", icon: Settings, desc: "Alerts, privacy & export" },
    { href: "/profile/chief_arthur", label: "Public Profile", icon: UserCheck, desc: "View clanmate card" },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/10 bg-[#090d16]/95 backdrop-blur-2xl px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
      >
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isHero) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center group -mt-5"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                    isActive 
                      ? "bg-gradient-to-tr from-amber-400 to-amber-600 shadow-amber-500/30 text-slate-950 scale-105 border-2 border-amber-300"
                      : "bg-gradient-to-tr from-amber-500 to-amber-700 shadow-amber-500/20 text-slate-950 hover:brightness-110 border border-amber-400/40"
                  }`}>
                    <Moon size={22} className="fill-slate-950" />
                  </div>
                  <span className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isActive ? "text-amber-400" : "text-slate-300"
                  }`}>
                    Busy
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
                  isActive 
                    ? "text-amber-400 font-semibold" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="relative">
                  <Icon size={19} className={isActive ? "text-amber-400" : "text-slate-400"} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Sheet Trigger */}
          <button
            onClick={() => setMoreDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all min-w-[56px]"
          >
            <div className="relative">
              <Menu size={19} className="text-slate-400" />
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* "More" Mobile Bottom Sheet Modal */}
      {moreDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-md animate-in fade-in duration-200 lg:hidden"
          onClick={() => setMoreDrawerOpen(false)}
        >
          <div 
            className="bg-[#0f1523] border-t border-white/10 rounded-t-3xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl max-w-lg w-full mx-auto animate-in slide-in-from-bottom duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Drag Pill */}
            <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 font-bold text-xs">
                  TH15
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">ClashMate Mobile Hub</h3>
                  <p className="text-[11px] text-slate-400">Chief Arthur • #9V8G2YLL</p>
                </div>
              </div>
              <button 
                onClick={() => setMoreDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {MORE_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreDrawerOpen(false)}
                    className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-1 ${
                      isActive 
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                        : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={isActive ? "text-amber-400" : "text-slate-400"} />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </Link>
                );
              })}
            </div>

            {/* Fair Play Notice */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-emerald-400" />
                <span>100% Fair Play • Zero Automation</span>
              </div>
              <Link 
                href="/settings" 
                onClick={() => setMoreDrawerOpen(false)}
                className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                Config <ExternalLink size={10} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
