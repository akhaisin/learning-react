import { createContext, useContext } from "react";
import type { TestSuiteResult } from "../utils/testRunner";

export type TestPanelContextValue = {
  testResults: TestSuiteResult[];
  setTestResults: (results: TestSuiteResult[]) => void;
  isRunningTests: boolean;
  setIsRunningTests: (running: boolean) => void;
  hasTests: boolean;
  setHasTests: (hasTests: boolean) => void;
  expandTestPanel: () => void;
};

export const TestPanelContext = createContext<TestPanelContextValue | null>(null);

export function useTestPanel(): TestPanelContextValue {
  const ctx = useContext(TestPanelContext);
  if (!ctx) {
    throw new Error("useTestPanel must be used within a TestPanelContext provider");
  }
  return ctx;
}

export function countSuiteTests(suite: TestSuiteResult): { total: number; passed: number } {
  // Pending (enumerated-but-not-run) cases are excluded from the counts so the
  // badge reads "Run Tests" until tests are actually executed.
  let total = suite.cases.filter((c) => !c.pending).length;
  let passed = suite.cases.filter((c) => c.passed && !c.pending).length;
  for (const child of suite.children) {
    const c = countSuiteTests(child);
    total += c.total;
    passed += c.passed;
  }
  return { total, passed };
}
