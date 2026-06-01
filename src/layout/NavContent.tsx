import { createContext, useContext, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { NavLink } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import type { AppPage } from "./AppLayout";
import styles from "./AppLayout.module.css";

export type NavContextValue = {
  isSandbox: boolean;
  navigate: NavigateFunction;
  lastExerciseId: MutableRefObject<string>;
  pages: AppPage[];
  activePageId: string;
  activeVariationId: string | undefined;
  firstVariationId: string | undefined;
  firstDoneId: string | undefined;
  getIsPageCompleted: (page: AppPage) => boolean;
  getIsVariationCompleted: (pageId: string, varId: string) => boolean;
};

const NavContext = createContext<NavContextValue | null>(null);

export function NavProvider({
  value,
  children,
}: {
  value: NavContextValue;
  children: React.ReactNode;
}) {
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

function useNav(): NavContextValue {
  const ctx = useContext(NavContext);
  if (!ctx) {
    throw new Error("NavContent must be rendered within a NavProvider");
  }
  return ctx;
}

export default function NavContent() {
  const {
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
  } = useNav();

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const activeEl = list.querySelector<HTMLElement>(`.${styles["is-active"]}`);
    activeEl?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activePageId, activeVariationId]);

  return (
    <div className={styles["nav-content"]}>
      <header className={styles["panel-header"]}>
        <div className={styles["mode-toggle"]}>
          <button
            id="tour-exercises-btn"
            className={[styles["mode-btn"], !isSandbox ? styles["mode-btn-active"] : ""].join(" ")}
            onClick={() => navigate(lastExerciseId.current)}
          >
            Exercises
          </button>
          <button
            id="tour-sandbox-btn"
            className={[styles["mode-btn"], isSandbox ? styles["mode-btn-active"] : ""].join(" ")}
            onClick={() => navigate("/sandbox")}
          >
            Sandbox
          </button>
        </div>
      </header>

      <div ref={listRef} id="tour-nav-list" className={styles["page-list"]} role="list">
        {pages.map((page) => {
          const pageCompleted = getIsPageCompleted(page);

          if (page.variations) {
            const isGroupActive = page.id === activePageId && !isSandbox;
            return (
              <div
                key={page.id}
                id={
                  page.id === firstVariationId
                    ? "tour-first-variation-group"
                    : page.id === firstDoneId
                    ? "tour-first-done"
                    : undefined
                }
                role="listitem"
                className={[
                  styles["page-item"],
                  isGroupActive ? styles["is-active"] : "",
                  page.solution ? styles["is-done"] : styles["is-pending"],
                ].join(" ")}
                onClick={() => navigate(`/${page.id}/${page.variations![0].id}`)}
              >
                <span className={styles["page-item-number"]}>{String(page.number).padStart(2, "0")}</span>
                <div className={styles["page-item-cols"]}>
                  <div className={styles["page-item-col-main"]}>
                    <div className={styles["page-item-top"]}>
                      <span className={styles["page-item-label"]}>{page.label}</span>
                      {pageCompleted && (
                        <span className={styles["page-item-check"]} aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className={styles["page-item-variations"]}>
                      {page.variations.map((variation) => {
                        const varCompleted = getIsVariationCompleted(page.id, variation.id);
                        return (
                          <NavLink
                            key={variation.id}
                            to={`/${page.id}/${variation.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className={({ isActive }) =>
                              [
                                styles["variation-link"],
                                isActive && !isSandbox ? styles["variation-link-active"] : "",
                                variation.solution ? "" : styles["variation-pending"],
                              ].join(" ")
                            }
                          >
                            <span className={styles["variation-dot"]} aria-hidden="true" />
                            <span>{variation.label}</span>
                            {varCompleted && (
                              <span className={styles["page-item-check"]} aria-hidden="true">
                                ✓
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                  {page.tags.length > 0 && (
                    <div className={styles["page-item-col-tags"]} aria-label="Topics">
                      {page.tags.map((tag) => (
                        <span key={tag} className={styles["page-item-tag"]}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={page.id}
              id={page.id === firstDoneId ? "tour-first-done" : undefined}
              className={({ isActive }) =>
                [
                  styles["page-item"],
                  isActive && !isSandbox ? styles["is-active"] : "",
                  page.solution ? styles["is-done"] : styles["is-pending"],
                ].join(" ")
              }
              to={`/${page.id}`}
            >
              <span className={styles["page-item-number"]}>{String(page.number).padStart(2, "0")}</span>
              <div className={styles["page-item-body"]}>
                <div className={styles["page-item-top"]}>
                  <span className={styles["page-item-label"]}>{page.label}</span>
                  {pageCompleted && (
                    <span className={styles["page-item-check"]} aria-hidden="true">
                      ✓
                    </span>
                  )}
                </div>
                {page.tags.length > 0 && (
                  <div className={styles["page-item-tags"]} aria-label="Topics">
                    {page.tags.map((tag) => (
                      <span key={tag} className={styles["page-item-tag"]}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
