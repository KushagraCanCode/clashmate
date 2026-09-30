from typing import List, Dict, Any
import datetime

def generate_ai_insights(village_stats: Dict[str, Any], active_upgrades: List[Dict[str, Any]], heroes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Synthesize high-value tactical AI insights directly from structured database telemetry."""
    insights = []

    # 1. Builder Availability Insight
    free_builders = village_stats.get("free_builders", 0)
    total_builders = village_stats.get("total_builders", 6)
    if free_builders > 0:
        insights.append({
            "id": "ins-builder-idle",
            "type": "warning",
            "title": f"{free_builders} Builder{'s' if free_builders > 1 else ''} Currently Idle",
            "description": f"You have {free_builders} of {total_builders} builders unassigned. Put them to work on core defenses (Spell Tower or X-Bows) or walls to maximize progress velocity.",
            "impact": "High Efficiency Impact",
            "action_label": "Assign Upgrades",
            "action_url": "/upgrades"
        })
    else:
        # Check if next builder frees up soon
        next_event = village_stats.get("next_event")
        if next_event:
            insights.append({
                "id": "ins-builder-next",
                "type": "efficiency",
                "title": f"Builder Opening in {next_event.get('formatted_remaining', 'a few hours')}",
                "description": f"{next_event.get('title')} will complete soon. Prepare your gold/elixir storages now to chain the next upgrade immediately with zero downtime.",
                "impact": "Resource Planning",
                "action_label": "View Builder Hut",
                "action_url": "/builders"
            })

    # 2. Hero Upgrade & Clan War Readiness
    upgrading_heroes = [h for h in heroes if h.get("is_upgrading")]
    if upgrading_heroes:
        h_names = ", ".join(h.get("name") for h in upgrading_heroes)
        insights.append({
            "id": "ins-hero-war",
            "type": "recommendation",
            "title": f"Hero Sleeping: {h_names}",
            "description": f"{h_names} is currently unavailable for Clan War and Legend League attacks. Consider planning your war attacks accordingly or reserving a Hero Book.",
            "impact": "War Readiness",
            "action_label": "Inspect Heroes",
            "action_url": "/village"
        })

    # 3. Laboratory Synergy
    insights.append({
        "id": "ins-lab-synergy",
        "type": "milestone",
        "title": "Laboratory Pace: Electro Titan Research",
        "description": "Electro Titan Lv 3 brings high aura damage against Skeletons & Clan Castle troops. Perfect timing to complement your Ground Smash attack strategies.",
        "impact": "Offensive Meta",
        "action_label": "Check Laboratory",
        "action_url": "/village"
    })

    # 4. Busy Mode Strategic Recommendation
    insights.append({
        "id": "ins-busy-mode",
        "type": "efficiency",
        "title": "Busy Mode Recommendation",
        "description": "Stepping away for work or sleep? Engage Busy Mode for 4h or 8h to silence non-critical notifications while retaining alerts for emergency hero/lab completions.",
        "impact": "Peace of Mind",
        "action_label": "Activate Busy Mode",
        "action_url": "/busy-mode"
    })

    return insights
