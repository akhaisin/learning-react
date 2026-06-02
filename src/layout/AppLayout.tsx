import React, { useEffect, useRef, useState, type ComponentType } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useHostSync, MeflyNavReceiver } from "mefly-nav";
import useLocalStorage from "../hooks/useLocalStorage";
import { startTour } from "./tour";
import "mefly-nav/style.css";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle, usePanelRef } from "react-resizable-panels";
import CollapsibleSidePanel from "./CollapsibleSidePanel";
import NavContent, { NavProvider, type NavContextValue } from "./NavContent";
import TestResultsContent from "./TestResultsPanel";
import { TestPanelContext, type TestPanelContextValue } from "./testPanelContext";
import type { TestSuiteResult } from "../utils/testRunner";
import styles from "./AppLayout.module.css";

export type AppVariation = {
  id: string;
  label: string;
  solution: boolean;
  Component: ComponentType;
  sourceFiles: Record<string, string>;
};

export type AppPage = {
  id: string;
  label: string;
  solution: boolean;
  number: number;
  tags: string[];
  // Single implementation
  Component?: ComponentType;
  sourceFiles?: Record<string, string>;
  // Or variations
  variations?: AppVariation[];
};

type AppLayoutProps = {
  pages: AppPage[];
  onSelectedPageChange: (id: string) => void;
};

