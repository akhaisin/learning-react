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

function countSuiteTests(suite: TestSuiteResult): { total: number; passed: number } {
  let total = suite.cases.length;
  let passed = suite.cases.filter((c) => c.passed).length;
  for (const child of suite.children) {
    const c = countSuiteTests(child);
    total += c.total;
    passed += c.passed;
  }
  return { total, passed };
}

function SuiteBlock({ suite }: { suite: TestSuiteResult }) {
  const { total, passed } = countSuiteTests(suite);
  const allPassed = total > 0 && passed === total;
  const hasFailed = total > 0 && passed < total;

  return (
    <div className={styles.testSuite}>
      <div className={styles.suiteTitle}>
        <span className={styles.suiteName}>{suite.name}</span>
        {total > 0 && (
          <span
            className={[
              styles.suiteCount,
              allPassed ? styles.suiteCountPass : hasFailed ? styles.suiteCountFail : "",
            ].join(" ")}
          >
            {passed}/{total}
          </span>
        )}
      </div>
      {suite.cases.length > 0 && (
        <ul className={styles.caseList}>
          {suite.cases.map((tCase, cIdx) => (
            <li key={cIdx} className={styles.testCase}>
              <span
                className={[
                  styles.caseIcon,
                  tCase.passed ? styles.iconPass : styles.iconFail,
                ].join(" ")}
              >
                {tCase.passed ? "✔" : "✘"}
              </span>
              <div className={styles.caseDetails}>
                <span className={styles.caseName}>{tCase.name}</span>
                {tCase.error && <pre className={styles.caseError}>{tCase.error}</pre>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {suite.children.length > 0 && (
        <div className={styles.childSuites}>
          {suite.children.map((child, idx) => (
            <SuiteBlock key={idx} suite={child} />
          ))}
        </div>
      )}
    </div>
  );
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

  // Test states
  const [testResults, setTestResults] = useState<TestSuiteResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showTestDrawer, setShowTestDrawer] = useState(false);


  // Load custom boilerplate or original contents
  const loadCodeState = () => {
    const code: Record<string, string> = {};
    editorTabs.forEach(([filename, originalContent]) => {
      const key = `learning-react.v1.code.${exerciseId}.${filename}.raw`;
      const saved = localStorage.getItem(key);
      code[filename] = saved !== null ? saved : originalContent;
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
  }, [exerciseId]);

  const handleTabChange = (tab: string) => {
    tabMemory.current[exerciseId] = tab;
    setActiveTab(tab);
  };

  const handleCodeChange = (value: string) => {
    if (!activeTab) return;
    const nextFiles = { ...editedFiles, [activeTab]: value };
    setEditedFiles(nextFiles);

    // Persist immediately to localStorage
    const key = `learning-react.v1.code.${exerciseId}.${activeTab}.raw`;
    localStorage.setItem(key, value);

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

  // Main test execution function
  const executeTests = (comp: ComponentType, modules: Record<string, any>) => {
    const testKeys = Object.keys(sourceFiles).filter(
      (k) =>
        (k.endsWith(".test.ts") || k.endsWith(".test.tsx")) &&
        k !== "vitest.test.ts" &&
        k !== "vitest.test.tsx"
    );
    if (testKeys.length === 0) {
      setTestResults([]);
      return;
    }

    setIsRunningTests(true);
    const allResults: TestSuiteResult[] = [];
    try {
      const tempContainer = document.createElement("div");
      document.body.appendChild(tempContainer);

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
          }, comp, tempContainer);
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

      document.body.removeChild(tempContainer);
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
        window.dispatchEvent(new CustomEvent("learning-react:completion-changed"));
      } else {
        localStorage.removeItem(`learning-react.v1.completion.${exerciseId}`);
        window.dispatchEvent(new CustomEvent("learning-react:completion-changed"));
      }
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

  // Clear test results on compiler error
  useEffect(() => {
    if (compiledResult && compiledResult.error) {
      setTestResults([]);
      // If compile errors, completion might be broken
      localStorage.removeItem(`learning-react.v1.completion.${exerciseId}`);
      window.dispatchEvent(new CustomEvent("learning-react:completion-changed"));
    }
  }, [compiledResult, exerciseId]);

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
                  setShowTestDrawer((prev) => !prev);
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

          {/* Test results drawer */}
          {showTestDrawer && (
            <div className={styles.testDrawer}>
              <div className={styles.testDrawerHeader}>
                <h3>Test Results</h3>
                <div className={styles.drawerControls}>
                  <button
                    className={styles.drawerCloseBtn}
                    onClick={() => setShowTestDrawer(false)}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.testDrawerBody}>
                {testResults.length === 0 ? (
                  <div className={styles.noTestsText}>No tests executed yet.</div>
                ) : (
                  testResults.map((suite, sIdx) => (
                    <SuiteBlock key={sIdx} suite={suite} />
                  ))
                )}
              </div>
            </div>
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
