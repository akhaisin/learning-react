import type { ComponentType } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout, { type AppPage } from './layout/AppLayout';

import './App.css';

type PageModule = {
  default?: ComponentType;
};

const pageModules = import.meta.glob<PageModule>('./pages/*/*.tsx', {
  eager: true,
});

const pages: AppPage[] = Object.entries(pageModules)
  .map(([path, module]) => {
    const segments = path.split('/');
    const folderName = segments[2];

    return {
      id: folderName,
      label: folderName.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase()),
      Component: module.default,
    };
  })
  .filter((page): page is { id: string; label: string; Component: ComponentType } => Boolean(page.Component))
  .sort((left, right) => left.label.localeCompare(right.label));

const DEFAULT_PAGE_ID_KEY = "DEFAULT_PAGE_ID";

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
            <Route key={page.id} path={page.id} element={<page.Component />} />
          ))}
          <Route path="*" element={<Navigate to={defaultPageId} replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
