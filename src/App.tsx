import { useState } from 'react';
import type { ComponentType } from 'react';

import './App.css';

type FeatureModule = {
  default?: ComponentType
}

const featureModules = import.meta.glob<FeatureModule>('./features/*/*.tsx', {
  eager: true,
});

const features = Object.entries(featureModules)
  .map(([path, module]) => {
    const segments = path.split('/');
    const folderName = segments[2];

    return {
      id: folderName,
      label: folderName.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase()),
      Component: module.default,
    };
  })
  .filter((feature): feature is { id: string; label: string; Component: ComponentType } => Boolean(feature.Component))
  .sort((left, right) => left.label.localeCompare(right.label));

const STORAGE_KEY = 'selectedFeatureId';

function App() {
  const [selectedFeatureId, setSelectedFeatureId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? features[0]?.id ?? '';
  });

  const handleSelectFeature = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setSelectedFeatureId(id);
  };

  const activeFeature =
    features.find((feature) => feature.id === selectedFeatureId) ?? features[0];
  const ActiveComponent = activeFeature?.Component;

  return (
    <main className="app-shell">
      <section className="app-panel app-panel-left">
        <header className="panel-header">
          <p className="panel-eyebrow">Examples</p>
          <h1>Components</h1>
        </header>

        <div className="feature-list" role="list" aria-label="Available feature components">
          {features.map((feature) => (
            <button
              key={feature.id}
              type="button"
              className={feature.id === activeFeature?.id ? 'feature-item is-active' : 'feature-item'}
              onClick={() => handleSelectFeature(feature.id)}
            >
              {feature.label}
            </button>
          ))}
        </div>
      </section>

      <section className="app-panel app-panel-right">
        <header className="panel-header">
          <p className="panel-eyebrow">Preview</p>
          <h2>{activeFeature?.label ?? 'No component selected'}</h2>
        </header>

        <div className="feature-preview">
          {ActiveComponent ? <ActiveComponent /> : <p>No feature component available.</p>}
        </div>
      </section>
    </main>
  );
}

export default App;
