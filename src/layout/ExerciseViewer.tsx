/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { transform } from "sucrase";
import { useDebounce } from "../hooks/useDebounce";
import * as vitestAdapter from "../test/vitest-adapter";
import { compileAndRun, type CompilationResult } from "../utils/compiler";
import { runTestSuite, type TestSuiteResult } from "../utils/testRunner";
import { useTestPanel, countSuiteTests } from "./testPanelContext";
import styles from "./ExerciseViewer.module.css";

type Props = {
  exerciseId: string;
  component: ComponentType;
  sourceFiles: Record<string, string>;
};

const JS_EXT = javascript({ jsx: true, typescript: true });
const CSS_EXT = css();

function getExtensions(filename: string) {
  if (filename.endsWith(".css")) return [CSS_EXT];
  return [JS_EXT];
}

function sortFiles(files: [string, string][]): [string, string][] {
  const fileRank: Record<string, number> = {
    "Page.tsx": 0,
    "Component.tsx": 1,
    "utils.ts": 2,
    "Component.module.css": 3,
  };

  return [...files].sort(([a], [b]) => {
    const rankA = fileRank[a] ?? 99;
    const rankB = fileRank[b] ?? 99;
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.localeCompare(b);
  });
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: (error: Error) => React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

function ExerciseViewer({ exerciseId, component: OriginalComponent, sourceFiles }: Props) {
  const tabMemory = useRef<Record<string, string>>({});
  const sortedFiles = sortFiles(Object.entries(sourceFiles));

  const getCodeStorageKeys = (filename: string) => ({
    raw: `learning-react.v1.code.${exerciseId}.${filename}.raw`,
    base: `learning-react.v1.code.${exerciseId}.${filename}.base`,
  });

  // Filter out companion files (.clear.tsx) and vitest runner files from being tabs, but keep editable test files!
  const editorTabs = sortedFiles.filter(
    ([filename]) =>
      !filename.includes(".clear.") &&
      filename !== "vitest.test.ts" &&
      filename !== "vitest.test.tsx"
  );

  const [activeTab, setActiveTab] = useState("");
  const [editedFiles, setEditedFiles] = useState<Record<string, string>>({});
  const [compiledResult, setCompiledResult] = useState<CompilationResult | null>(null);

  // Test state lives in AppLayout's shared bottom panel (also used by Sandbox)
  const {
    testResults,
    setTestResults,
    isRunningTests,
    setIsRunningTests,
    setHasTests,
    expandTestPanel,
  } = useTestPanel();

  // Load custom boilerplate or original contents
  const loadCodeState = () => {
    const code: Record<string, string> = {};
    editorTabs.forEach(([filename, originalContent]) => {
      const keys = getCodeStorageKeys(filename);
      const saved = localStorage.getItem(keys.raw);
      const savedBase = localStorage.getItem(keys.base);

      if (saved !== null && savedBase === originalContent) {
        code[filename] = saved;
        return;
      }

      if (saved !== null) {
        localStorage.removeItem(keys.raw);
        localStorage.removeItem(keys.base);
      }

      code[filename] = originalContent;
    });
    return code;
  };

  // Switch tabs and load cached state on exerciseId change
  useEffect(() => {
    const initialFiles = loadCodeState();
    setEditedFiles(initialFiles);

    const rememberedTab = tabMemory.current[exerciseId];
    const fallbackTab = editorTabs[0]?.[0] ?? "";
    const nextTab = rememberedTab && sourceFiles[rememberedTab] ? rememberedTab : fallbackTab;
    setActiveTab(nextTab);

    // Initial compile
    const res = compileAndRun(initialFiles);
    setCompiledResult(res);

    // Clear test results
    setTestResults([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId, sourceFiles]);

  const handleTabChange = (tab: string) => {
    tabMemory.current[exerciseId] = tab;
    setActiveTab(tab);
  };

  const handleCodeChange = (value: string) => {
    if (!activeTab) return;
    const nextFiles = { ...editedFiles, [activeTab]: value };
    setEditedFiles(nextFiles);

    // Persist immediately to localStorage
    const keys = getCodeStorageKeys(activeTab);
    localStorage.setItem(keys.raw, value);
    localStorage.setItem(keys.base, sourceFiles[activeTab] || "");

    // Reset tests status and unmark exercise as completed on any code modification
    setTestResults([]);
    localStorage.removeItem(`learning-react.v1.completion.${exerciseId}`);
    window.dispatchEvent(new CustomEvent("learning-react:completion-changed"));
  };

  // Debounced compilation
  const debouncedEditedFiles = useDebounce(editedFiles, 300);

  useEffect(() => {
    if (Object.keys(debouncedEditedFiles).length === 0) return;
    const res = compileAndRun(debouncedEditedFiles);
    setCompiledResult(res);
  }, [debouncedEditedFiles]);

  // Check if test file exists (excluding hidden vitest runner entrypoints)
  const hasTests = Object.keys(sourceFiles).some(
    (k) =>
      (k.endsWith(".test.ts") || k.endsWith(".test.tsx")) &&
      k !== "vitest.test.ts" &&
      k !== "vitest.test.tsx"
  );

  // Tell AppLayout whether to mount the bottom Test Results panel for this view
  useEffect(() => {
    setHasTests(hasTests);
    return () => setHasTests(false);
  }, [hasTests, setHasTests]);

  // Build the suite tree for every test file, either executing the tests
  // ("run") or just enumerating them ("collect" — fast, no rendering).
  const buildTestResults = (
    comp: ComponentType,
    modules: Record<string, any>,
    mode: "run" | "collect"
  ): TestSuiteResult[] => {
    const testKeys = Object.keys(sourceFiles).filter(
      (k) =>
        (k.endsWith(".test.ts") || k.endsWith(".test.tsx")) &&
        k !== "vitest.test.ts" &&
        k !== "vitest.test.tsx"
    );
    if (testKeys.length === 0) return [];

    const allResults: TestSuiteResult[] = [];
    const tempContainer = document.createElement("div");
    document.body.appendChild(tempContainer);

    try {
      for (const testKey of testKeys) {
        try {
          const testCode = editedFiles[testKey] || sourceFiles[testKey] || "";
          if (!testCode.trim()) {
            // An empty test file shouldn't add passing tests, but we should report that it's empty
            allResults.push({
              name: `${testKey}`,
              cases: [],
              children: [],
            });
            continue;
          }

          let transpiled = transform(testCode, {
            transforms: ["typescript", "jsx", "imports"],
            production: true,
          }).code;
          // Strip native Vitest block to avoid top-level await and import.meta syntax errors in browser sandboxes
          transpiled = transpiled.replace(/if\s*\(\s*typeof\s+import\.meta\.env\s*!==\s*"undefined"\s*&&\s*import\.meta\.env\.VITEST\s*\)[\s\S]*$/, "");

          const results = runTestSuite(() => {
            const testModule = { exports: {} as any };
            const localRequire = (reqPath: string) => {
              const normalized = reqPath.replace(/^((\.\.\/)|(\.\/))+/, "");

              if (/test\/vitest-adapter(?:\.[a-z]+)?$/i.test(normalized)) {
                return vitestAdapter;
              }

              const matchedKey = Object.keys(modules).find(
                (k) => k.replace(/\.[a-zA-Z0-9]+$/, "").toLowerCase() === normalized.toLowerCase()
              );
              if (matchedKey) {
                return modules[matchedKey];
              }

              if (reqPath === "react") return React;
              throw new Error(`Cannot require "${reqPath}" inside test suite`);
            };

            const runFn = new Function("exports", "require", "module", "React", transpiled);
            runFn(testModule.exports, localRequire, testModule, React);
          }, comp, tempContainer, mode);
          // Distinguish test suites by prefixing them with the test file name
          allResults.push(...results.map(suite => ({
            ...suite,
            name: `${testKey} > ${suite.name}`
          })));
        } catch (err: any) {
          allResults.push({
            name: `${testKey} > Test Evaluation Error`,
            cases: [
              {
                name: "Loading suite",
                passed: false,
                error: err.message || String(err),
              },
            ],
            children: [],
          });
        }
      }
    } finally {
      document.body.removeChild(tempContainer);
    }

    return allResults;
  };

  // Enumerate tests (without running) so the panel always shows the list
  const collectTests = (comp: ComponentType, modules: Record<string, any>) => {
    try {
      setTestResults(buildTestResults(comp, modules, "collect"));
    } catch (err: any) {
      setTestResults([
        {
          name: "Test Enumeration Error",
          cases: [{ name: "Collecting tests", passed: false, error: err.message || String(err) }],
          children: [],
        },
      ]);
    }
  };

  // Run tests for real and record completion status
  const executeTests = (comp: ComponentType, modules: Record<string, any>) => {
    setIsRunningTests(true);
    try {
      const allResults = buildTestResults(comp, modules, "run");
      setTestResults(allResults);

      const { total: totalTests, passed: passedAll } = allResults.reduce(
        (acc, s) => {
          const c = countSuiteTests(s);
          return { total: acc.total + c.total, passed: acc.passed + c.passed };
        },
        { total: 0, passed: 0 }
      );
      const allPassed = totalTests > 0 && passedAll === totalTests;

      if (allPassed) {
        localStorage.setItem(`learning-react.v1.completion.${exerciseId}`, "true");
      } else {
        localStorage.removeItem(`learning-react.v1.completion.${exerciseId}`);
      }
      window.dispatchEvent(new CustomEvent("learning-react:completion-changed"));
    } catch (err: any) {
      setTestResults([
        {
          name: "Global Test Execution Error",
          cases: [
            {
              name: "Running suites",
              passed: false,
              error: err.message || String(err),
            },
          ],
          children: [],
        },
      ]);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Keep the panel list in sync with the compiled result: enumerate the tests
  // on each successful compile, or clear them on a compiler error.
  useEffect(() => {
    if (!hasTests) return;
    if (compiledResult?.error) {
      setTestResults([]);
      localStorage.removeItem(`learning-react.v1.completion.${exerciseId}`);
      window.dispatchEvent(new CustomEvent("learning-react:completion-changed"));
      return;
    }
    if (compiledResult?.component) {
      collectTests(compiledResult.component, compiledResult.modules);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compiledResult, exerciseId, hasTests]);

  // Reset to original solution code
  const handleReset = () => {
    if (!activeTab) return;
    const original = sourceFiles[activeTab] || "";
    handleCodeChange(original);

    // Clear user cleared flag
    localStorage.removeItem(`learning-react.v1.cleared.${exerciseId}`);
    localStorage.removeItem(`learning-react.v1.completion.${exerciseId}`);
    window.dispatchEvent(new CustomEvent("learning-react:completion-changed"));
  };

  // Clear exercise code to load companion boilerplate
  const handleClear = () => {
    if (!activeTab) return;

    // Search for companion *.clear.tsx
    const clearKey = activeTab.replace(/\.(tsx|ts|css)$/, ".clear.$1");
    if (!sourceFiles[clearKey]) return;

    const clearContent = sourceFiles[clearKey];
    handleCodeChange(clearContent);

    // Mark exercise as "cleared" to track self-attempt completion status
    localStorage.setItem(`learning-react.v1.cleared.${exerciseId}`, "true");
    localStorage.removeItem(`learning-react.v1.completion.${exerciseId}`);
    window.dispatchEvent(new CustomEvent("learning-react:completion-changed"));
  };

  // Summarize test results for badge
  const { total: totalTests, passed: passedTests } = testResults.reduce(
    (acc, s) => {
      const c = countSuiteTests(s);
      return { total: acc.total + c.total, passed: acc.passed + c.passed };
    },
    { total: 0, passed: 0 }
  );
  const testBadgeText =
    totalTests > 0 ? `${passedTests}/${totalTests} Passed` : "Run Tests";
  const allTestsPassed = totalTests > 0 && passedTests === totalTests;

  const LiveComponent = compiledResult?.component;
  const clearKey = activeTab ? activeTab.replace(/\.(tsx|ts|css)$/, ".clear.$1") : "";
  const hasClearCompanion = !!(activeTab && sourceFiles[clearKey]);

  return (
    <PanelGroup orientation="horizontal" className={styles.viewer}>
      <Panel defaultSize={48} minSize={25} className={styles.sourcePanel}>
        <div id="tour-source-tabs" className={styles.tabBar} role="tablist">
          <div className={styles.tabsList}>
            {editorTabs.map(([filename]) => (
              <button
                key={filename}
                role="tab"
                aria-selected={activeTab === filename}
                className={[styles.tab, activeTab === filename ? styles.tabActive : ""].join(" ")}
                onClick={() => handleTabChange(filename)}
              >
                {filename}
              </button>
            ))}
          </div>

          <div className={styles.actionBar}>
            {activeTab && (
              <>
                <button
                  className={styles.actionBtn}
                  onClick={handleReset}
                  title="Reset file back to original solution code"
                >
                  Reset
                </button>
                {hasClearCompanion && (
                  <button
                    className={styles.actionBtn}
                    onClick={handleClear}
                    title="Clear implementation to start fresh boilerplate"
                  >
                    Clear
                  </button>
                )}
              </>
            )}

            {hasTests && (
              <button
                className={[
                  styles.testBadgeBtn,
                  allTestsPassed ? styles.testPassed : totalTests > 0 ? styles.testFailed : "",
                ].join(" ")}
                onClick={() => {
                  if (compiledResult?.component) {
                    executeTests(compiledResult.component, compiledResult.modules);
                  }
                  expandTestPanel();
                }}
                disabled={isRunningTests}
              >
                {isRunningTests ? "Testing..." : testBadgeText}
              </button>
            )}
          </div>
        </div>

        <div className={styles.content}>
          {activeTab ? (
            <CodeMirror
              value={editedFiles[activeTab] ?? ""}
              extensions={getExtensions(activeTab)}
              theme={oneDark}
              height="100%"
              style={{ height: "100%" }}
              onChange={handleCodeChange}
            />
          ) : (
            <div className={styles.emptyState}>No source files available.</div>
          )}
        </div>
      </Panel>

      <PanelResizeHandle className={styles.resizeHandle} />

      <Panel id="tour-preview-panel" defaultSize={52} minSize={25} className={styles.previewPanel}>
        <div className={styles.preview}>
          {compiledResult?.error ? (
            <div className={styles.errorContainer}>
              <h3>Compilation Error</h3>
              <pre>{compiledResult.error.message}</pre>
            </div>
          ) : (
            <ErrorBoundary
              key={`${exerciseId}-${Object.values(editedFiles).join("").length}`}
              fallback={(error) => (
                <div className={styles.errorContainer}>
                  <h3>Runtime Error</h3>
                  <pre>{error.message || String(error)}</pre>
                </div>
              )}
            >
              {LiveComponent ? <LiveComponent /> : <OriginalComponent />}
            </ErrorBoundary>
          )}
        </div>
      </Panel>
    </PanelGroup>
  );
}

export default ExerciseViewer;
