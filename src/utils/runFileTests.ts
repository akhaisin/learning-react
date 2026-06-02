/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { transform } from "sucrase";
import * as vitestAdapter from "../test/vitest-adapter";
import { runTestSuite, type TestSuiteResult } from "./testRunner";

function isTestFile(filename: string): boolean {
  return (
    (filename.endsWith(".test.ts") || filename.endsWith(".test.tsx")) &&
    filename !== "vitest.test.ts" &&
    filename !== "vitest.test.tsx"
  );
}

/**
 * Build the suite tree for every test file in `files`, either executing the
 * tests ("run") or just enumerating them ("collect" — fast, no rendering).
 *
 * - `files` maps filename -> source code; only `*.test.ts(x)` entries are run.
 * - `component` is what `render()` (with no argument) mounts.
 * - `modules` resolves the test's relative imports (e.g. `./Component`); the
 *   vitest adapter and `react` are always provided.
 */
export function runFileTests(
  files: Record<string, string>,
  component: React.ComponentType,
  modules: Record<string, any>,
  mode: "run" | "collect"
): TestSuiteResult[] {
  const testKeys = Object.keys(files).filter(isTestFile);
  if (testKeys.length === 0) return [];

  const allResults: TestSuiteResult[] = [];
  const tempContainer = document.createElement("div");
  document.body.appendChild(tempContainer);

  try {
    for (const testKey of testKeys) {
      try {
        const testCode = files[testKey] || "";
        if (!testCode.trim()) {
          // An empty test file shouldn't add passing tests, but we should report that it's empty
          allResults.push({ name: `${testKey}`, cases: [], children: [] });
          continue;
        }

        let transpiled = transform(testCode, {
          transforms: ["typescript", "jsx", "imports"],
          production: true,
        }).code;
        // Strip native Vitest block to avoid top-level await and import.meta syntax errors in browser sandboxes
        transpiled = transpiled.replace(/if\s*\(\s*typeof\s+import\.meta\.env\s*!==\s*"undefined"\s*&&\s*import\.meta\.env\.VITEST\s*\)[\s\S]*$/, "");

        const results = runTestSuite(
          () => {
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
          },
          component,
          tempContainer,
          mode
        );
        // Distinguish test suites by prefixing them with the test file name
        allResults.push(
          ...results.map((suite) => ({ ...suite, name: `${testKey} > ${suite.name}` }))
        );
      } catch (err: any) {
        allResults.push({
          name: `${testKey} > Test Evaluation Error`,
          cases: [{ name: "Loading suite", passed: false, error: err.message || String(err) }],
          children: [],
        });
      }
    }
  } finally {
    document.body.removeChild(tempContainer);
  }

  return allResults;
}
