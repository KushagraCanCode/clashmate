// ClashMate API client & types with seamless mock fallback

export interface VillageSummary {
  village: {
    id: number;
    name: string;
    player_tag: string;
    town_hall: number;
    clan_name: string;
    trophies: number;
    war_stars: number;
  };
  stats: {
    progress_percentage: number;
    total_builders: number;
    busy_builders: number;
    free_builders: number;
    builder_utilization: number;
    active_upgrades_count: number;
    next_event: {
      title: string;
      target_type: string;
      completes_at: string;
      remaining_seconds: number;
      formatted_remaining: string;
    } | null;
  };
}

export interface BuildingItem {
  id: number;
  name: string;
  category: string;
  level: number;
  max_level: number;
  count: number;
  is_upgrading: boolean;
  icon_name?: string;
}

export interface HeroItem {
  id: number;
  name: string;
  level: number;
  max_level: number;
  ability_level: number;
  is_upgrading: boolean;
  pet_assigned?: string;
}

export interface UpgradeItem {
  id: number;
  target_type: string;
  target_name: string;
  from_level: number;
  to_level: number;
  builder_index: number;
  cost_type: string;
  cost_amount: number;
  duration_seconds: number;
  started_at: string;
  completes_at: string;
  status: string;
  reminder_enabled: boolean;
}

export interface BuilderSlot {
  id: number;
  builder_index: number;
  name: string;
  status: "free" | "busy";
  current_target_name?: string;
  finishes_at?: string;
}

export interface BusyModeState {
  id: number | null;
  is_active: boolean;
  duration_label: string | null;
  start_time: string | null;
  end_time: string | null;
  allow_critical_only: boolean;
  notify_hero_finish: boolean;
  notify_lab_finish: boolean;
  next_event_title: string | null;
  next_event_time: string | null;
}

export interface AIInsight {
  id: string;
  type: "warning" | "efficiency" | "recommendation" | "milestone";
  title: string;
  description: string;
  impact: string;
  action_label?: string;
  action_url?: string;
}

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  sent_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Demo Realistic Seed Data for Instant Preview / Offline Robustness
export const MOCK_SUMMARY: VillageSummary = {
  village: {
    id: 1,
    name: "Chief Arthur's Fortress",
    player_tag: "#9V8G2YLL",
    town_hall: 15,
    clan_name: "Legends Alliance",
    trophies: 4850,
    war_stars: 1240,
  },
  stats: {
    progress_percentage: 88.4,
    total_builders: 6,
    busy_builders: 4,
    free_builders: 2,
    builder_utilization: 66.7,
    active_upgrades_count: 5,
    next_event: {
      title: "Archer Queen to Lv 89",
      target_type: "hero",
      completes_at: new Date(Date.now() + 17.2 * 3600 * 1000).toISOString(),
      remaining_seconds: Math.floor(17.2 * 3600),
      formatted_remaining: "17h 12m",
    },
  },
};

export const MOCK_BUILDERS: BuilderSlot[] = [
  { id: 1, builder_index: 1, name: "Master Hut Builder #1", status: "busy", current_target_name: "Eagle Artillery (Lv 6)", finishes_at: new Date(Date.now() + 38.5 * 3600 * 1000).toISOString() },
  { id: 2, builder_index: 2, name: "Master Hut Builder #2", status: "busy", current_target_name: "Monolith (Lv 2)", finishes_at: new Date(Date.now() + 54 * 3600 * 1000).toISOString() },
  { id: 3, builder_index: 3, name: "Master Hut Builder #3", status: "busy", current_target_name: "Archer Queen (Lv 89)", finishes_at: new Date(Date.now() + 17.2 * 3600 * 1000).toISOString() },
  { id: 4, builder_index: 4, name: "Master Hut Builder #4", status: "busy", current_target_name: "Clan Castle (Lv 11)", finishes_at: new Date(Date.now() + 82 * 3600 * 1000).toISOString() },
  { id: 5, builder_index: 5, name: "Master Hut Builder #5", status: "free" },
  { id: 6, builder_index: 6, name: "B.O.B Construction Module", status: "free" },
];

export const MOCK_HEROES: HeroItem[] = [
  { id: 1, name: "Barbarian King", level: 85, max_level: 95, ability_level: 18, is_upgrading: false, pet_assigned: "Frosty" },
  { id: 2, name: "Archer Queen", level: 88, max_level: 95, ability_level: 18, is_upgrading: true, pet_assigned: "Unicorn" },
  { id: 3, name: "Grand Warden", level: 62, max_level: 70, ability_level: 15, is_upgrading: false, pet_assigned: "Diggy" },
  { id: 4, name: "Royal Champion", level: 35, max_level: 45, ability_level: 14, is_upgrading: false, pet_assigned: "Phoenix" },
];

