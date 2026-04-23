---
name: new-exercise
description: Scaffold a new exercise placeholder — creates the Page.tsx file and registers the exercise in exercises.ts. Supports optional variations (same problem, multiple implementations) and adding a new variation to an existing exercise.
argument-hint: <camelCaseId> "<Label>" <tag1,tag2,...> [variations: <id>:"<Label>",...] [section] | add-variation <camelCaseId> <variationId> "<Label>"
---

Create a new exercise placeholder. Arguments are: `$ARGUMENTS`

Determine the **mode** first by inspecting the first word of `$ARGUMENTS`:

- If the first word is **`add-variation`** → **Add-variation mode** (see bottom section).
- Otherwise → **New exercise mode** (single or variation).

---

## New exercise mode

Parse the remaining arguments:
- **First word** — `camelCaseId` (e.g. `infiniteScroll`, `useDebounce`)
- **Quoted string** — human-readable label (e.g. `"Infinite Scroll"`)
- **Third word** — comma-separated tags from the allowed set: `state`, `hooks`, `effects`, `refs`, `context`, `reducer`, `forms`, `async`, `dom`, `drag & drop`, `performance`, `typescript`
- **Optional `variations:` argument** — the literal word `variations:` followed immediately (no space) by a comma-separated list of `id:"Label"` pairs, e.g. `variations: useState:"useState",useReducer:"useReducer"`. If present, the exercise will have multiple variation subdirectories instead of a single root page.
- **Remaining text (optional)** — the `// Section comment` in `exercises.ts` under which to insert the entry. If omitted, append after the last entry.

Derive **PascalCaseId** from `camelCaseId` by uppercasing the first letter (e.g. `infiniteScroll` → `InfiniteScroll`, `useDebounce` → `UseDebounce`).

Determine the **sub-mode**:
- **Single mode** — no `variations:` argument. Behaves exactly as before.
- **Variation mode** — `variations:` argument present. Each variation gets its own subdirectory.

---

## Step 1 — Draft and confirm the description(s)

**Single mode:** Write a 2–4 sentence description of the exercise based on the label and tags. The description should:
- State what the user will build
- Call out the key React concepts or APIs they'll use (use `<code>` tags for inline code like hook names, method names)
- Match the tone and detail level of this example: *"Build a list that loads more items when the user scrolls to the bottom. Use a `<code>useRef</code>` to attach an `<code>IntersectionObserver</code>` to a sentinel element at the end of the list. When the sentinel becomes visible, append the next page of items. Show a loading indicator while fetching and handle the end-of-data state."*

**Variation mode:** Write one description **per variation**. Each description covers the same problem but frames it through the lens of that variation's approach. The first sentence can be shared ("Build a todo list…"); the rest should call out what's specific to this variation's implementation (which hook/pattern, what it demonstrates, what the key constraint is).

Present the draft(s) to the user and ask: **"Use these descriptions, or provide your own?"**

Wait for the user's response before proceeding. If they provide their own text, use that instead.

---

## Step 2 — Create files

### Single mode

Create `src/pages/<camelCaseId>/<PascalCaseId>.module.css`:

```css
.description {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
  max-width: 560px;
  line-height: 1.55;
}

.placeholder {
  color: #aaa;
  font-style: italic;
}
```

Create `src/pages/<camelCaseId>/<PascalCaseId>Page.tsx`:

```tsx
import styles from './<PascalCaseId>.module.css';

function <PascalCaseId>() {
  return (
    <div>
      <p className={styles.description}>
        {/* Confirmed description as JSX. Wrap inline code in <code>. Use {' '} for spacing. */}
      </p>
      <p className={styles.placeholder}>Not implemented yet.</p>
    </div>
  );
}

export default <PascalCaseId>;
```

### Variation mode

For **each variation** (`id`, `Label`), create two files inside `src/pages/<camelCaseId>/<variationId>/`:

**`<PascalCaseId>.module.css`** — same CSS as single mode above.

**`<PascalCaseId>Page.tsx`** — same structure as single mode, but using that variation's confirmed description:

```tsx
import styles from './<PascalCaseId>.module.css';

function <PascalCaseId>() {
  return (
    <div>
      <p className={styles.description}>
        {/* This variation's confirmed description as JSX. */}
      </p>
      <p className={styles.placeholder}>Not implemented yet.</p>
    </div>
  );
}

export default <PascalCaseId>;
```

Note: the component name is the same (`<PascalCaseId>`) in every variation — each file lives in its own subdirectory so there is no naming conflict.

---

## Step 3 — Register in exercises.ts

### Single mode

Add an entry to the `exercises` array in `src/exercises.ts`:

