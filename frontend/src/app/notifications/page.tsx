"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, CheckCircle2, Clock, Hammer, Swords, 
  FlaskConical, Moon, Sparkles, Check, Trash2, Send 
} from "lucide-react";
import { fetchApi, NotificationItem, MOCK_NOTIFICATIONS } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<NotificationItem[]>("/notifications").then((res) => {
      if (res && Array.isArray(res)) setNotifications(res);
      setLoading(false);
    });
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetchApi("/notifications/read-all", { method: "POST" });
    } catch {}
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const handleTriggerTest = async () => {
    try {
      await fetchApi("/notifications/test", { method: "POST" });
      const refreshed = await fetchApi<NotificationItem[]>("/notifications");
      if (refreshed && Array.isArray(refreshed)) setNotifications(refreshed);
    } catch {
      // Mock test notification
      const testNotif: NotificationItem = {
        id: Date.now(),
        type: "system",
        title: "🔔 Test Alert: Priority Dispatch",
        message: "Your notification pipeline is verified! All quiet-hour rules and priority filters are operational.",
        link: "/dashboard",
        is_read: false,
        sent_at: new Date().toISOString()
      };
      setNotifications([testNotif, ...notifications]);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "upgrade": return <Hammer size={16} className="text-amber-400" />;
      case "hero": return <Swords size={16} className="text-purple-400" />;
      case "lab": return <FlaskConical size={16} className="text-blue-400" />;
      case "busy_mode": return <Moon size={16} className="text-emerald-400" />;
      default: return <Bell size={16} className="text-slate-400" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    return n.type === filter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="text-amber-400" size={24} />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Notification History</h1>
          </div>
          <p className="text-xs text-slate-400">
            Log of dispatched village timers, hero awakenings, and Busy Mode alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTriggerTest}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Send size={13} className="text-amber-400" /> Test Notification
          </button>
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Check size={14} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "All Alerts" },
          { id: "unread", label: "Unread Only" },
          { id: "upgrade", label: "Upgrades" },
          { id: "hero", label: "Heroes" },
          { id: "lab", label: "Laboratory" },
          { id: "busy_mode", label: "Busy Mode" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              filter === tab.id
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Items List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-panel border border-white/5 text-slate-400 text-xs">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl glass-panel border transition-all flex items-start justify-between gap-4 ${
                !n.is_read ? "border-amber-500/30 bg-amber-500/[0.02]" : "border-white/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-white">{n.title}</h4>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                    <span>{new Date(n.sent_at).toLocaleDateString()} {new Date(n.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {n.link && (
                      <Link href={n.link} className="text-amber-400 hover:underline">
                        View Event →
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => {
                    setNotifications(notifications.map(item => item.id === n.id ? { ...item, is_read: true } : item));
                  }}
                  className="text-[11px] text-slate-400 hover:text-white shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
