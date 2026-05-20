
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import { transform } from "sucrase";

const externalRegistry: Record<string, any> = {
  react: React,
  "react-dom": ReactDOM,
  "react-dom/client": ReactDOMClient,
};

function injectStyles(fileKey: string, cssContent: string) {
  const styleId = `style-sandbox-${fileKey.replace(/[^a-zA-Z0-9]/g, "-")}`;
  let styleEl = document.getElementById(styleId) as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = cssContent;
}

export function cleanupStyles() {
  const styles = document.querySelectorAll('[id^="style-sandbox-"]');
  styles.forEach((el) => el.remove());
}

export interface CompilationResult {
  component: React.ComponentType | null;
  error: Error | null;
  modules: Record<string, any>;
}

export function compileAndRun(files: Record<string, string>): CompilationResult {
  const evaluatedModules: Record<string, { exports: any }> = {};
  const compilingModules: Record<string, boolean> = {};

  cleanupStyles();

  function localRequire(modulePath: string): any {
    // Check if it matches an external dependency
    if (externalRegistry[modulePath]) {
      return externalRegistry[modulePath];
    }

    // Normalize path. E.g. './Component' or './utils' or './Component.module.css'
    let normalized = modulePath;
    if (normalized.startsWith("./")) {
      normalized = normalized.slice(2);
    } else if (normalized.startsWith("../")) {
      // Very simple handling of relative sibling paths if needed
      normalized = normalized.replace(/^\.\.+\//, "");
    }

    // Match file extension fallbacks
    let foundFileKey = "";
    const extensions = ["", ".tsx", ".ts", ".js", ".jsx", ".css"];
    for (const ext of extensions) {
      const candidate = normalized + ext;
      // Match case-insensitively or standardly. Standard is better.
      const match = Object.keys(files).find(
        (key) => key.toLowerCase() === candidate.toLowerCase()
      );
      if (match) {
        foundFileKey = match;
        break;
      }
    }

    if (!foundFileKey) {
      throw new Error(`Module not found: "${modulePath}"`);
    }

    if (evaluatedModules[foundFileKey]) {
      return evaluatedModules[foundFileKey].exports;
    }

    if (compilingModules[foundFileKey]) {
      throw new Error(`Circular dependency detected: "${foundFileKey}"`);
    }

    compilingModules[foundFileKey] = true;

    // Handle CSS module style imports
    if (foundFileKey.endsWith(".css")) {
      const cssContent = files[foundFileKey] || "";
      injectStyles(foundFileKey, cssContent);

      // Return a Proxy mapping class names to their literal names
      const stylesTarget = { __esModule: true };
      const stylesProxy: any = new Proxy(
        stylesTarget,
        {
          get(_target, prop) {
            if (prop === "__esModule") {
              return true;
            }
            if (prop === "default") {
              return stylesProxy;
            }
            if (typeof prop === "string") {
              return prop;
            }
            return undefined;
          },
        }
      );
      evaluatedModules[foundFileKey] = { exports: stylesProxy };
      compilingModules[foundFileKey] = false;
      return stylesProxy;
    }

    // Handle TS/TSX modules
    const originalCode = files[foundFileKey] || "";
    let transpiled: string;
    try {
      transpiled = transform(originalCode, {
        transforms: ["typescript", "jsx", "imports"],
        production: true,
      }).code;
      // Replace import.meta with a safe mock object to avoid SyntaxError in browser sandboxes
      transpiled = transpiled.replace(/\bimport\.meta\b/g, "({ env: {} })");
    } catch (err: any) {
      compilingModules[foundFileKey] = false;
      throw new Error(`Syntax error in ${foundFileKey}: ${err.message}`);
    }

    const moduleObj = { exports: {} as any };
    Object.defineProperty(moduleObj.exports, "__esModule", { value: true });
    try {
      // Evaluate within a function sandbox supplying custom exports and require
      const runFn = new Function("exports", "require", "module", "React", transpiled);
      runFn(moduleObj.exports, localRequire, moduleObj, React);
    } catch (err: any) {
      compilingModules[foundFileKey] = false;
      throw new Error(`Error executing ${foundFileKey}: ${err.message}`);
    }

    evaluatedModules[foundFileKey] = moduleObj;
    compilingModules[foundFileKey] = false;
    return moduleObj.exports;
  }

  try {
    // We expect Page.tsx to exist and be the entrypoint
    const pageKey = Object.keys(files).find((k) => k.toLowerCase() === "page.tsx");
    if (!pageKey) {
      throw new Error("Missing Page.tsx entrypoint file.");
    }
    const pageExports = localRequire(pageKey);
    const component = pageExports.default || pageExports;

    if (typeof component !== "function" && typeof component !== "object") {
      throw new Error(
        "Page.tsx must default-export a React component."
      );
    }

    // Build modules dictionary for testing access
    const modules: Record<string, any> = {};
    for (const key of Object.keys(evaluatedModules)) {
      modules[key] = evaluatedModules[key].exports;
    }

    return {
      component,
      error: null,
      modules,
    };
  } catch (err: any) {
    return {
      component: null,
      error: err,
      modules: {},
    };
  }
}
