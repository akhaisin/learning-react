import { Panel, usePanelRef } from "react-resizable-panels";
import { useEffect, useState } from "react";
import styles from "./CollapsibleSidePanel.module.css";

export type PanelPosition = "left" | "right" | "bottom";

/**
 * Where the title + toggle sit within the bar. For a horizontal title bar
 * (bottom panel, or any expanded panel) "left"/"right" align horizontally;
 * for the collapsed vertical rail (left/right panels) "top"/"bottom" align
 * vertically. Defaults to leading edge ("left"/"top").
 */
export type TitlePosition = "left" | "right" | "top" | "bottom";

export interface Props {
  position: PanelPosition;
  title?: string;
  ContentComponent: React.ComponentType;
  defaultSize?: string;
  minSize?: string;
  defaultCollapsed?: boolean;
  titlePosition?: TitlePosition;
  /**
   * Optional external imperative ref (from `usePanelRef`). When provided the
   * parent can drive collapse/expand programmatically; otherwise the panel
   * manages its own ref internally.
   */
  panelRef?: ReturnType<typeof usePanelRef>;
}

const COLLAPSED_SIZE = 32;

const EXPAND_ARROW: Record<PanelPosition, string> = { left: "›", right: "‹", bottom: "∧" };
const COLLAPSE_ARROW: Record<PanelPosition, string> = { left: "‹", right: "›", bottom: "∨" };

export default function CollapsibleSidePanel({
  position,
  title,
  ContentComponent,
  defaultSize = "20%",
  minSize = "10%",
  defaultCollapsed = false,
  titlePosition,
  panelRef: externalPanelRef,
}: Props) {
  const internalPanelRef = usePanelRef();
  const panelRef = externalPanelRef ?? internalPanelRef;
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // Trailing-edge alignment for the title/toggle within the bar.
  const titleBarAlignEnd = titlePosition === "right" ? styles["titleBar--alignEnd"] : "";
  const collapsedBarAlignEnd = titlePosition === "bottom" ? styles["collapsedBar--alignEnd"] : "";

  useEffect(() => {
    if (!defaultCollapsed) return;
    // Collapse once the panel is registered with its group. On a fresh mount
    // this succeeds immediately; when the panel remounts (e.g. navigating away
    // and back) the group may not have re-registered its constraints yet, so
    // `collapse()` throws "constraints not found" — retry on the next frames
    // instead of crashing.
    let raf = 0;
    let attempts = 0;
    const tryCollapse = () => {
      raf = 0;
      const panel = panelRef.current;
      if (panel) {
        try {
          panel.collapse();
          return;
        } catch {
          /* constraints not ready yet — fall through to retry */
        }
      }
      if (attempts++ < 10) raf = requestAnimationFrame(tryCollapse);
    };
    tryCollapse();
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle() {
    const panel = panelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  }

  function handleResize() {
    setCollapsed(panelRef.current?.isCollapsed() ?? false);
  }

  const arrow = collapsed ? EXPAND_ARROW[position] : COLLAPSE_ARROW[position];
  const isVertical = position === "left" || position === "right";

  return (
    <Panel
      panelRef={panelRef}
      defaultSize={defaultSize}
      minSize={minSize}
      collapsible
      collapsedSize={COLLAPSED_SIZE}
      onResize={handleResize}
      className={`${styles.panel} ${styles[`panel--${position}`]}`}
    >
      {isVertical && collapsed ? (
        /* ── Collapsed vertical bar ── */
        <div className={`${styles.collapsedBar} ${collapsedBarAlignEnd}`} onClick={toggle} title="Expand">
          <button className={styles.toggleBtn} tabIndex={-1} aria-hidden>
            {arrow}
          </button>
          {title && <span className={styles.titleVertical}>{title}</span>}
        </div>
      ) : (
        /* ── Expanded (all positions) or collapsed bottom ── */
        <>
          <div
            className={`${styles.titleBar} ${styles[`titleBar--${position}`]} ${titleBarAlignEnd}`}
            onClick={toggle}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <button className={styles.toggleBtn} tabIndex={-1} aria-hidden>
              {arrow}
            </button>
            {title && <span className={styles.titleText}>{title}</span>}
          </div>
          {!collapsed && (
            <div className={styles.body}>
              <ContentComponent />
            </div>
          )}
        </>
      )}
    </Panel>
  );
}
