"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Castle, Search, Filter, Shield, Swords, HardHat, 
  FlaskConical, Hammer, CheckCircle2, ArrowUpRight, Plus 
} from "lucide-react";
import { fetchApi, BuildingItem, HeroItem, MOCK_BUILDINGS, MOCK_HEROES } from "@/lib/api";

const TABS = [
  { id: "all", label: "All Assets" },
  { id: "townhall", label: "Town Hall" },
  { id: "defenses", label: "Defenses" },
  { id: "resources", label: "Resources" },
  { id: "army", label: "Army" },
  { id: "heroes", label: "Heroes" },
  { id: "laboratory", label: "Laboratory" },
  { id: "traps", label: "Traps" },
  { id: "walls", label: "Walls" },
];

export default function VillagePage() {
  const [activeTab, setActiveTab] = useState("defenses");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, upgrading, maxed
  const [buildings, setBuildings] = useState<BuildingItem[]>(MOCK_BUILDINGS);
  const [heroes, setHeroes] = useState<HeroItem[]>(MOCK_HEROES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [b, h] = await Promise.all([
          fetchApi<BuildingItem[]>("/buildings"),
          fetchApi<HeroItem[]>("/heroes"),
        ]);
        if (b && Array.isArray(b)) setBuildings(b);
        if (h && Array.isArray(h)) setHeroes(h);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter items
  const filteredBuildings = buildings.filter((item) => {
    const matchesTab = 
      activeTab === "all" ? true :
      activeTab === "townhall" ? item.category === "townhall" :
      activeTab === "laboratory" ? item.name.toLowerCase().includes("lab") :
      item.category === activeTab;

    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" ? true :
      statusFilter === "upgrading" ? item.is_upgrading :
      statusFilter === "maxed" ? item.level >= item.max_level : true;

    return matchesTab && matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Castle className="text-amber-400" size={24} />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Village Assets & Structures</h1>
          </div>
          <p className="text-xs text-slate-400">
            Town Hall 15 • 325 Wall pieces • 6 Builders • 4 Heroes
          </p>
        </div>

        <Link
          href="/upgrades"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Hammer size={14} /> Start Upgrade
        </Link>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search structure or defense (e.g. Eagle Artillery, X-Bow)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter size={13} /> Status:
          </span>
          {["all", "upgrading", "maxed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s
                  ? "bg-white/10 text-white border border-white/20 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Heroes Special Section if activeTab is heroes or all */}
      {(activeTab === "heroes" || activeTab === "all") && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Swords size={16} className="text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Heroes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {heroes.map((hero) => (
              <div 
                key={hero.id} 
                className={`p-4 rounded-2xl glass-panel border transition-all text-left ${
                  hero.is_upgrading ? "border-amber-500/30 bg-amber-500/[0.04]" : "border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{hero.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hero.is_upgrading 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                  }`}>
                    {hero.is_upgrading ? "Upgrading 💤" : "Ready ⚔️"}
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>Level:</span>
                    <span className="font-bold text-white">{hero.level} / {hero.max_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ability:</span>
                    <span>Level {hero.ability_level}</span>
                  </div>
                  {hero.pet_assigned && (
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Companion Pet:</span>
                      <span className="text-amber-300">{hero.pet_assigned}</span>
                    </div>
                  )}
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" 
                    style={{ width: `${(hero.level / hero.max_level) * 100}%` }} 
                  />
                </div>

                <Link
                  href="/upgrades"
                  className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold text-xs text-center block transition-colors"
                >
                  {hero.is_upgrading ? "View Timer" : "Queue Upgrade"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buildings & Defenses Grid */}
      <div className="space-y-3">
        {activeTab !== "heroes" && (
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white capitalize">{activeTab} ({filteredBuildings.length})</h3>
          </div>
        )}

        {filteredBuildings.length === 0 && activeTab !== "heroes" ? (
          <div className="p-12 text-center rounded-2xl glass-panel border border-white/5 text-slate-400 text-xs">
            No matching structures found in this category. Try adjusting your search query or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBuildings.map((item) => {
              const isMaxed = item.level >= item.max_level;
              return (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-2xl glass-panel border transition-all text-left ${
                    item.is_upgrading ? "border-amber-500/30 bg-amber-500/[0.03]" : "border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-white truncate">{item.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.is_upgrading 
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                        : isMaxed 
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : "bg-white/10 text-slate-300"
                    }`}>
                      {item.is_upgrading ? "Upgrading" : isMaxed ? "Maxed" : "Ready"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 mb-2">
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-bold text-white">Lv {item.level} <span className="text-slate-500">/ {item.max_level}</span></span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Total on Base:</span>
                      <span>{item.count}</span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" 
                      style={{ width: `${(item.level / item.max_level) * 100}%` }} 
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 capitalize">{item.category}</span>
                    <Link
                      href="/upgrades"
                      className="text-[11px] text-amber-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      {item.is_upgrading ? "Active" : "Upgrade"} <ArrowUpRight size={11} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
