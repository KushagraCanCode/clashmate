import datetime
from datetime import timedelta, timezone
from sqlalchemy.orm import Session
from app.core.utils import ensure_tz, utcnow
from app.models.models import (
    Village, Building, Hero, Troop, Builder, Upgrade, UserSettings, PublicProfile, Notification
)

def seed_default_village(db: Session, user_id: int, player_name: str = "Chief Arthur", player_tag: str = "#8V9GL2P9") -> Village:
    """Create a rich, realistic Town Hall 15 village with active upgrades, builders, and heroes."""
    
    # 1. Create Village
    village = Village(
        user_id=user_id,
        name=f"{player_name}'s Fortress",
        player_tag=player_tag,
        town_hall_level=15,
        builder_count=6,
        builder_hall_level=10,
        war_stars=1240,
        trophies=4850,
        highest_trophies=5240,
        clan_name="Legends Alliance",
        sync_mode="companion_synced"
    )
    db.add(village)
    db.flush()

    # 2. Defenses & Buildings
    buildings_data = [
        # Defenses
        ("Eagle Artillery", "defenses", 5, 6, 1, "eagle"),
        ("Monolith", "defenses", 1, 2, 1, "monolith"),
        ("Spell Tower", "defenses", 2, 3, 2, "spelltower"),
        ("Scattershot", "defenses", 3, 4, 2, "scatter"),
        ("Inferno Tower", "defenses", 8, 9, 3, "inferno"),
        ("X-Bow", "defenses", 9, 10, 4, "xbow"),
        ("Air Defense", "defenses", 12, 13, 4, "airdefense"),
        ("Wizard Tower", "defenses", 14, 15, 5, "wiztower"),
        ("Hidden Tesla", "defenses", 13, 14, 5, "tesla"),
        ("Archer Tower", "defenses", 20, 21, 8, "archertower"),
        ("Cannon", "defenses", 20, 21, 7, "cannon"),
        # Resources
        ("Gold Storage", "resources", 15, 16, 4, "storage_gold"),
        ("Elixir Storage", "resources", 15, 16, 4, "storage_elixir"),
        ("Dark Elixir Storage", "resources", 9, 10, 1, "storage_de"),
        ("Gold Mine", "resources", 14, 15, 7, "mine_gold"),
        ("Elixir Collector", "resources", 14, 15, 7, "collector_elixir"),
        ("Dark Elixir Drill", "resources", 8, 9, 3, "drill_de"),
        # Army & Special
        ("Clan Castle", "army", 10, 11, 1, "clancastle"),
        ("Laboratory", "army", 12, 13, 1, "lab"),
        ("Pet House", "army", 7, 8, 1, "pethouse"),
        ("Blacksmith", "army", 8, 9, 1, "blacksmith"),
        ("Army Camp", "army", 11, 12, 4, "camp"),
        ("Barracks", "army", 15, 16, 1, "barracks"),
        ("Dark Barracks", "army", 9, 10, 1, "darkbarracks"),
        ("Spell Factory", "army", 6, 7, 1, "spellfactory"),
        ("Workshop", "army", 6, 7, 1, "workshop"),
        # Walls & Traps
        ("Walls (Level 15/16)", "walls", 15, 16, 325, "wall"),
        ("Seeking Air Mine", "traps", 4, 5, 8, "seekingmine"),
        ("Giant Bomb", "traps", 8, 9, 7, "giantbomb"),
        ("Air Bomb", "traps", 9, 10, 6, "airbomb"),
        ("Spring Trap", "traps", 5, 5, 9, "springtrap"),
    ]

    for name, cat, lvl, max_l, count, icon in buildings_data:
        b = Building(
            village_id=village.id,
            name=name,
            category=cat,
            level=lvl,
            max_level=max_l,
            count=count,
            icon_name=icon,
            is_upgrading=False
        )
        db.add(b)

    # 3. Heroes
    heroes_data = [
        ("Barbarian King", 85, 95, 18, False, "Frosty"),
        ("Archer Queen", 88, 95, 18, True, "Unicorn"),
        ("Grand Warden", 62, 70, 15, False, "Diggy"),
        ("Royal Champion", 35, 45, 14, False, "Phoenix"),
    ]
    for name, lvl, max_l, ab_lvl, is_up, pet in heroes_data:
        h = Hero(
            village_id=village.id,
            name=name,
            level=lvl,
            max_level=max_l,
            ability_level=ab_lvl,
            is_upgrading=is_up,
            pet_assigned=pet
        )
        db.add(h)

    # 4. Troops / Lab sample
    troops_data = [
        ("Electro Titan", "troops", 2, 3, True),
        ("Root Rider", "troops", 2, 3, False),
        ("Dragon", "troops", 10, 11, False),
        ("Balloons", "troops", 10, 11, False),
        ("Super Bowler", "troops", 7, 8, False),
        ("Rage Spell", "spells", 5, 6, False),
        ("Healing Spell", "spells", 8, 9, False),
        ("Freeze Spell", "spells", 7, 7, False),
        ("Overgrowth Spell", "spells", 3, 4, False),
        ("Flame Flinger", "siege", 3, 4, False),
        ("Battle Blimp", "siege", 4, 4, False),
    ]
    for name, cat, lvl, max_l, is_res in troops_data:
        t = Troop(
            village_id=village.id,
            name=name,
            category=cat,
            level=lvl,
            max_level=max_l,
            is_researching=is_res
        )
        db.add(t)

    # 5. Builders (6 builders)
    now = utcnow()
    upgrades_data = [
        # (builder_idx, target_type, target_name, from_lvl, to_lvl, cost_type, cost_amount, duration_hrs, remaining_hrs)
        (1, "building", "Eagle Artillery", 5, 6, "gold", 21500000, 18 * 24, 38.5),
        (2, "building", "Monolith", 1, 2, "dark_elixir", 350000, 19 * 24, 54.0),
        (3, "hero", "Archer Queen", 88, 89, "dark_elixir", 330000, 7 * 24, 17.2),
        (4, "building", "Clan Castle", 10, 11, "gold", 19000000, 16 * 24, 82.0),
        # Lab upgrade (builder_index=0)
        (0, "troop", "Electro Titan", 2, 3, "elixir", 19500000, 14 * 24, 22.5),
    ]

    # Add active upgrades
    for b_idx, t_type, t_name, from_l, to_l, c_type, c_amt, dur_h, rem_h in upgrades_data:
        dur_sec = int(dur_h * 3600)
        started = now - timedelta(hours=(dur_h - rem_h))
        completes = now + timedelta(hours=rem_h)
        upg = Upgrade(
            village_id=village.id,
            target_type=t_type,
            target_name=t_name,
            from_level=from_l,
            to_level=to_l,
            builder_index=b_idx,
            cost_type=c_type,
            cost_amount=c_amt,
            duration_seconds=dur_sec,
            started_at=started,
            completes_at=completes,
            status="active",
            reminder_enabled=True,
            reminder_sent=False
        )
        db.add(upg)

    # Builders 1..6
    builder_assignments = {
        1: ("busy", "Eagle Artillery (Lv 6)", now + timedelta(hours=38.5)),
        2: ("busy", "Monolith (Lv 2)", now + timedelta(hours=54.0)),
        3: ("busy", "Archer Queen (Lv 89)", now + timedelta(hours=17.2)),
        4: ("busy", "Clan Castle (Lv 11)", now + timedelta(hours=82.0)),
        5: ("free", None, None),
        6: ("free", None, None), # B.O.B Hut Master Builder
    }

    for idx in range(1, 7):
        status, target, finishes = builder_assignments.get(idx, ("free", None, None))
        name = "B.O.B Construction Module" if idx == 6 else f"Master Hut Builder #{idx}"
        bld = Builder(
            village_id=village.id,
            builder_index=idx,
            name=name,
            status=status,
            current_target_name=target,
            finishes_at=finishes
        )
        db.add(bld)

    # Initial notifications
    notifs = [
        ("upgrade", "Upgrade Started", "Eagle Artillery upgrading to Level 6. Finish in ~1d 14h.", "/upgrades"),
        ("hero", "Hero Sleeping", "Archer Queen entered regeneration & level upgrade to 89.", "/village"),
        ("lab", "Laboratory Research", "Electro Titan Level 3 research under way. 22h remaining.", "/village"),
        ("system", "Welcome to ClashMate", "Village synchronized! Setup Busy Mode whenever you step away.", "/dashboard")
    ]
    for n_type, title, msg, link in notifs:
        n = Notification(
            user_id=user_id,
            type=n_type,
            title=title,
            message=msg,
            link=link,
            is_read=False,
            sent_at=now - timedelta(hours=2)
        )
        db.add(n)

    db.commit()
    db.refresh(village)
    return village

