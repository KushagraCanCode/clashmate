# Busy Mode — Signature Feature Specification

## Purpose
"I'M BUSY" is ClashMate's flagship feature designed to resolve the psychological friction between real-life responsibilities (work, school, driving, sleep) and village management.

## Core Philosophy
1. **Silence Noise, Retain Priority**: Minor upgrades (e.g. bomb traps, gold mines) do not demand immediate attention. Critical milestones (Hero awakening before Clan War battle day, Laboratory research concluding) require timely notifications.
2. **Predictive Event Grounding**: When Busy Mode is activated, the system calculates which upgrades will complete during the session and summarizes what the player should expect upon returning.
3. **No Automation**: Busy Mode **never** queues new upgrades automatically or collects loot. The player stays in full control.

## Notification Workflow Diagram

```
[Event Triggers: Upgrade Finishes]
                |
                v
       [Is User in Busy Mode?]
              /        \
            YES         NO
            /             \
[Is Event Critical?]    [Apply Standard Quiet Hours]
      /        \                    |
    YES         NO                  v
    /             \         [Dispatch Configured Channel]
[Send Alert]   [Suppress]
```

## Configurable Options
- **Duration Options**: 1 hour, 2 hours, 4 hours, 8 hours, Until tomorrow, or Custom hours.
- **Critical-Only Filter**: Mutes regular defense and resource upgrades.
- **Hero Finish Override**: Pings the user when Barbarian King, Archer Queen, Grand Warden, or Royal Champion is fully healed and ready for Clan War attacks.
- **Laboratory Finish Override**: Pings the user when research is done to avoid idle laboratory capacity.