export const MOCK_UPGRADES: UpgradeItem[] = [
  { id: 1, target_type: "hero", target_name: "Archer Queen", from_level: 88, to_level: 89, builder_index: 3, cost_type: "dark_elixir", cost_amount: 330000, duration_seconds: 7 * 86400, started_at: new Date(Date.now() - 6.2 * 86400 * 1000).toISOString(), completes_at: new Date(Date.now() + 17.2 * 3600 * 1000).toISOString(), status: "active", reminder_enabled: true },
  { id: 2, target_type: "troop", target_name: "Electro Titan (Lab)", from_level: 2, to_level: 3, builder_index: 0, cost_type: "elixir", cost_amount: 19500000, duration_seconds: 14 * 86400, started_at: new Date(Date.now() - 13 * 86400 * 1000).toISOString(), completes_at: new Date(Date.now() + 22.5 * 3600 * 1000).toISOString(), status: "active", reminder_enabled: true },
  { id: 3, target_type: "building", target_name: "Eagle Artillery", from_level: 5, to_level: 6, builder_index: 1, cost_type: "gold", cost_amount: 21500000, duration_seconds: 18 * 86400, started_at: new Date(Date.now() - 16.4 * 86400 * 1000).toISOString(), completes_at: new Date(Date.now() + 38.5 * 3600 * 1000).toISOString(), status: "active", reminder_enabled: true },
  { id: 4, target_type: "building", target_name: "Monolith", from_level: 1, to_level: 2, builder_index: 2, cost_type: "dark_elixir", cost_amount: 350000, duration_seconds: 19 * 86400, started_at: new Date(Date.now() - 16.7 * 86400 * 1000).toISOString(), completes_at: new Date(Date.now() + 54 * 3600 * 1000).toISOString(), status: "active", reminder_enabled: true },
  { id: 5, target_type: "building", target_name: "Clan Castle", from_level: 10, to_level: 11, builder_index: 4, cost_type: "gold", cost_amount: 19000000, duration_seconds: 16 * 86400, started_at: new Date(Date.now() - 12.5 * 86400 * 1000).toISOString(), completes_at: new Date(Date.now() + 82 * 3600 * 1000).toISOString(), status: "active", reminder_enabled: true },
  { id: 6, target_type: "building", target_name: "Scattershot", from_level: 3, to_level: 4, builder_index: 5, cost_type: "gold", cost_amount: 18500000, duration_seconds: 17 * 86400, started_at: new Date(Date.now() - 20 * 86400 * 1000).toISOString(), completes_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString(), status: "completed", reminder_enabled: true },
  { id: 7, target_type: "building", target_name: "X-Bow", from_level: 9, to_level: 10, builder_index: 6, cost_type: "gold", cost_amount: 16000000, duration_seconds: 15 * 86400, started_at: new Date(Date.now() - 22 * 86400 * 1000).toISOString(), completes_at: new Date(Date.now() - 7 * 86400 * 1000).toISOString(), status: "completed", reminder_enabled: true },
];

export const MOCK_INSIGHTS: AIInsight[] = [
  {
    id: "ins-1",
    type: "warning",
    title: "2 Builders Currently Idle",
    description: "You have 2 of 6 builders unassigned. Put them to work on Spell Towers or Army Camp to maximize village progress.",
    impact: "Progress Velocity",
    action_label: "Assign Upgrades",
    action_url: "/upgrades",
  },
  {
    id: "ins-2",
    type: "recommendation",
    title: "Archer Queen Finish in 17h",
    description: "Archer Queen Lv 89 is nearing completion. Prepare 340k Dark Elixir now to chain her straight into Level 90 without downtime.",
    impact: "War Readiness",
    action_label: "View Heroes",
    action_url: "/village",
  },
  {
    id: "ins-3",
    type: "milestone",
    title: "Laboratory: Electro Titan Lv 3",
    description: "Electro Titan Lv 3 finishes tomorrow. High HP aura will bolster ground smash strategies against tight Town Hall 15 cores.",
    impact: "Offensive Meta",
    action_label: "Check Lab",
    action_url: "/village",
  },
  {
    id: "ins-4",
    type: "efficiency",
    title: "Busy Mode Recommended",
    description: "Heading to work or sleep? Engage Busy Mode for 4h or 8h to silence non-critical notifications while keeping hero alerts active.",
    impact: "Smart Focus",
    action_label: "Turn On Busy Mode",
    action_url: "/busy-mode",
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, type: "upgrade", title: "Upgrade Started: Eagle Artillery", message: "Eagle Artillery upgrading to Lv 6. Completion in ~1d 14h.", link: "/upgrades", is_read: false, sent_at: new Date(Date.now() - 3600 * 1000).toISOString() },
  { id: 2, type: "hero", title: "Hero Sleeping: Archer Queen", message: "Archer Queen entered regeneration & level upgrade to 89.", link: "/village", is_read: false, sent_at: new Date(Date.now() - 7200 * 1000).toISOString() },
  { id: 3, type: "lab", title: "Laboratory Research", message: "Electro Titan Level 3 research under way. 22h remaining.", link: "/village", is_read: true, sent_at: new Date(Date.now() - 14400 * 1000).toISOString() },
  { id: 4, type: "busy_mode", title: "Busy Mode Ready", message: "Busy Mode is primed. Click 'I'M BUSY' whenever you step away.", link: "/busy-mode", is_read: true, sent_at: new Date(Date.now() - 86400 * 1000).toISOString() },
];