def calculate_village_stats(db: Session, village: Village) -> dict:
    """Calculate village progress percentage, active timers, and builder utilization."""
    buildings = db.query(Building).filter(Building.village_id == village.id).all()
    heroes = db.query(Hero).filter(Hero.village_id == village.id).all()
    troops = db.query(Troop).filter(Troop.village_id == village.id).all()
    builders = db.query(Builder).filter(Builder.village_id == village.id).all()
    active_upgrades = db.query(Upgrade).filter(
        Upgrade.village_id == village.id,
        Upgrade.status == "active"
    ).order_by(Upgrade.completes_at.asc()).all()

    # Progress calculation
    total_levels = 0
    max_levels = 0

    for b in buildings:
        total_levels += b.level * b.count
        max_levels += b.max_level * b.count

    for h in heroes:
        total_levels += h.level
        max_levels += h.max_level

    for t in troops:
        total_levels += t.level
        max_levels += t.max_level

    progress_pct = round((total_levels / max(max_levels, 1)) * 100, 1)

    # Builders
    busy_builders = sum(1 for b in builders if b.status == "busy")
    total_builders = len(builders) or 6
    free_builders = max(0, total_builders - busy_builders)
    builder_utilization = round((busy_builders / total_builders) * 100, 1)

    # Next important event
    next_event = None
    if active_upgrades:
        u = active_upgrades[0]
        now = utcnow()
        rem_sec = max(0, int((ensure_tz(u.completes_at) - now).total_seconds()))
        hours = rem_sec // 3600
        mins = (rem_sec % 3600) // 60
        next_event = {
            "title": f"{u.target_name} to Lv {u.to_level}",
            "target_type": u.target_type,
            "completes_at": u.completes_at.isoformat(),
            "remaining_seconds": rem_sec,
            "formatted_remaining": f"{hours}h {mins}m" if hours > 0 else f"{mins}m"
        }

    return {
        "progress_percentage": progress_pct,
        "total_builders": total_builders,
        "busy_builders": busy_builders,
        "free_builders": free_builders,
        "builder_utilization": builder_utilization,
        "active_upgrades_count": len(active_upgrades),
        "next_event": next_event,
        "town_hall": village.town_hall_level,
        "trophies": village.trophies,
        "war_stars": village.war_stars,
        "clan_name": village.clan_name
    }
