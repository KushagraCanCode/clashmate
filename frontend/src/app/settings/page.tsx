"use client";

import React, { useState } from "react";
import { 
  Settings, User, Castle, Bell, Moon, Bot, 
  Lock, Palette, Trash2, Download, Save, CheckCircle2 
} from "lucide-react";
import { fetchApi } from "@/lib/api";

const SETTING_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "village", label: "Village", icon: Castle },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "busy_mode", label: "Busy Mode", icon: Moon },
  { id: "ai", label: "AI Advisor", icon: Bot },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "account", label: "Account", icon: Settings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Profile Form
  const [profile, setProfile] = useState({
    displayName: "Chief Arthur",
    username: "chief_arthur",
    timezone: "UTC",
    language: "English (US)",
  });

  // Village Form
  const [village, setVillage] = useState({
    name: "Arthur's Citadel",
    tag: "#9V8G2YLL",
    townHall: 15,
    dataSource: "companion_synced",
  });

  // Notifications Form
  const [notifs, setNotifs] = useState({
    upgrades: true,
    builders: true,
    heroes: true,
    laboratory: true,
    resources: false,
    dailySummary: true,
    weeklyReport: true,
    aiInsights: true,
    channel: "push",
    timing: "15m_before",
    quietHours: true,
    quietStart: "23:00",
    quietEnd: "07:00",
    quietCriticalOnly: true,
  });

  // Busy Mode Form
  const [busy, setBusy] = useState({
    defaultDuration: "4 hours",
    allowCritical: true,
    notifyHeroes: true,
  });

  // AI Form
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    chat: true,
    dailySummary: true,
  });

  // Privacy Form
  const [privacy, setPrivacy] = useState({
    isPublic: true,
    analyticsVisibility: "public",
    dataSharing: "minimal",
  });

  // Appearance Form
  const [appearance, setAppearance] = useState({
    theme: "dark",
    density: "comfortable",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExportData = () => {
    const exportObject = {
      profile,
      village,
      notifications: notifs,
      busy_mode: busy,
      exported_at: new Date().toISOString(),
      disclaimer: "ClashMate user-controlled data export"
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clashmate_data_export_${profile.username}.json`;
    a.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="text-amber-400" size={24} />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Settings & Preferences</h1>
          </div>
          <p className="text-xs text-slate-400">
            User-controlled preferences. Every feature is independently configurable.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
        >
          {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saved ? "Saved Successfully!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left Tabs List */}
        <div className="p-2 rounded-2xl glass-panel border border-white/5 space-y-1">
          {SETTING_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isActive
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Active Tab Content */}
        <div className="md:col-span-3 p-6 sm:p-8 rounded-3xl glass-panel border border-white/5 space-y-6">
          
          {/* 1. PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-2">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Timezone</label>
                  <input
                    type="text"
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
                  <input
                    type="text"
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. VILLAGE TAB */}
          {activeTab === "village" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-2">Connected Village</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Village Name</label>
                  <input
                    type="text"
                    value={village.name}
                    onChange={(e) => setVillage({ ...village, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Player Tag</label>
                  <input
                    type="text"
                    value={village.tag}
                    onChange={(e) => setVillage({ ...village, tag: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-2">Independent Alert Toggles</h3>
              <div className="space-y-2.5">
                {[
                  { key: "upgrades", label: "Upgrade completion alerts" },
                  { key: "builders", label: "Builder idle warnings" },
                  { key: "heroes", label: "Hero ready / regeneration alerts" },
                  { key: "laboratory", label: "Laboratory research finish alerts" },
                  { key: "resources", label: "Resource capacity overflow warnings" },
                  { key: "dailySummary", label: "Morning daily village digest" },
                  { key: "weeklyReport", label: "Weekly progress velocity report" },
                  { key: "aiInsights", label: "AI strategic insight push notifications" },
                ].map((item) => (
                  <label key={item.key} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-slate-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(notifs as any)[item.key]}
                      onChange={(e) => setNotifs({ ...notifs, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <h4 className="font-bold text-xs text-white">Quiet Hours</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={notifs.quietStart}
                      onChange={(e) => setNotifs({ ...notifs, quietStart: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">End Time</label>
                    <input
                      type="time"
                      value={notifs.quietEnd}
                      onChange={(e) => setNotifs({ ...notifs, quietEnd: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. BUSY MODE TAB */}
          {activeTab === "busy_mode" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-2">Busy Mode Defaults</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Default Duration</label>
                <select
                  value={busy.defaultDuration}
                  onChange={(e) => setBusy({ ...busy, defaultDuration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                >
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="8 hours">8 hours</option>
                  <option value="Until tomorrow">Until tomorrow</option>
                </select>
              </div>
            </div>
          )}

          {/* 5. AI TAB */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-2">AI Strategic Advisor</h3>
              <div className="space-y-2.5">
                {[
                  { key: "enabled", label: "Enable AI Strategic Advisor features" },
                  { key: "chat", label: "Enable interactive conversational chat" },
                  { key: "dailySummary", label: "Include AI commentary in daily summary" },
                ].map((item) => (
                  <label key={item.key} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-slate-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(aiSettings as any)[item.key]}
                      onChange={(e) => setAiSettings({ ...aiSettings, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-purple-500 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 6. PRIVACY TAB */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-2">User-Controlled Privacy</h3>
              <div className="space-y-3">
                <label className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-white">Public Profile Enabled</p>
                    <p className="text-[11px] text-slate-400">Allow other clan members or community members to view your public profile link</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacy.isPublic}
                    onChange={(e) => setPrivacy({ ...privacy, isPublic: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* 7. APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-2">Appearance & Density</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {["dark", "charcoal", "system"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAppearance({ ...appearance, theme: t })}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize border ${
                        appearance.theme === t ? "bg-amber-500 text-slate-950 border-amber-400 font-bold" : "bg-white/5 text-slate-300 border-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-2">Account Management</h3>
              
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">Export Your Village Data</h4>
                    <p className="text-[11px] text-slate-400">Download all your upgrade records, timers, and telemetry as a portable JSON file.</p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Download size={14} /> Export JSON
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-red-300">Permanent Account Deletion</h4>
                    <p className="text-[11px] text-slate-400">Permanently delete your profile and all associated village history from our servers.</p>
                  </div>
                  <button
                    onClick={() => alert("To delete your account permanently, please confirm via the account verification email.")}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shrink-0"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
