# Claude Code Guidelines

Welcome to the workspace! To ensure consistent development, coding standards, and directory conventions:

👉 **You must read and strictly adhere to the guidelines detailed in [AGENTS.md](./AGENTS.md) immediately on startup.**

### Core Directives for Claude Code:
1. **Always Read AGENTS.md**: Use it as the absolute source of truth for the project's React 19 + TypeScript + Vite 8 stack, CSS module requirements, and standard commands.
2. **Scaffolding**: If asked to create a new exercise or add variations, always use the custom `.claude/skills/new-exercise/` skill as documented in [AGENTS.md](./AGENTS.md#4-scaffolding-new-exercises-with-the-custom-claude-skill).
3. **CLI Commands**: Only run commands listed in [AGENTS.md](./AGENTS.md#2-standard-cli-commands) (such as `pnpm lint`, `pnpm build`, `pnpm test`, or `pnpm test --run`). Do not invent custom commands.