function AppLayout({ pages, onSelectedPageChange }: AppLayoutProps) {
  useHostSync(["https://mefly.dev", "https://www.mefly.dev"]);
  const [isEmbedded] = useState(() => window.parent !== window);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPath = location.pathname.replace(/^\//, "");
  const isSandbox = selectedPath === "sandbox";

  const [activePageId, activeVariationId] = selectedPath.split("/");
  const activePage = pages.find((page) => page.id === activePageId);

  const lastExerciseId = useRef(
    pages[0]?.variations ? `${pages[0].id}/${pages[0].variations[0].id}` : pages[0]?.id ?? ""
  );
  const [helpSeen, setHelpSeen] = useLocalStorage("learning-react.v1.helpSeen", false);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("learning-react.v1.theme", "light");

  // Test results panel (bottom) — shared by ExerciseViewer (and later Sandbox)
  const [testResults, setTestResults] = useState<TestSuiteResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [hasTests, setHasTests] = useState(false);
  const testPanelRef = usePanelRef();
  const firstVariationId = pages.find((p) => p.variations)?.id;
  const firstDoneId = pages.find((p) => p.solution)?.id;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // React state to force re-render when local storage completion status changes
  const [, setCompletionNonce] = useState(0);

  useEffect(() => {
    const handleCompletionChange = () => {
      setCompletionNonce((prev) => prev + 1);
    };
    window.addEventListener("learning-react:completion-changed", handleCompletionChange);
    return () => {
      window.removeEventListener("learning-react:completion-changed", handleCompletionChange);
    };
  }, []);

  const getIsVariationCompleted = (pageId: string, varId: string) => {
    return localStorage.getItem(`learning-react.v1.completion.${pageId}/${varId}`) === "true";
  };

  const getIsPageCompleted = (page: AppPage) => {
    if (page.variations) {
      return page.variations.every((v) => getIsVariationCompleted(page.id, v.id));
    }
    return localStorage.getItem(`learning-react.v1.completion.${page.id}`) === "true";
  };

  useEffect(() => {
    if (!isSandbox && activePage) {
      const fullPath = activeVariationId ? `${activePageId}/${activeVariationId}` : activePageId;
      lastExerciseId.current = fullPath;
      onSelectedPageChange(fullPath);
    }
  }, [isSandbox, activePage, activePageId, activeVariationId, onSelectedPageChange]);

  const activeVariation = activePage?.variations?.find((v) => v.id === activeVariationId);
  const panelTitle = isSandbox
    ? "Sandbox"
    : activeVariation
    ? `${activePage?.label} · ${activeVariation.label}`
    : activePage?.label ?? "";

  const navValue: NavContextValue = {
    isSandbox,
    navigate,
    lastExerciseId,
    pages,
    activePageId,
    activeVariationId,
    firstVariationId,
    firstDoneId,
    getIsPageCompleted,
    getIsVariationCompleted,
  };

  const testPanelValue: TestPanelContextValue = {
    testResults,
    setTestResults,
    isRunningTests,
    setIsRunningTests,
    hasTests,
    setHasTests,
    expandTestPanel: () => testPanelRef.current?.expand(),
  };

  return (
    <main className={`${styles["app-shell"]}${isEmbedded ? ` ${styles["is-embedded"]}` : ""}`}>
      <NavProvider value={navValue}>
        <TestPanelContext.Provider value={testPanelValue}>
          <PanelGroup orientation="horizontal" className={styles["app-panels"]}>
            <CollapsibleSidePanel
              position="left"
              title="Exercises"
              ContentComponent={NavContent}
              defaultSize="20%"
              minSize="15%"
            />

            <PanelResizeHandle className={styles["resize-handle"]} />

            <Panel minSize="30%" className={styles["app-panel-right-outer"]}>
              <PanelGroup orientation="vertical" className={styles["app-right-group"]}>
                <Panel minSize="30%" className={`${styles["app-panel"]} ${styles["right-content"]}`}>
                  <header className={styles["panel-header"]}>
                    <h2>{panelTitle}</h2>
                  </header>

                  <div className={styles["page-preview"]}>
                    <Outlet />
                  </div>
                </Panel>

                {hasTests && (
                  <>
                    <PanelResizeHandle className={styles["resize-handle-h"]} />
                    <CollapsibleSidePanel
                      position="bottom"
                      title="Test Results"
                      titlePosition="right"
                      ContentComponent={TestResultsContent}
                      panelRef={testPanelRef}
                      defaultSize="35%"
                      minSize="15%"
                      defaultCollapsed
                    />
                  </>
                )}
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </TestPanelContext.Provider>
      </NavProvider>

      <MeflyNavReceiver
        trustedOrigins={["https://mefly.dev", "https://www.mefly.dev"]}
        activationMode="hover"
        style={
          {
            left: "1rem",
            bottom: "1rem",
            "--mefly-nav-trigger-size": "2.15rem",
            "--mefly-nav-trigger-bg": "var(--color-bg-subtle)",
            "--mefly-nav-trigger-bg-hover": "var(--color-bg)",
            "--mefly-nav-trigger-color": "var(--color-text)",
            "--mefly-nav-trigger-border": "1px solid var(--color-border)",
            "--mefly-nav-trigger-shadow": "0 8px 20px var(--color-shadow)",
            "--mefly-nav-trigger-hover-transform": "translateY(-1px)",
          } as React.CSSProperties
        }
      />

      <a
        className={styles["repo-link"]}
        href="https://github.com/akhaisin/learning-react"
        target="_blank"
        rel="noreferrer"
        aria-label="Open project repository on GitHub"
        title="GitHub repository"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91 0.58 0.11 0.79-0.25 0.79-0.56 0-0.28-0.01-1.18-0.01-2.15-3.2 0.7-3.88-1.35-3.88-1.35-0.52-1.33-1.28-1.69-1.28-1.69-1.05-0.71 0.08-0.69 0.08-0.69 1.16 0.08 1.77 1.2 1.77 1.2 1.04 1.77 2.71 1.26 3.37 0.96 0.1-0.75 0.41-1.26 0.74-1.56-2.56-0.29-5.25-1.28-5.25-5.73 0-1.26 0.45-2.29 1.19-3.09-0.12-0.29-0.51-1.46 0.11-3.05 0 0 0.97-0.31 3.18 1.18a11.04 11.04 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18 0.62 1.59 0.23 2.76 0.11 3.05 0.74 0.8 1.19 1.83 1.19 3.09 0 4.46-2.69 5.43-5.26 5.72 0.42 0.36 0.79 1.06 0.79 2.14 0 1.55-0.01 2.79-0.01 3.17 0 0.31 0.21 0.68 0.8 0.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35 0.5 12 0.5z" />
        </svg>
      </a>

      <button
        className={styles["theme-btn"]}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        title={theme === "dark" ? "Light theme" : "Dark theme"}
      >
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm10-6a1 1 0 0 1-1 1h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1zM5 12a1 1 0 0 1-1 1H2a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1zm14.07-7.07a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 1 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0zM7.76 16.24a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 1 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0zm11.31 2.83a1 1 0 0 1-1.42 0l-1.41-1.42a1 1 0 1 1 1.41-1.41l1.42 1.41a1 1 0 0 1 0 1.42zM7.76 7.76a1 1 0 0 1-1.42 0L4.93 6.34a1 1 0 0 1 1.41-1.41l1.42 1.41a1 1 0 0 1 0 1.42z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05z" />
          </svg>
        )}
      </button>
      
      <button
        className={[styles["help-btn"], !helpSeen ? styles["help-btn-glow"] : ""].join(" ")}
        onClick={() => {
          setHelpSeen(true);
          if (isSandbox) {
            navigate("/" + lastExerciseId.current);
            setTimeout(() => startTour(navigate), 300);
          } else {
            startTour(navigate);
          }
        }}
        title="Tour"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
      </button>
    </main>
  );
}

export default AppLayout;
