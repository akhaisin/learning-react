/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  clearVitestAdapterContext,
  setVitestAdapterContext,
  type VitestAdapterHelpers,
} from "../test/vitest-adapter";

export interface TestCaseResult {
  name: string;
  passed: boolean;
  error?: string;
}

export interface TestSuiteResult {
  name: string;
  cases: TestCaseResult[];
  children: TestSuiteResult[];
}

let testRoot: any = null;

function findByTextContent(root: HTMLElement, text: string): HTMLElement | null {
  const normalizedSearch = text.toLowerCase().trim();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode() as HTMLElement | null;
  let bestMatch: HTMLElement | null = null;

  while (node) {
    const nodeText = node.textContent?.toLowerCase().trim() || "";
    if (nodeText.includes(normalizedSearch)) {
      let childMatches = false;
      for (let i = 0; i < node.children.length; i++) {
        const childText = node.children[i].textContent?.toLowerCase().trim() || "";
        if (childText.includes(normalizedSearch)) {
          childMatches = true;
          break;
        }
      }
      if (!childMatches) {
        bestMatch = node;
      }
    }
    node = walker.nextNode() as HTMLElement | null;
  }
  return bestMatch;
}

const fireEvent = {
  click: (element: HTMLElement) => {
    flushSync(() => {
      element.click();
    });
  },
  change: (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    eventInit: { target: { value: string } }
  ) => {
    flushSync(() => {
      element.value = eventInit.target.value;
      const changeEvent = new Event("change", { bubbles: true });
      element.dispatchEvent(changeEvent);
      const inputEvent = new Event("input", { bubbles: true });
      element.dispatchEvent(inputEvent);
    });
  },
  keyDown: (element: HTMLElement, init: KeyboardEventInit) => {
    flushSync(() => {
      const event = new KeyboardEvent("keydown", { bubbles: true, ...init });
      element.dispatchEvent(event);
    });
  },
};

const screen = {
  getByText: (text: string) => {
    const testDiv = document.getElementById("test-sandbox-root");
    if (!testDiv) throw new Error("No active render container found");
    const el = findByTextContent(testDiv, text);
    if (!el) throw new Error(`Element with text "${text}" not found`);
    return el;
  },
  queryByText: (text: string) => {
    const testDiv = document.getElementById("test-sandbox-root");
    if (!testDiv) return null;
    return findByTextContent(testDiv, text);
  },
  getByPlaceholderText: (placeholder: string) => {
    const testDiv = document.getElementById("test-sandbox-root");
    if (!testDiv) throw new Error("No active render container found");
    const el = testDiv.querySelector(`[placeholder="${placeholder}"]`) as HTMLElement;
    if (!el) throw new Error(`Element with placeholder "${placeholder}" not found`);
    return el;
  },
  getByTestId: (testId: string) => {
    const testDiv = document.getElementById("test-sandbox-root");
    if (!testDiv) throw new Error("No active render container found");
    const el = testDiv.querySelector(`[data-testid="${testId}"]`) as HTMLElement;
    if (!el) throw new Error(`Element with data-testid "${testId}" not found`);
    return el;
  },
};

function browserExpect(value: any) {
  const matchers = (isNegated: boolean) => ({
    toBe: (expected: any) => {
      const condition = value === expected;
      if (isNegated ? condition : !condition) {
        throw new Error(
          isNegated
            ? `Expected ${value} not to be ${expected}`
            : `Expected ${value} to be ${expected}`
        );
      }
    },
    toEqual: (expected: any) => {
      const condition = JSON.stringify(value) === JSON.stringify(expected);
      if (isNegated ? condition : !condition) {
        throw new Error(
          isNegated
            ? `Expected values not to deeply equal`
            : `Expected ${JSON.stringify(value)} to deeply equal ${JSON.stringify(expected)}`
        );
      }
    },
    toBeNull: () => {
      const condition = value === null;
      if (isNegated ? condition : !condition) {
        throw new Error(
          isNegated ? `Expected value not to be null` : `Expected value to be null`
        );
      }
    },
    toBeInTheDocument: () => {
      const condition =
        value && value instanceof Node && document.body.contains(value);
      if (isNegated ? condition : !condition) {
        throw new Error(
          isNegated
            ? `Expected element not to be in document`
            : `Expected element to be in document`
        );
      }
    },
    toContain: (substring: string) => {
      const condition =
        (typeof value === "string" && value.includes(substring)) ||
        (Array.isArray(value) && value.includes(substring)) ||
        (value && typeof value.textContent === "string" && value.textContent.includes(substring));
      if (isNegated ? condition : !condition) {
        throw new Error(
          isNegated
            ? `Expected value not to contain "${substring}"`
            : `Expected value to contain "${substring}"`
        );
      }
    },
    toHaveLength: (len: number) => {
      const condition = value && typeof value.length === "number" && value.length === len;
      if (isNegated ? condition : !condition) {
        throw new Error(
          isNegated
            ? `Expected value not to have length ${len}`
            : `Expected value to have length ${len}`
        );
      }
    },
  });

  return {
    ...matchers(false),
    not: matchers(true),
  };
}

