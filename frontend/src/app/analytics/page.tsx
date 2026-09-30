"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, HardHat, Swords, FlaskConical, 
  Hammer, Calendar, Award, ArrowUpRight 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";
import { fetchApi } from "@/lib/api";

const TIME_FILTERS = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "6m", label: "6 months" },
  { id: "1y", label: "1 year" },
];

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("30d");
  const [data, setData] = useState<any>({
    total_upgrades: 72,
    completed_upgrades: 67,
    active_upgrades: 5,
    builder_utilization_rate: 66.7,
    hero_progress_percentage: 82.4,
    laboratory_progress_percentage: 89.1,
    overall_village_progress: 88.4,
    category_distribution: [
      {"name": "Defenses", "value": 42, "color": "#f59e0b"},
      {"name": "Heroes", "value": 24, "color": "#8b5cf6"},
      {"name": "Laboratory", "value": 18, "color": "#3b82f6"},
      {"name": "Resources", "value": 10, "color": "#10b981"},
      {"name": "Army & Other", "value": 6, "color": "#ec4899"},
    ],
    activity_trends: [
      { date: "Sep 01", upgrades_completed: 3, builder_utilization: 82, gold_spent_millions: 16.5 },
      { date: "Sep 05", upgrades_completed: 4, builder_utilization: 91, gold_spent_millions: 21.0 },
      { date: "Sep 10", upgrades_completed: 2, builder_utilization: 75, gold_spent_millions: 12.0 },
      { date: "Sep 15", upgrades_completed: 5, builder_utilization: 96, gold_spent_millions: 24.5 },
      { date: "Sep 20", upgrades_completed: 3, builder_utilization: 88, gold_spent_millions: 18.0 },
      { date: "Sep 25", upgrades_completed: 4, builder_utilization: 93, gold_spent_millions: 22.0 },
      { date: "Sep 30", upgrades_completed: 5, builder_utilization: 98, gold_spent_millions: 28.0 },
    ],
  });

  useEffect(() => {
    fetchApi<any>(`/analytics/overview?range=${selectedRange}`).then((res) => {
      if (res && res.activity_trends) {
        setData(res);
      }
    });
  }, [selectedRange]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="text-amber-400" size={24} />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Village Analytics & Velocity</h1>
          </div>
          <p className="text-xs text-slate-400">
            Historical builder utilization, gold/elixir investments, and development milestones.
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/5">
          {TIME_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedRange(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedRange === f.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Upgrades</span>
          <span className="text-2xl font-black text-white">{data.total_upgrades}</span>
          <p className="text-xs text-slate-400 mt-1">
            <span className="text-emerald-400 font-bold">{data.completed_upgrades} completed</span> • {data.active_upgrades} active
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Builder Utilization</span>
          <span className="text-2xl font-black text-amber-400">{data.builder_utilization_rate}%</span>
          <p className="text-xs text-slate-400 mt-1">Average builder uptime</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Hero Progression</span>
          <span className="text-2xl font-black text-purple-400">{data.hero_progress_percentage}%</span>
          <p className="text-xs text-slate-400 mt-1">King, Queen, Warden & RC</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Laboratory Progress</span>
          <span className="text-2xl font-black text-blue-400">{data.laboratory_progress_percentage}%</span>
          <p className="text-xs text-slate-400 mt-1">Troop & spell maxed velocity</p>
        </div>

      </div>

      {/* Recharts Analytics Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Builder Utilization & Resource Velocity Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-white">Builder Utilization Over Time (%)</h3>
              <p className="text-[11px] text-slate-400">Tracking daily active builder capacity during the selected window</p>
            </div>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <TrendingUp size={14} /> Peak 98%
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.activity_trends}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1523", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }}
                  itemStyle={{ color: "#f59e0b" }}
                />
                <Area type="monotone" dataKey="builder_utilization" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUtil)" name="Utilization %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (1 col): Category Distribution */}
        <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-white">Upgrades by Category</h3>
            <p className="text-[11px] text-slate-400">Resource and time allocation distribution</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.category_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.category_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1523", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1">
            {data.category_distribution.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Gold & Elixir Invested Bar Chart */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-white">Resource Investment Velocity (Millions)</h3>
            <p className="text-[11px] text-slate-400">Gold & Elixir consumed by active upgrades across the period</p>
          </div>
        </div>

        <div className="h-60 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.activity_trends}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f1523", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }}
              />
              <Bar dataKey="gold_spent_millions" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Gold (M)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
