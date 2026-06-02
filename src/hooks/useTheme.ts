import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};

/**
 * Reads the active app theme from `data-theme` on <html> (set in AppLayout) and
 * re-renders when it changes. Lets components outside AppLayout react to the
 * theme without prop drilling or a dedicated context.
 */
const useTheme = (): Theme => useSyncExternalStore(subscribe, getSnapshot);

export default useTheme;