let activeSuite: TestSuiteResult | null = null;
const suites: TestSuiteResult[] = [];

export function runTestSuite(
  registerTests: () => void,
  component: React.ComponentType,
  container: HTMLElement
): TestSuiteResult[] {
  suites.length = 0;
  activeSuite = null;

  // Each renderHook() call appends its own div; tracked here for cleanup between tests.
  const hookRoots: any[] = [];

  // Stack mirrors describe nesting: each level holds its own beforeEach callbacks.
  // The root scope [0] catches beforeEach calls made before any describe block.
  const beforeEachStack: (() => void)[][] = [[]];

  const browserDescribe = (name: string, fn: () => void) => {
    const parentSuite = activeSuite;
    const currentSuite: TestSuiteResult = { name, cases: [], children: [] };

    if (parentSuite) {
      parentSuite.children.push(currentSuite);
    } else {
      suites.push(currentSuite);
    }
    activeSuite = currentSuite;

    beforeEachStack.push([]);
    try {
      fn();
    } catch (err: any) {
      currentSuite.cases.push({
        name: "Suite Setup",
        passed: false,
        error: err.message || String(err),
      });
    } finally {
      beforeEachStack.pop();
      activeSuite = parentSuite;
    }
  };

  const browserBeforeEach = (fn: () => void) => {
    if (beforeEachStack.length > 0) {
      beforeEachStack[beforeEachStack.length - 1].push(fn);
    }
  };

  const browserIt = (name: string, fn: () => void) => {
    if (!activeSuite) {
      activeSuite = { name: "Default Suite", cases: [], children: [] };
      suites.push(activeSuite);
    }
    const suite = activeSuite;

    // Clean up hook roots from the previous test before starting a new one.
    for (const root of hookRoots) {
      try { root.unmount(); } catch { /* ignored */ }
    }
    hookRoots.length = 0;

    // Run all registered beforeEach callbacks from outermost to innermost scope.
    for (const scope of beforeEachStack) {
      for (const beFn of scope) beFn();
    }

    try {
      fn();
      suite.cases.push({ name, passed: true });
    } catch (err: any) {
      suite.cases.push({
        name,
        passed: false,
        error: err.message || String(err),
      });
    }
  };

  const browserRender = (element?: React.ReactElement) => {
    if (testRoot) {
      testRoot.unmount();
      testRoot = null;
    }

    container.innerHTML = "";
    const testDiv = document.createElement("div");
    testDiv.id = "test-sandbox-root";
    container.appendChild(testDiv);

    const el = element || React.createElement(component);

    flushSync(() => {
      testRoot = createRoot(testDiv);
      testRoot.render(el);
    });

    return {
      container: testDiv,
      getByText: (text: string) => {
        const item = findByTextContent(testDiv, text);
        if (!item) throw new Error(`Element with text "${text}" not found`);
        return item;
      },
      queryByText: (text: string) => findByTextContent(testDiv, text),
      getByPlaceholderText: (placeholder: string) => {
        const item = testDiv.querySelector(`[placeholder="${placeholder}"]`) as HTMLElement;
        if (!item) throw new Error(`Element with placeholder "${placeholder}" not found`);
        return item;
      },
      getByTestId: (testId: string) => {
        const item = testDiv.querySelector(`[data-testid="${testId}"]`) as HTMLElement;
        if (!item) throw new Error(`Element with data-testid "${testId}" not found`);
        return item;
      },
    };
  };

  // Each renderHook call gets its own div so multiple concurrent hooks within
  // the same test don't clobber each other.
  const browserRenderHook = (hookFn: () => any) => {
    const result: { current: any } = { current: null };

    function Wrapper() {
      result.current = hookFn();
      return null;
    }

    const hookDiv = document.createElement("div");
    container.appendChild(hookDiv);

    let localRoot: any;
    flushSync(() => {
      localRoot = createRoot(hookDiv);
      localRoot.render(React.createElement(Wrapper));
    });

    hookRoots.push(localRoot);
    return { result };
  };

  const helpers: VitestAdapterHelpers = {
  describe: browserDescribe,
  it: browserIt,
  expect: browserExpect,
  render: browserRender,
  renderHook: browserRenderHook,
  fireEvent,
  screen,
  act: (fn: () => void) => flushSync(fn),
  beforeEach: browserBeforeEach,
  };

  setVitestAdapterContext(helpers);

  try {
    registerTests();
  } catch (err: any) {
    if (activeSuite) {
      (activeSuite as TestSuiteResult).cases.push({
        name: "Test Runner Error",
        passed: false,
        error: err.message || String(err),
      });
    } else {
      suites.push({
        name: "Initialization Error",
        cases: [
          {
            name: "Runner failed",
            passed: false,
            error: err.message || String(err),
          },
        ],
        children: [],
      });
    }
  } finally {
	clearVitestAdapterContext();
  }

  // Final cleanup
  for (const root of hookRoots) {
    try { root.unmount(); } catch { /* ignored */ }
  }
  if (testRoot) {
    try { testRoot.unmount(); } catch { /* ignored */ }
    testRoot = null;
  }

  return [...suites];
}
