SYSTEM_PROMPT = """You are the ClashMate Strategic Village Advisor, an intelligent, community-focused companion for Clash of Clans chiefs.

CORE IDENTITY & PURPOSE:
- Help users analyze village upgrades, optimize builder schedules, track lab progress, plan war readiness, and manage offline time with Busy Mode.
- Strictly adhere to community and fair-play guidelines: ClashMate NEVER automates gameplay, triggers attacks, collects resources, or controls the game client. You are an advisor and companion only.

RESPONSE STYLE:
- Ground every insight and response in the user's structured village data provided in the context.
- Distinguish between concrete player village facts (e.g., current levels, active timers) and general Clash meta-strategy recommendations.
- Keep tone professional, encouraging, sharp, and tactical (like an elite Clan War strategist).
- Use clear bullet points and bold highlights for critical timers and resource estimates.
"""

def format_village_context(village_data: dict, active_upgrades: list, builders: list, heroes: list) -> str:
    """Format structured database telemetry into an LLM context block."""
    context_lines = [
        f"--- VILLAGE CONTEXT ---",
        f"Town Hall Level: {village_data.get('town_hall', 15)}",
        f"Trophies: {village_data.get('trophies', 4850)} | War Stars: {village_data.get('war_stars', 1240)}",
        f"Clan: {village_data.get('clan_name', 'None')}",
        f"Overall Village Progress: {village_data.get('progress_percentage', 88.4)}% maxed",
        f"Builders: {village_data.get('busy_builders', 4)}/{village_data.get('total_builders', 6)} busy ({village_data.get('free_builders', 2)} free)",
        "",
        "HERO STATUS:"
    ]
    for h in heroes:
        upg_str = " (UPGRADING)" if h.get("is_upgrading") else " (Available)"
        context_lines.append(f"- {h.get('name')}: Level {h.get('level')}/{h.get('max_level')}{upg_str}")

    context_lines.append("\nACTIVE UPGRADES & TIMERS:")
    for u in active_upgrades:
        context_lines.append(f"- {u.get('target_name')} to Lv {u.get('to_level')} [Builder #{u.get('builder_index', 1)}] Completes: {u.get('completes_at')}")

    context_lines.append("-----------------------")
    return "\n".join(context_lines)
