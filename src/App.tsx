import type { ComponentType } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout, { type AppPage, type AppVariation } from './layout/AppLayout';
import ExerciseViewer from './layout/ExerciseViewer';
import SandboxEditor from './layout/SandboxEditor';
import { exercises } from './exercises';

type PageModule = {
  default?: ComponentType;
};

// Matches both single-impl exercises (depth 4) and variation exercises (depth 5)
const pageModules = import.meta.glob<PageModule>('./pages/**/*Page.tsx', {
  eager: true,
});

const rawSources = import.meta.glob('./pages/**/*', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

type SingleExerciseData = {
  type: 'single';
  module: PageModule;
  sourceFiles: Record<string, string>;
};

type VariationExerciseData = {
  type: 'variations';
  byVariationId: Record<string, { module: PageModule; sourceFiles: Record<string, string> }>;
};

type ExerciseData = SingleExerciseData | VariationExerciseData;

const exerciseData: Record<string, ExerciseData> = {};

for (const [path, module] of Object.entries(pageModules)) {
  const parts = path.split('/');
  if (parts.length === 4) {
    // ./pages/{exerciseId}/{File}Page.tsx
    const exerciseId = parts[2];
    exerciseData[exerciseId] = { type: 'single', module, sourceFiles: {} };
  } else if (parts.length === 5) {
    // ./pages/{exerciseId}/{variationId}/{File}Page.tsx
    const exerciseId = parts[2];
    const variationId = parts[3];
    if (!exerciseData[exerciseId] || exerciseData[exerciseId].type !== 'variations') {
      exerciseData[exerciseId] = { type: 'variations', byVariationId: {} };
    }
    const entry = exerciseData[exerciseId] as VariationExerciseData;
    entry.byVariationId[variationId] = { module, sourceFiles: {} };
  }
}

for (const [path, content] of Object.entries(rawSources)) {
  const parts = path.split('/');
  if (parts.length === 4) {
    const exerciseId = parts[2];
    const filename = parts[3];
    const entry = exerciseData[exerciseId];
    if (entry?.type === 'single') {
      entry.sourceFiles[filename] = content;
    }
  } else if (parts.length === 5) {
    const exerciseId = parts[2];
    const variationId = parts[3];
    const filename = parts[4];
    const entry = exerciseData[exerciseId];
    if (entry?.type === 'variations') {
      const varEntry = entry.byVariationId[variationId];
      if (varEntry) {
        varEntry.sourceFiles[filename] = content;
      }
    }
  }
}

const pages: AppPage[] = exercises.flatMap((exercise, index): AppPage[] => {
  const data = exerciseData[exercise.id];

  if (!data) {
    console.warn(`[exercises] No *Page.tsx found for id "${exercise.id}". Check the folder name.`);
    return [];
  }

  const base = {
    id: exercise.id,
    label: exercise.label,
    number: index + 1,
    tags: exercise.tags,
  };

  if (data.type === 'single') {
    if (!data.module.default) {
      console.warn(`[exercises] No default export in Page.tsx for id "${exercise.id}".`);
      return [];
    }
    return [{ ...base, done: exercise.done, Component: data.module.default, sourceFiles: data.sourceFiles }];
  }

  // variation exercise — build AppVariation list from registry order
  if (!exercise.variations?.length) {
    console.warn(`[exercises] "${exercise.id}" has variation files but no variations in registry.`);
    return [];
  }

  const variations: AppVariation[] = exercise.variations.flatMap((v) => {
    const varData = data.byVariationId[v.id];
    if (!varData?.module.default) {
      console.warn(`[exercises] No *Page.tsx found for variation "${exercise.id}/${v.id}".`);
      return [];
    }
    return [{ id: v.id, label: v.label, done: v.done, Component: varData.module.default, sourceFiles: varData.sourceFiles }];
  });

  const done = variations.every((v) => v.done);
  return [{ ...base, done, variations }];
});

const DEFAULT_PAGE_ID_KEY = 'DEFAULT_PAGE_ID';

const resolveDefaultPageId = (fallbackPageId: string) => {
  const storedPageId = window.localStorage.getItem(DEFAULT_PAGE_ID_KEY);
  const hasStoredPage = pages.some((page) => {
    if (page.variations) {
      return page.variations.some((v) => `${page.id}/${v.id}` === storedPageId);
    }
    return page.id === storedPageId;
  });

  if (hasStoredPage && storedPageId) {
    return storedPageId;
  }

  return fallbackPageId;
};

function App() {
  const firstPage = pages[0];
  if (!firstPage) {
    return <p>No page component available.</p>;
  }

  const fallbackPageId = firstPage.variations
    ? `${firstPage.id}/${firstPage.variations[0].id}`
    : firstPage.id;

  const defaultPageId = resolveDefaultPageId(fallbackPageId);

  const handleSelectedPageChange = (pageId: string) => {
    window.localStorage.setItem(DEFAULT_PAGE_ID_KEY, pageId);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout pages={pages} onSelectedPageChange={handleSelectedPageChange} />}>
          <Route index element={<Navigate to={defaultPageId} replace />} />
          {pages.map((page) => {
            if (page.variations) {
              const firstVariationId = page.variations[0].id;
              return (
                <Route key={page.id} path={page.id}>
                  <Route index element={<Navigate to={firstVariationId} replace />} />
                  {page.variations.map((variation) => (
                    <Route
                      key={variation.id}
                      path={variation.id}
                      element={
                        <ExerciseViewer
                          exerciseId={`${page.id}/${variation.id}`}
                          component={variation.Component}
                          sourceFiles={variation.sourceFiles}
                        />
                      }
                    />
                  ))}
                </Route>
              );
            }
            return (
              <Route
                key={page.id}
                path={page.id}
                element={
                  <ExerciseViewer
                    exerciseId={page.id}
                    component={page.Component!}
                    sourceFiles={page.sourceFiles!}
                  />
                }
              />
            );
          })}
          <Route path="sandbox" element={<SandboxEditor />} />
          <Route path="*" element={<Navigate to={defaultPageId} replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
