import * as React from 'react';
import {
  useState, useEffect, useRef, useCallback,
  useMemo, useReducer, useContext, createContext,
} from 'react';
import { transform } from 'sucrase';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import ErrorBoundary from '../components/ErrorBoundary';
import styles from './SandboxEditor.module.css';

const JS_EXT = [javascript({ jsx: true, typescript: true })];
const CSS_EXT = [css()];

const STYLE_TAG_ID = 'sandbox-live-css';

const DEFAULT_TSX = `import styles from './Sandbox.module.css'

function Sandbox() {
  return (
    <div className={styles.container}>
      <h2>Hello, Sandbox!</h2>
      <p>Edit me and see changes live.</p>
    </div>
  )
}

export default Sandbox
`;

const DEFAULT_CSS = `.container {
  padding: 2rem;
  text-align: center;
}
`;

type CompileResult =
  | { ok: true; Component: React.ComponentType }
  | { ok: false; error: string };

function compile(tsxCode: string): CompileResult {
  try {
    const stylesProxy = new Proxy({}, { get: (_, key) => String(key) });
    const stripped = tsxCode
      .replace(/^\s*import\s+\w+\s+from\s+['"][^'"]*\.module\.css['"]\s*;?\s*$/gm, '')
      .replace(/^\s*import\s+.*$/gm, '')
      .trim();
    const { code: transpiled } = transform(stripped, { transforms: ['typescript', 'jsx'] });
    const executable = transpiled.replace(/export\s+default\s+/, 'return ');
    const fn = new Function(
      'React', 'useState', 'useEffect', 'useRef', 'useCallback',
      'useMemo', 'useReducer', 'useContext', 'createContext', 'styles',
      executable,
    );
    const Component = fn(
      React, useState, useEffect, useRef, useCallback,
      useMemo, useReducer, useContext, createContext, stylesProxy,
    ) as React.ComponentType;
    return { ok: true, Component };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

type Tab = 'tsx' | 'css';

const STORAGE_TSX = 'sandbox-tsx';
const STORAGE_CSS = 'sandbox-css';

function SandboxEditor() {
  const [tsxCode, setTsxCode] = useState(() => localStorage.getItem(STORAGE_TSX) ?? DEFAULT_TSX);
  const [cssCode, setCssCode] = useState(() => localStorage.getItem(STORAGE_CSS) ?? DEFAULT_CSS);
  const [activeTab, setActiveTab] = useState<Tab>('tsx');
  const [result, setResult] = useState<CompileResult>(() => compile(DEFAULT_TSX));
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_TSX, tsxCode);
    const timer = setTimeout(() => {
      const next = compile(tsxCode);
      setResult(next);
      if (next.ok) setRenderKey(k => k + 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [tsxCode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CSS, cssCode);
  }, [cssCode]);

  useEffect(() => {
    let el = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_TAG_ID;
      document.head.appendChild(el);
    }
    el.textContent = cssCode;
    return () => { el!.textContent = ''; };
  }, [cssCode]);

  const LiveComponent = result.ok ? result.Component : null;

  return (
    <PanelGroup orientation="horizontal" className={styles.editor}>
      <Panel defaultSize={50} minSize={25} className={styles.editorPanel}>
        <div className={styles.tabBar}>
          <button
            className={[styles.tab, activeTab === 'tsx' ? styles.tabActive : ''].join(' ')}
            onClick={() => setActiveTab('tsx')}
          >
            Sandbox.tsx
          </button>
          <button
            className={[styles.tab, activeTab === 'css' ? styles.tabActive : ''].join(' ')}
            onClick={() => setActiveTab('css')}
          >
            Sandbox.module.css
          </button>
        </div>
        <div className={styles.editorContent}>
          {activeTab === 'tsx' ? (
            <CodeMirror
              value={tsxCode}
              onChange={setTsxCode}
              extensions={JS_EXT}
              theme={oneDark}
              height="100%"
              style={{ height: '100%' }}
            />
          ) : (
            <CodeMirror
              value={cssCode}
              onChange={setCssCode}
              extensions={CSS_EXT}
              theme={oneDark}
              height="100%"
              style={{ height: '100%' }}
            />
          )}
        </div>
      </Panel>

      <PanelResizeHandle className={styles.resizeHandle} />

      <Panel defaultSize={50} minSize={25} className={styles.previewPanel}>
        {!result.ok && (
          <pre className={styles.error}>{result.error}</pre>
        )}
        {LiveComponent && (
          <ErrorBoundary
            key={renderKey}
            fallback={(e) => <pre className={styles.error}>{e.message}</pre>}
          >
            <LiveComponent />
          </ErrorBoundary>
        )}
      </Panel>
    </PanelGroup>
  );
}

export default SandboxEditor;
