# React exercises

Various React exercises which fit into 1h maximum interview session.

## Stack and Commands
- Stack: React + TypeScript + Vite
- Package manager: pnpm
- Common commands:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm lint`
  - `pnpm test:run`

## Adding a new exercise

Use the `/new-exercise` skill in Claude Code to scaffold a new exercise placeholder:

```
/new-exercise <camelCaseId> "<Label>" <tag1,tag2,...> [Section comment]
```

The skill will:
1. Draft a description and ask you to confirm or replace it
2. Create `src/pages/<id>/<PascalCaseId>.module.css`
3. Create `src/pages/<id>/<PascalCaseId>Page.tsx` with the description and a "Not implemented yet" placeholder
4. Register the exercise in `src/exercises.ts` under the given section

Available tags: `state`, `hooks`, `effects`, `refs`, `context`, `reducer`, `forms`, `async`, `dom`, `drag & drop`, `performance`, `typescript`

**Examples:**

```
/new-exercise accordion "Accordion" state,typescript Composition
```

```
/new-exercise toastNotifications "Toast Notifications" context,reducer,hooks Context & state machines
```
