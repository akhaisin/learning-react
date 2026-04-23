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

## Adding exercises

Use the `/new-exercise` skill in Claude Code. It has three modes.

---

### New exercise (single implementation)

```
/new-exercise <camelCaseId> "<Label>" <tag1,tag2,...> [Section comment]
```

The skill will:
1. Draft a description and ask you to confirm or replace it
2. Create `src/pages/<id>/<PascalCaseId>.module.css`
3. Create `src/pages/<id>/<PascalCaseId>Page.tsx` with the description and a "Not implemented yet" placeholder
4. Register the exercise in `src/exercises.ts` under the given section

```
/new-exercise accordion "Accordion" state,typescript Composition
```

---

### New exercise (with variations)

Same as above but with a `variations:` argument. Each variation is the same problem solved differently. The skill creates a subdirectory per variation instead of a root-level page.

```
/new-exercise <camelCaseId> "<Label>" <tags> variations: <id1>:"<Label1>",<id2>:"<Label2>" [Section comment]
```

```
/new-exercise formWithValidation "Form With Validation" state,forms,typescript variations: derivedState:"Derived State",useReducer:"useReducer" Intermediate hooks
```

File structure produced:
```
src/pages/formWithValidation/
  derivedState/
    FormWithValidationPage.tsx
    FormWithValidation.module.css
  useReducer/
    FormWithValidationPage.tsx
    FormWithValidation.module.css
```

Routes: `/formWithValidation/derivedState`, `/formWithValidation/useReducer`

---

### Add a variation to an existing exercise

```
/new-exercise add-variation <camelCaseId> <variationId> "<Variation Label>"
```

**If the exercise already has variations** — appends a new variation subdirectory and updates the registry.

**If the exercise has a single flat implementation** — the skill will first ask what ID to give the existing code, migrate all root-level files into that subdirectory, then create the new variation alongside it. The registry entry is updated to introduce the `variations` array.

```
/new-exercise add-variation todoList useContext "useContext"
```

---

### Available tags

`state` · `hooks` · `effects` · `refs` · `context` · `reducer` · `forms` · `async` · `dom` · `drag & drop` · `performance` · `typescript`
