# Agent & Developer Guidelines (AGENTS.md)

Welcome! This document establishes the guidelines, tech stack, standards, and workflow conventions for all developers and AI programming agents (including Copilot, Claude Code, Cursor, and Antigravity) working on this repository.

---

## 1. Core Technology Stack

* **Frontend Library**: React 19 (`react` & `react-dom` `^19.2.4`)
* **Language**: TypeScript (`~5.9.3`)
* **Build Tool & Dev Server**: Vite 8 (`vite` `^8.0.1`)
* **Routing**: React Router v7 (`react-router-dom` `^7.14.0`)
* **Styling**: Vanilla CSS Modules (`*.module.css`)
* **Testing Framework**: Vitest (`^4.1.5`) + React Testing Library (`^16.3.2`) + JSDOM (`^29.1.0`)
* **Linter**: ESLint 9 (`^9.39.4`) with flat config (`eslint.config.js`)

---

## 2. Standard CLI Commands

Use the following `pnpm` commands to build, test, and lint the project. Do **not** use `npm` or `yarn`.

* **Start Dev Server**: 
  ```bash
  pnpm dev
  ```
  *(Starts the Vite dev server on port `5175`)*

* **Production Build**: 
  ```bash
  pnpm build
  ```
  *(Runs TypeScript diagnostics and compiles the Vite bundle)*

* **Linting & Code Quality**: 
  ```bash
  pnpm lint
  ```
  *(Runs ESLint checks on all `.ts`, `.tsx`, `.js`, and `.jsx` files)*

* **Run Tests**:
  * **Interactive/Watch Mode** (for development):
    ```bash
    pnpm test
    ```
  * **One-Shot Execution** (CI or terminal checks):
    ```bash
    pnpm test --run
    ```
    *(Note: Legacy references to `pnpm test:run` in older documents should be treated as `pnpm test --run`)*

---

## 3. Directory Layout & Exercise Conventions

The repository is structured to manage standalone React exercises for coding interviews and learning. 

### A. Directory Structure
All exercises reside in `src/pages/` and follow either a **Single** or **Variation** structure with fixed, standardized filenames:

* **Single Implementation (Flat)**:
  Used when there is only one way to solve the exercise.
  ```
  src/pages/<camelCaseId>/
    ├── Page.tsx                      # Route entrypoint (imports and renders Component)
    ├── Component.tsx                 # Core component logic and markup
    ├── Component.module.css          # CSS Module styles for Component.tsx
    └── utils.ts                      # Optional helper functions, hooks, or types
  ```

* **Multiple Variations (Subdirectories)**:
  Used when the same problem is solved in multiple ways (e.g., using `useState` vs. `useReducer` or context).
  ```
  src/pages/<camelCaseId>/
    ├── <variation1Id>/
    │     ├── Page.tsx
    │     ├── Component.tsx
    │     ├── Component.module.css
    │     └── utils.ts
    └── <variation2Id>/
          ├── Page.tsx
          ├── Component.tsx
          ├── Component.module.css
          └── utils.ts
  ```

### B. Exercise Registration (`src/exercises.ts`)
Every exercise must be registered in the `exercises` array in [src/exercises.ts](./src/exercises.ts).
* **Flat registration**:
  ```typescript
  { id: 'accordion', label: 'Accordion', done: false, tags: [Tag.State, Tag.TypeScript] }
  ```
* **Variation-based registration**:
  ```typescript
  { 
    id: 'todoList', 
    label: 'Todo List', 
    done: true, 
    tags: [Tag.State, Tag.Forms],
    variations: [
      { id: 'useState',   label: 'useState',   done: true  },
      { id: 'useReducer', label: 'useReducer', done: false }
    ]
  }
  ```

### C. Styling Rules
* Always use **CSS Modules**. Import styling using the exact pattern:
  ```typescript
  import styles from './Component.module.css';
  ```
* Avoid using inline styles or global selectors unless strictly necessary.

---

## 4. Scaffolding New Exercises with the Custom Claude Skill

Claude Code contains a custom workspace-level skill for automated scaffolding. If you are using Claude Code, always leverage this skill to create new exercises or add variations.

### How to Invoke the Skill
```bash
/new-exercise <args>
```

### Supported Modes

1. **New Flat Exercise**:
   ```bash
   /new-exercise <camelCaseId> "<Label>" <tags> [SectionComment]
   ```
   *Example*: `/new-exercise accordion "Accordion" state,typescript Composition`

2. **New Exercise with Variations**:
   ```bash
   /new-exercise <camelCaseId> "<Label>" <tags> variations: <var1Id>:"<Var1Label>",<var2Id>:"<Var2Label>" [SectionComment]
   ```
   *Example*: `/new-exercise formWithValidation "Form Validation" state,forms variations: derivedState:"Derived State",useReducer:"useReducer" Intermediate hooks`

3. **Add Variation to Existing Exercise**:
   ```bash
   /new-exercise add-variation <camelCaseId> <variationId> "<VariationLabel>"
   ```
   *Example*: `/new-exercise add-variation todoList useContext "useContext"`
   *(If the target exercise was flat, the skill will automatically ask you to name the existing implementation, migrate the files into a subdirectory, and convert the `exercises.ts` registration to variations format).*
