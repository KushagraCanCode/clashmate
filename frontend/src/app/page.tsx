"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Shield, Moon, Sparkles, Hammer, BarChart3, Clock, 
  CheckCircle, ArrowRight, Zap, Lock, GitBranch, Heart, Layers, EyeOff
} from "lucide-react";

export default function LandingPage() {
  const [demoBusyActive, setDemoBusyActive] = useState(false);

  return (
    <div className="w-full bg-[#090d16] text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-amber-400 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Community-First Companion for Clash Chiefs</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
            Stay on top of your village. <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Even when you&apos;re busy.</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-slate-300 font-medium mb-3">
            &ldquo;Your village. Your schedule. Your Clash companion.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Monitor village upgrades and research timers, activate customizable Busy Mode, view deep builder analytics, and get grounded AI strategic insights — without automated gameplay or client manipulation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-white/10 border border-white/15 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              Explore Demo Dashboard
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400" /> Free & Open Access</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400" /> No Bots or Automation</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400" /> 100% Fair Play</span>
          </div>
        </div>

        {/* 2. INTERACTIVE DASHBOARD PREVIEW */}
        <div className="mt-16 max-w-5xl mx-auto relative rounded-3xl glass-panel border border-white/10 p-3 sm:p-5 shadow-2xl shadow-black/80">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-slate-400 ml-2 font-mono">clashmate.io/dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Interactive Preview</span>
              <button 
                onClick={() => setDemoBusyActive(!demoBusyActive)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  demoBusyActive 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {demoBusyActive ? "Busy Active" : "Toggle 'I'M BUSY'"}
              </button>
            </div>
          </div>

          {/* Inner Mock Dashboard Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Left Main Overview */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-lg text-white">Chief Arthur&apos;s Fortress</h3>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold text-xs">TH15</span>
                  </div>
                  <p className="text-xs text-slate-400">Legends Alliance • 4,850 Trophies • 1,240 War Stars</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400">88.4%</span>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Maxed Progress</p>
                </div>
              </div>

              {/* Active Upgrades Mini Cards */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Active Upgrades Running</span>
                  <span className="text-amber-400">4 / 6 Builders Active</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Eagle Artillery to Lv 6", time: "1d 14h", progress: 68, builder: "Builder #1" },
                    { name: "Archer Queen to Lv 89", time: "17h 12m", progress: 84, builder: "Builder #3" },
                    { name: "Electro Titan to Lv 3 (Lab)", time: "22h 30m", progress: 92, builder: "Laboratory" },
                  ].map((upg, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-white">{upg.name}</span>
                        <span className="text-amber-400 font-mono text-[11px]">{upg.time} left</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: `${upg.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Mini Cards: Busy Mode & AI Insight */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl transition-all border ${
                demoBusyActive 
                  ? "bg-emerald-950/20 border-emerald-500/40" 
                  : "bg-amber-950/15 border-amber-500/30"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Moon size={16} className={demoBusyActive ? "text-emerald-400" : "text-amber-400"} />
                    <span className="text-xs font-bold text-white">Busy Mode</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    demoBusyActive ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-400"
                  }`}>
                    {demoBusyActive ? "Active: 4 Hours" : "Standby"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {demoBusyActive 
                    ? "Non-critical notifications muted until 1:00 PM. Critical hero & lab finish alerts active."
                    : "Heading away from the screen? Tap 'I'M BUSY' to silence non-critical notifications while keeping critical alerts."}
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-panel-ai border border-purple-500/30">
                <div className="flex items-center gap-2 text-purple-300 text-xs font-bold mb-2">
                  <Sparkles size={15} />
                  <span>AI Strategic Insight</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  &ldquo;Archer Queen finishes in 17 hours. Have 330k Dark Elixir prepared to chain into Level 90 before your clan war matchup starts.&rdquo;
                </p>
                <div className="flex justify-end">
                  <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Grounded In Village Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Engineered for Chiefs Who Value Their Time
          </h2>
          <p className="text-sm text-slate-400">
            A complete companion suite designed to track, schedule, and optimize your village progress seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              title: "Precise Timers & Upgrades",
              desc: "Track every building, hero, and laboratory timer with live countdowns. Know exactly when builders become free without opening the game.",
              color: "text-amber-400",
              bg: "bg-amber-500/10 border-amber-500/20"
            },
            {
              icon: Moon,
              title: "Signature Busy Mode",
              desc: "Step away for 1h, 4h, 8h, or until tomorrow. ClashMate guards your focus, silencing minor noise while alerting you only to critical completions.",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20"
            },
            {
              icon: Sparkles,
              title: "Grounded AI Advisor",
              desc: "Consult an intelligent AI strategist that retrieves your actual village stats, analyzes upgrade history, and suggests optimal resource roadmaps.",
              color: "text-purple-400",
              bg: "bg-purple-500/10 border-purple-500/20"
            },
            {
              icon: BarChart3,
              title: "Deep Builder Analytics",
              desc: "Inspect builder utilization rates, resource investment totals, hero development velocity, and weekly progress trends.",
              color: "text-blue-400",
              bg: "bg-blue-500/10 border-blue-500/20"
            },
            {
              icon: Layers,
              title: "Upgrade Timeline Visualizer",
              desc: "Horizontal multi-day and multi-week visual schedule. Spot builder bottlenecks and overlapping completions before they happen.",
              color: "text-indigo-400",
              bg: "bg-indigo-500/10 border-indigo-500/20"
            },
            {
              icon: Lock,
              title: "Player-Controlled Privacy",
              desc: "Every alert, feature, and public profile field is independently customizable. You decide what data to track and what to share.",
              color: "text-teal-400",
              bg: "bg-teal-500/10 border-teal-500/20"
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-white/15 transition-all text-left">
                <div className={`w-10 h-10 rounded-xl ${f.bg} border flex items-center justify-center mb-4`}>
                  <Icon size={20} className={f.color} />
                </div>
                <h3 className="font-bold text-base text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Simple 3-Step Setup</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">How ClashMate Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
          {[
            {
              step: "01",
              title: "Connect or Configure Your Village",
              desc: "Enter your player tag or initialize with realistic sample data. ClashMate maps your Town Hall, builder count, hero levels, and current defenses."
            },
            {
              step: "02",
              title: "Configure Alerts & Busy Mode",
              desc: "Pick your alert channels (push, email, discord), set quiet hours, and configure your default Busy Mode duration."
            },
            {
              step: "03",
              title: "Enjoy Complete Peace of Mind",
              desc: "Step away knowing you will never waste builder uptime or leave resources sitting full while away from your device."
            }
          ].map((s, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative">
              <span className="text-4xl font-black text-amber-500/20 mb-3 block">{s.step}</span>
              <h3 className="font-bold text-base text-white mb-2">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAIR PLAY & STRICT NON-AUTOMATION GUARANTEE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto my-10 rounded-3xl glass-panel border border-emerald-500/30 p-8 sm:p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/10">
          <Shield size={28} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          100% Fair Play & Non-Automation Guarantee
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
          ClashMate is strictly an informational companion and scheduling platform. We do <b>NOT</b> automate gameplay, perform attacks, collect resources, manipulate game clients, or execute macros. The player remains in 100% control of all gameplay actions at all times.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
          <CheckCircle size={15} className="text-emerald-400" />
          <span>Compliant with fair-play community standards</span>
        </div>
      </section>

      {/* 6. OPEN SOURCE & PRIVACY SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Transparent & Community Driven</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 mb-4">Open-Access Architecture</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Built with Next.js, FastAPI, PostgreSQL, and modular AI integrations. Fully inspectable, privacy-preserving, and built by players for players. Export or delete your data at any time with a single click.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/register" 
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Join ClashMate Free
              </Link>
              <Link 
                href="/dashboard" 
                className="px-6 py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold text-xs transition-colors"
              >
                Launch Live Demo
              </Link>
            </div>
          </div>
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <EyeOff className="text-amber-400" size={20} />
              <div>
                <h4 className="text-sm font-bold text-white">Zero Tracking or Third-Party Ads</h4>
                <p className="text-xs text-slate-400">Your village progress and schedules belong exclusively to you.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GitBranch className="text-slate-300" size={20} />
              <div>
                <h4 className="text-sm font-bold text-white">Clean Modular Codebase</h4>
                <p className="text-xs text-slate-400">Docker-ready backend, FastAPI services, and production-tested API.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#070a12] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-amber-400" />
            <span className="font-bold text-slate-300">ClashMate</span>
            <span>— Your village. Your schedule. Your Clash companion.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">Demo</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/5 text-[11px] text-slate-600 text-center sm:text-left">
          ClashMate is an unofficial community companion platform and is not affiliated with, endorsed, sponsored, or specifically approved by Supercell. Supercell is not responsible for the operation or content of this site.
        </div>
      </footer>

    </div>
  );
}