```ts
{ id: '<camelCaseId>', label: '<Label>', done: false, tags: [<tags>] },
```

### Variation mode

Add an entry with a `variations` array:

```ts
{ id: '<camelCaseId>', label: '<Label>', done: false, tags: [<tags>],
  variations: [
    { id: '<id1>', label: '<Label1>', done: false },
    { id: '<id2>', label: '<Label2>', done: false },
  ],
},
```

**For both modes:**
- Map each tag string to its `Tag.*` constant (e.g. `hooks` → `Tag.Hooks`, `drag & drop` → `Tag.DragDrop`, `typescript` → `Tag.TypeScript`).
- If a section comment was given, insert the entry as the last item under that comment block. If the section doesn't exist, add `// <section comment>` above the new entry, placed logically after the last existing block.
- If no section comment was given, append after the last entry in the array.

---

## Step 4 — Confirm

Report the files created/modified and the full `exercises.ts` entry that was added.

---

## Add-variation mode

Arguments after the `add-variation` keyword:
- **Second word** — `camelCaseId` of the existing exercise (e.g. `todoList`)
- **Third word** — `variationId` for the new variation (e.g. `useContext`)
- **Quoted string** — human-readable label for the variation (e.g. `"useContext"`)

Derive **PascalCaseId** from `camelCaseId` as above.

### Step A — Verify and detect sub-mode

Read `src/exercises.ts`:
1. Confirm an entry with `id: '<camelCaseId>'` exists. If not, stop and tell the user.
2. Confirm `src/pages/<camelCaseId>/<variationId>/` does not already exist. If it does, stop and tell the user.
3. Check whether the entry already has a `variations` array:
   - **Yes** → **Append sub-mode** (the exercise already uses variations — just add one more).
   - **No** → **Convert sub-mode** (the exercise has a single flat implementation — must be converted first).

---

### Append sub-mode

The exercise already has a `variations` array. Follow steps B → E below.

---

### Convert sub-mode

The exercise has a single flat implementation. It must be restructured into subdirectories before the new variation can be added.

#### Step A2 — Ask for the existing variation ID

The current root-level files need a home. Ask the user:

> **"What variation ID should represent the current implementation?"** (e.g. `useState`, `imperative`, `basic`)

Wait for the answer. Call this `existingVariationId` and derive `existingVariationLabel` from it (use the ID itself as label if none given). This variation inherits the exercise's current `done` value.

#### Step A3 — List and migrate existing files

List all files currently in `src/pages/<camelCaseId>/` (the root, not subdirectories). Copy each file into `src/pages/<camelCaseId>/<existingVariationId>/`, preserving filenames. Then delete the originals from the root.

Update any import paths inside the copied files if they referenced sibling files by relative path — the relative paths remain the same (`./Foo`) since all files move together, so no import changes are needed in most cases.

#### Step A4 — Update exercises.ts to introduce the variations array

Replace the existing flat entry:
```ts
{ id: '<camelCaseId>', label: '<Label>', done: <done>, tags: [<tags>] },
```
with:
```ts
{ id: '<camelCaseId>', label: '<Label>', done: <done>, tags: [<tags>],
  variations: [
    { id: '<existingVariationId>', label: '<existingVariationLabel>', done: <done> },
  ],
},
```
(The new variation will be appended in Step D.)

Now continue to Step B.

---

### Step B — Draft and confirm the description

Read the existing variation pages in `src/pages/<camelCaseId>/` to understand the problem and the tone already established. Then write a 2–4 sentence description for the new variation, framing the same problem through this variation's specific approach.

Present the draft and ask: **"Use this description, or provide your own?"**

Wait for the user's response before proceeding.

### Step C — Create the new variation files

Create `src/pages/<camelCaseId>/<variationId>/<PascalCaseId>.module.css`:

```css
.description {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
  max-width: 560px;
  line-height: 1.55;
}

.placeholder {
  color: #aaa;
  font-style: italic;
}
```

Create `src/pages/<camelCaseId>/<variationId>/<PascalCaseId>Page.tsx`:

```tsx
import styles from './<PascalCaseId>.module.css';

function <PascalCaseId>() {
  return (
    <div>
      <p className={styles.description}>
        {/* Confirmed description as JSX. */}
      </p>
      <p className={styles.placeholder}>Not implemented yet.</p>
    </div>
  );
}

export default <PascalCaseId>;
```

### Step D — Update exercises.ts

Append the new variation to the `variations` array of the matching exercise:

```ts
{ id: '<variationId>', label: '<Variation Label>', done: false },
```

### Step E — Confirm

Report all files created, moved, or deleted, and the final `exercises.ts` variations array.
