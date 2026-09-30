"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, Award, Trophy, Star, Castle, HardHat, CheckCircle2, Share2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string || "chief_arthur";
  const [profile, setProfile] = useState({
    username: username,
    is_public: true,
    show_town_hall: true,
    show_progress: true,
    show_statistics: true,
    show_achievements: true,
    bio: "Passionate Clash of Clans Chief, Clan War general, and base strategist.",
    badge_title: "Master Strategist",
    town_hall_level: 15,
    war_stars: 1240,
    trophies: 4850,
    village_progress: 88.4,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApi<any>(`/users/${username}/public-profile`).then((res) => {
      if (res && res.username) {
        setProfile(res);
      }
    });
  }, [username]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl glass-panel-gold border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20 border border-amber-400/40">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">@{profile.username}</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  {profile.badge_title}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-md">{profile.bio}</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Share2 size={13} /> {copied ? "Link Copied!" : "Share Profile"}
          </button>
        </div>
      </div>

      {/* Public Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {profile.show_town_hall && (
          <div className="p-5 rounded-2xl glass-panel border border-white/5 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Town Hall</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-amber-400">Level {profile.town_hall_level}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Giga Inferno Active</p>
          </div>
        )}

        {profile.show_statistics && (
          <>
            <div className="p-5 rounded-2xl glass-panel border border-white/5 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">War Stars</span>
              <div className="flex items-center gap-2">
                <Star className="text-amber-400 fill-amber-400" size={20} />
                <span className="text-2xl font-black text-white">{profile.war_stars}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Clan War Veteran</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/5 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Trophies</span>
              <div className="flex items-center gap-2">
                <Trophy className="text-amber-400" size={20} />
                <span className="text-2xl font-black text-white">{profile.trophies}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Titan / Legend Range</p>
            </div>
          </>
        )}
      </div>

      {/* Progress & Achievements Showcase */}
      {profile.show_progress && (
        <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">Village Maxed Completion</h3>
            <span className="text-amber-400 font-extrabold text-sm">{profile.village_progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" 
              style={{ width: `${profile.village_progress}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Town Hall 15 defenses, heroes, and laboratory development.
          </p>
        </div>
      )}

      {/* Privacy note */}
      <div className="text-center text-xs text-slate-500 pt-4">
        This profile displays only metrics explicitly chosen by the user in their Privacy Settings.
      </div>

    </div>
  );
}
