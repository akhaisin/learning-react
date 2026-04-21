---
name: new-exercise
description: Scaffold a new exercise placeholder — creates the Page.tsx file and registers the exercise in exercises.ts
argument-hint: <camelCaseId> "<Label>" <tag1,tag2,...> [section comment]
---

Create a new exercise placeholder. Arguments are: `$ARGUMENTS`

Parse `$ARGUMENTS` as follows:
- **First word** — `camelCaseId` (e.g. `infiniteScroll`, `useDebounce`)
- **Quoted string** — human-readable label (e.g. `"Infinite Scroll"`)
- **Third word** — comma-separated tags from the allowed set: `state`, `hooks`, `effects`, `refs`, `context`, `reducer`, `forms`, `async`, `dom`, `drag & drop`, `performance`, `typescript`
- **Remaining text (optional)** — the `// Section comment` in `exercises.ts` under which to insert the entry. If omitted, append after the last entry.

Derive **PascalCaseId** from `camelCaseId` by uppercasing the first letter (e.g. `infiniteScroll` → `InfiniteScroll`, `useDebounce` → `UseDebounce`).

## Step 1 — Draft and confirm the description

Write a 2–4 sentence description of the exercise based on the label and tags. The description should:
- State what the user will build
- Call out the key React concepts or APIs they'll use (use `<code>` tags for inline code like hook names, method names)
- Match the tone and detail level of this example: *"Build a list that loads more items when the user scrolls to the bottom. Use a `<code>useRef</code>` to attach an `<code>IntersectionObserver</code>` to a sentinel element at the end of the list. When the sentinel becomes visible, append the next page of items. Show a loading indicator while fetching and handle the end-of-data state."*

Present the draft to the user and ask: **"Use this description, or provide your own?"**

Wait for the user's response before proceeding. If they provide their own text, use that instead.

## Step 2 — Create the CSS module file

Create `src/pages/<camelCaseId>/<PascalCaseId>.module.css` with:

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

## Step 3 — Create the Page file

Create `src/pages/<camelCaseId>/<PascalCaseId>Page.tsx` with this exact content (substitute the component name):

```tsx
import styles from './<PascalCaseId>.module.css';

function <PascalCaseId>() {
  return (
    <div>
      <p className={styles.description}>
        {/* Render the confirmed description as JSX. Wrap inline code references in <code> elements.
            Use {' '} for spacing around inline elements. Escape < and > as &lt; and &gt; inside <code> when needed. */}
      </p>
      <p className={styles.placeholder}>Not implemented yet.</p>
    </div>
  );
}

export default <PascalCaseId>;
```

## Step 4 — Register in exercises.ts

Add an entry to the `exercises` array in `src/exercises.ts`:

```ts
{ id: '<camelCaseId>', label: '<Label>', done: false, tags: [<tags>] },
```

- Map each tag string to its `Tag.*` constant (e.g. `hooks` → `Tag.Hooks`, `drag & drop` → `Tag.DragDrop`, `typescript` → `Tag.TypeScript`).
- If a section comment was given, insert the entry as the last item under that comment block. If the section doesn't exist, add `// <section comment>` above the new entry, placed logically after the last existing block.
- If no section comment was given, append after the last entry in the array.

## Step 5 — Confirm

Report the files created/modified and the full exercises.ts entry that was added.
