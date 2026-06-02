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
import ErrorBoundary from '../ErrorBoundary';
import { useTestPanel, countSuiteTests } from '../../layout/testPanelContext';
import { runFileTests } from '../../utils/runFileTests';
import clearTsx from './Sandbox.clear.tsx?raw';
import clearCss from './Sandbox.module.clear.css?raw';
import clearTest from './Sandbox.test.clear.ts?raw';
import styles from './SandboxEditor.module.css';

const JS_EXT = [javascript({ jsx: true, typescript: true })];
const CSS_EXT = [css()];

const STYLE_TAG_ID = 'sandbox-live-css';

// The sandbox's test file is always present, and its component is the one
// `render()` mounts inside the suite.
const TEST_FILENAME = 'Sandbox.test.ts';
const noopComponent: React.ComponentType = () => null;

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

const DEFAULT_TEST = `import { describe, it, expect, render } from '../../test/vitest-adapter'

describe('Sandbox', () => {
  it('renders without crashing', () => {
    const { container } = render()
    expect(container).toBeInTheDocument()
  })
})
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

type Tab = 'tsx' | 'css' | 'test';

const STORAGE_TSX = 'sandbox-tsx';
const STORAGE_CSS = 'sandbox-css';
const STORAGE_TEST = 'sandbox-test';

function SandboxEditor() {
  const [tsxCode, setTsxCode] = useState(() => localStorage.getItem(STORAGE_TSX) ?? DEFAULT_TSX);
  const [cssCode, setCssCode] = useState(() => localStorage.getItem(STORAGE_CSS) ?? DEFAULT_CSS);
  const [testCode, setTestCode] = useState(() => localStorage.getItem(STORAGE_TEST) ?? DEFAULT_TEST);
  const [activeTab, setActiveTab] = useState<Tab>('tsx');
  const [result, setResult] = useState<CompileResult>(() => compile(DEFAULT_TSX));
  const [renderKey, setRenderKey] = useState(0);

  const {
    testResults,
    setTestResults,
    isRunningTests,
    setIsRunningTests,
    setHasTests,
    expandTestPanel,
  } = useTestPanel();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_TSX, tsxCode);
      const next = compile(tsxCode);
      setResult(next);
      if (next.ok) setRenderKey(k => k + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [tsxCode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_CSS, cssCode);
    }, 300);
    return () => clearTimeout(timer);
  }, [cssCode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_TEST, testCode);
    }, 300);
    return () => clearTimeout(timer);
  }, [testCode]);

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

  // The sandbox always offers a test file, so the bottom Test Results panel is
  // available here (mirrors how ExerciseViewer reports `hasTests`).
  useEffect(() => {
    setHasTests(true);
    return () => {
      setHasTests(false);
      setTestResults([]);
    };
  }, [setHasTests, setTestResults]);

  // Enumerate (without running) the tests on each edit so the panel always
  // shows the list; this also resets any prior run results, matching exercises.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setTestResults(runFileTests({ [TEST_FILENAME]: testCode }, noopComponent, {}, 'collect'));
      } catch {
        setTestResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [tsxCode, testCode, setTestResults]);

  const runTests = () => {
    const compiled = compile(tsxCode);
    if (!compiled.ok) {
      setTestResults([
        {
          name: 'Compilation Error',
          cases: [{ name: 'Compiling Sandbox.tsx', passed: false, error: compiled.error }],
          children: [],
        },
      ]);
      return;
    }
    setIsRunningTests(true);
    try {
      setTestResults(runFileTests({ [TEST_FILENAME]: testCode }, compiled.Component, {}, 'run'));
    } catch (e) {
      setTestResults([
        {
          name: 'Global Test Execution Error',
          cases: [{ name: 'Running suites', passed: false, error: (e as Error).message }],
          children: [],
        },
      ]);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleReset = () => {
    setTsxCode(clearTsx);
    setCssCode(clearCss);
    setTestCode(clearTest);
  };

  const { total: totalTests, passed: passedTests } = testResults.reduce(
    (acc, s) => {
      const c = countSuiteTests(s);
      return { total: acc.total + c.total, passed: acc.passed + c.passed };
    },
    { total: 0, passed: 0 }
  );
  const testBadgeText = totalTests > 0 ? `${passedTests}/${totalTests} Passed` : 'Run Tests';
  const allTestsPassed = totalTests > 0 && passedTests === totalTests;

  const LiveComponent = result.ok ? result.Component : null;

  const tabs: { id: Tab; label: string; tourId: string }[] = [
    { id: 'tsx', label: 'Sandbox.tsx', tourId: 'tour-sandbox-tab-tsx' },
    { id: 'css', label: 'Sandbox.module.css', tourId: 'tour-sandbox-tab-css' },
    { id: 'test', label: 'Sandbox.test.ts', tourId: 'tour-sandbox-tab-test' },
  ];

  const editorValue = activeTab === 'tsx' ? tsxCode : activeTab === 'css' ? cssCode : testCode;
  const onEditorChange =
    activeTab === 'tsx' ? setTsxCode : activeTab === 'css' ? setCssCode : setTestCode;
  const editorExtensions = activeTab === 'css' ? CSS_EXT : JS_EXT;

  return (
    <PanelGroup orientation="horizontal" className={styles.editor}>
      <Panel defaultSize={50} minSize={25} className={styles.editorPanel}>
        <div className={styles.tabBar}>
          <div className={styles.tabsList}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={tab.tourId}
                className={[styles.tab, activeTab === tab.id ? styles.tabActive : ''].join(' ')}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.actionBar}>
            <button
              className={styles.actionBtn}
              onClick={handleReset}
              title="Reset all files to the starter template"
            >
              Reset
            </button>
            <button
              className={[
                styles.testBadgeBtn,
                allTestsPassed ? styles.testPassed : totalTests > 0 ? styles.testFailed : '',
              ].join(' ')}
              onClick={() => {
                runTests();
                expandTestPanel();
              }}
              disabled={isRunningTests}
            >
              {isRunningTests ? 'Testing...' : testBadgeText}
            </button>
          </div>
        </div>
        <div className={styles.editorContent}>
          <CodeMirror
            value={editorValue}
            onChange={onEditorChange}
            extensions={editorExtensions}
            theme={oneDark}
            height="100%"
            style={{ height: '100%' }}
          />
        </div>
      </Panel>

      <PanelResizeHandle className={styles.resizeHandle} />

      <Panel id="tour-sandbox-preview" defaultSize={50} minSize={25} className={styles.previewPanel}>
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
