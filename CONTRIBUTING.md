# Contributing to ClashMate

Thank you for your interest in contributing to ClashMate!

## 🛡️ Core Product Rule: Fair Play Compliance
ClashMate will **NEVER** accept pull requests or features that:
- Automate gameplay, attacks, or troop deployment.
- Automatically collect resources or clear obstacles.
- Manipulate game client files, memory, or network packets.
- Emulate client keystrokes or touch inputs (macros).

All features must remain purely companion, analytics, scheduling, or strategic advice tools where the player is in complete manual control of the game.

## Development Workflow
1. Fork the repository and create your feature branch: `git checkout -b feature/my-new-feature`.
2. Follow clean code principles and ensure all tests pass:
   ```bash
   pytest -v
   cd frontend && npm run build
   ```
3. Commit your changes and open a Pull Request with a clear description of the problem solved.
