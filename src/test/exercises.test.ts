/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent, renderHook, act } from "@testing-library/react";
import * as React from "react";

// Dynamically import only the custom student test files under src/pages
const testModules = import.meta.glob([
  "../pages/**/Component.test.ts",
  "../pages/**/Component.test.tsx",
  "../pages/**/utils.test.ts",
  "../pages/**/utils.test.tsx"
], { eager: true }) as Record<string, any>;

const componentModules = import.meta.glob("../pages/**/Component.tsx", { eager: true }) as Record<string, any>;

// Iterate through each discovered test file
for (const [testPath, testModule] of Object.entries(testModules)) {
  const runTests = testModule.default || testModule.runTests;
  if (typeof runTests === "function") {
    // Resolve the active exercise folder path
    const folderPath = testPath.substring(0, testPath.lastIndexOf("/"));
    
    // Pair with the corresponding Component.tsx in the same folder
    const componentPath = `${folderPath}/Component.tsx`;
    const componentModule = componentModules[componentPath];
    const Component = componentModule?.default;

    const exerciseLabel = folderPath.replace("../pages/", "");
    const testFilename = testPath.substring(testPath.lastIndexOf("/") + 1);

    describe(`Exercise: ${exerciseLabel} > ${testFilename}`, () => {
      runTests({
        describe,
        it,
        expect: buildExpect(expect),
        render: (element?: React.ReactElement) => {
          if (element) return render(element);
          if (Component) return render(React.createElement(Component));
          throw new Error("render() requires an element argument when no Component is available");
        },
        renderHook,
        fireEvent,
        act,
        beforeEach,
      });
    });
  }
}

function buildExpect(vitestExpect: any) {
  return (value: any) => {
    const matchers = (isNegated: boolean) => ({
      toBe: (expected: any) => {
        if (isNegated) vitestExpect(value).not.toBe(expected);
        else vitestExpect(value).toBe(expected);
      },
      toEqual: (expected: any) => {
        if (isNegated) vitestExpect(value).not.toEqual(expected);
        else vitestExpect(value).toEqual(expected);
      },
      toBeNull: () => {
        if (isNegated) vitestExpect(value).not.toBeNull();
        else vitestExpect(value).toBeNull();
      },
      toBeInTheDocument: () => {
        if (isNegated) vitestExpect(value).not.toBeInTheDocument();
        else vitestExpect(value).toBeInTheDocument();
      },
      toContain: (substring: string) => {
        const resolved =
          value instanceof Element ? value.textContent ?? "" : value;
        if (isNegated) vitestExpect(resolved).not.toContain(substring);
        else vitestExpect(resolved).toContain(substring);
      },
      toHaveLength: (len: number) => {
        if (isNegated) vitestExpect(value).not.toHaveLength(len);
        else vitestExpect(value).toHaveLength(len);
      },
    });
    return { ...matchers(false), not: matchers(true) };
  };
}
