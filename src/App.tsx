import type { ComponentType } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout, { type AppPage } from './layout/AppLayout';
import ExerciseViewer from './layout/ExerciseViewer';
import SandboxEditor from './layout/SandboxEditor';
import { exercises } from './exercises';

type PageModule = {
  default?: ComponentType;
};

const pageModules = import.meta.glob<PageModule>('./pages/*/*Page.tsx', {
  eager: true,
});

const rawSources = import.meta.glob('./pages/*/*', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const moduleByFolderId = Object.fromEntries(
  Object.entries(pageModules).map(([path, module]) => {
    const folderId = path.split('/')[2];
    return [folderId, module];
  }),
);

const sourcesByFolderId: Record<string, Record<string, string>> = {};
for (const [path, content] of Object.entries(rawSources)) {
  const parts = path.split('/');
  const folderId = parts[2];
  const filename = parts[3];
  if (!sourcesByFolderId[folderId]) {
    sourcesByFolderId[folderId] = {};
  }
  sourcesByFolderId[folderId][filename] = content;
}

const pages: AppPage[] = exercises.flatMap((exercise, index) => {
  const module = moduleByFolderId[exercise.id];

  if (!module?.default) {
    console.warn(`[exercises] No *Page.tsx found for id "${exercise.id}". Check the folder name.`);
    return [];
  }

  return [{
    id: exercise.id,
    label: exercise.label,
    done: exercise.done,
    number: index + 1,
    tags: exercise.tags,
    Component: module.default,
    sourceFiles: sourcesByFolderId[exercise.id] ?? {},
  }];
});

const DEFAULT_PAGE_ID_KEY = 'DEFAULT_PAGE_ID';

const resolveDefaultPageId = (fallbackPageId: string) => {
  const storedPageId = window.localStorage.getItem(DEFAULT_PAGE_ID_KEY);
  const hasStoredPage = pages.some((page) => page.id === storedPageId);

  if (hasStoredPage && storedPageId) {
    return storedPageId;
  }

  return fallbackPageId;
};

function App() {
  const fallbackPageId = pages[0]?.id;

  if (!fallbackPageId) {
    return <p>No page component available.</p>;
  }

  const defaultPageId = resolveDefaultPageId(fallbackPageId);

  const handleSelectedPageChange = (pageId: string) => {
    window.localStorage.setItem(DEFAULT_PAGE_ID_KEY, pageId);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout pages={pages} onSelectedPageChange={handleSelectedPageChange} />}>
          <Route index element={<Navigate to={defaultPageId} replace />} />
          {pages.map((page) => (
            <Route
              key={page.id}
              path={page.id}
              element={<ExerciseViewer exerciseId={page.id} component={page.Component} sourceFiles={page.sourceFiles} />}
            />
          ))}
          <Route path="sandbox" element={<SandboxEditor />} />
          <Route path="*" element={<Navigate to={defaultPageId} replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
