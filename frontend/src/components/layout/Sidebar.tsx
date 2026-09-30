"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Castle, Hammer, CalendarDays, HardHat, 
  Moon, BarChart3, Bot, Bell, Settings, UserCheck, Shield 
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/village", label: "Village Assets", icon: Castle },
  { href: "/upgrades", label: "Active Upgrades", icon: Hammer },
  { href: "/timeline", label: "Timeline", icon: CalendarDays },
  { href: "/builders", label: "Builders (6)", icon: HardHat },
  { href: "/busy-mode", label: "Busy Mode", icon: Moon, badge: "Core" },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ai", label: "AI Advisor", icon: Bot, badge: "Smart", badgeColor: "purple" },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile/chief_arthur", label: "Public Profile", icon: UserCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on landing page or auth pages
  const isAuthOrLanding = pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/onboarding";
  if (isAuthOrLanding) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#090d16]/95 min-h-[calc(100vh-4rem)] p-4 shrink-0">
      
      {/* Village Quick Status Card */}
      <div className="mb-5 p-3.5 rounded-2xl glass-panel border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 font-extrabold text-sm">
            15
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">Town Hall 15</p>
            <p className="text-[11px] text-slate-400">88.4% Maxed</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Optimal
        </span>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isActive ? "text-amber-400" : "text-slate-400"} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  item.badgeColor === "purple" 
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Fair Play & Non-Automation Guarantee Footer */}
      <div className="pt-4 border-t border-white/5">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
            <Shield size={12} className="text-emerald-400" />
            <span>Fair-Play Companion</span>
          </div>
          <p className="text-[10px] text-slate-500">
            No bots. No game client automation. 100% player controlled.
          </p>
        </div>
      </div>
    </aside>
  );
}