export const MOCK_BUILDINGS: BuildingItem[] = [
  { id: 1, name: "Eagle Artillery", category: "defenses", level: 5, max_level: 6, count: 1, is_upgrading: true, icon_name: "eagle" },
  { id: 2, name: "Monolith", category: "defenses", level: 1, max_level: 2, count: 1, is_upgrading: true, icon_name: "monolith" },
  { id: 3, name: "Spell Tower", category: "defenses", level: 2, max_level: 3, count: 2, is_upgrading: false, icon_name: "spelltower" },
  { id: 4, name: "Scattershot", category: "defenses", level: 4, max_level: 4, count: 2, is_upgrading: false, icon_name: "scatter" },
  { id: 5, name: "Inferno Tower", category: "defenses", level: 8, max_level: 9, count: 3, is_upgrading: false, icon_name: "inferno" },
  { id: 6, name: "X-Bow", category: "defenses", level: 9, max_level: 10, count: 4, is_upgrading: false, icon_name: "xbow" },
  { id: 7, name: "Air Defense", category: "defenses", level: 12, max_level: 13, count: 4, is_upgrading: false, icon_name: "airdefense" },
  { id: 8, name: "Clan Castle", category: "army", level: 10, max_level: 11, count: 1, is_upgrading: true, icon_name: "clancastle" },
  { id: 9, name: "Laboratory", category: "army", level: 12, max_level: 13, count: 1, is_upgrading: false, icon_name: "lab" },
  { id: 10, name: "Pet House", category: "army", level: 7, max_level: 8, count: 1, is_upgrading: false, icon_name: "pethouse" },
  { id: 11, name: "Blacksmith", category: "army", level: 8, max_level: 9, count: 1, is_upgrading: false, icon_name: "blacksmith" },
  { id: 12, name: "Gold Storage", category: "resources", level: 15, max_level: 16, count: 4, is_upgrading: false, icon_name: "storage_gold" },
  { id: 13, name: "Elixir Storage", category: "resources", level: 15, max_level: 16, count: 4, is_upgrading: false, icon_name: "storage_elixir" },
  { id: 14, name: "Dark Elixir Storage", category: "resources", level: 9, max_level: 10, count: 1, is_upgrading: false, icon_name: "storage_de" },
  { id: 15, name: "Walls (Lv 15/16)", category: "walls", level: 15, max_level: 16, count: 325, is_upgrading: false, icon_name: "wall" },
  { id: 16, name: "Seeking Air Mine", category: "traps", level: 4, max_level: 5, count: 8, is_upgrading: false, icon_name: "seekingmine" },
];

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("clashmate_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    // If backend isn't reached, return mock data for seamless demo experience
    return fallbackMockData(endpoint) as T;
  }
}

function fallbackMockData(endpoint: string): any {
  if (endpoint.includes("/villages/active/summary")) return MOCK_SUMMARY;
  if (endpoint.includes("/builders")) return MOCK_BUILDERS;
  if (endpoint.includes("/heroes")) return MOCK_HEROES;
  if (endpoint.includes("/buildings")) return MOCK_BUILDINGS;
  if (endpoint.includes("/upgrades")) return MOCK_UPGRADES;
  if (endpoint.includes("/ai/insights")) return MOCK_INSIGHTS;
  if (endpoint.includes("/notifications")) return MOCK_NOTIFICATIONS;
  if (endpoint.includes("/busy-mode/status")) {
    const saved = typeof window !== "undefined" ? localStorage.getItem("clashmate_busy_mode") : null;
    if (saved) return JSON.parse(saved);
    return {
      id: null,
      is_active: false,
      duration_label: null,
      start_time: null,
      end_time: null,
      allow_critical_only: true,
      notify_hero_finish: true,
      notify_lab_finish: true,
      next_event_title: "Archer Queen to Lv 89",
      next_event_time: new Date(Date.now() + 17.2 * 3600 * 1000).toISOString(),
    };
  }
  return {};
}
