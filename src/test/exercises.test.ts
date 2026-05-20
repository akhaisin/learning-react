/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent, renderHook, act, screen } from "@testing-library/react";
import * as React from "react";
import {
  clearVitestAdapterContext,
  setVitestAdapterContext,
  type VitestAdapterHelpers,
} from "./vitest-adapter";

// Dynamically import only the custom student test files under src/pages
const testModules = import.meta.glob([
  "../pages/**/Component.test.ts",
  "../pages/**/Component.test.tsx",
  "../pages/**/utils.test.ts",
  "../pages/**/utils.test.tsx"
]) as Record<string, () => Promise<any>>;

const componentModules = import.meta.glob("../pages/**/Component.tsx", { eager: true }) as Record<string, any>;

for (const [testPath, loadTestModule] of Object.entries(testModules)) {
  const folderPath = testPath.substring(0, testPath.lastIndexOf("/"));
  const displayTestPath = testPath.replace(/^\.\.\//, "src/");

  // Pair with the corresponding Component.tsx in the same folder
  const componentPath = `${folderPath}/Component.tsx`;
  const componentModule = componentModules[componentPath];
  const Component = componentModule?.default;

  const helpers: VitestAdapterHelpers = {
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
    screen,
    act,
    beforeEach,
    nextDescribePrefix: displayTestPath,
  };

  setVitestAdapterContext(helpers);
  try {
    await loadTestModule();
  } finally {
    clearVitestAdapterContext();
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
