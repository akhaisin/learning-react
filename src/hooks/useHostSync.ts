import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TRUSTED_ORIGINS = ['https://mefly.dev'];

function isTrustedOrigin(origin: string): boolean {
  if (TRUSTED_ORIGINS.includes(origin)) return true;
  return /^https?:\/\/localhost(:\d+)?$/.test(origin);
}

export function useHostSync(): void {
  const location = useLocation();

  // Send hash to host on every route change. useLocation fires where
  // hashchange does not — React Router navigates via history.pushState,
  // which updates the URL hash without triggering a hashchange event.
  useEffect(() => {
    if (window.parent === window) return;
    window.parent.postMessage({ type: 'HASH_CHANGED', hash: window.location.hash }, '*');
  }, [location]);

  useEffect(() => {
    if (window.parent === window) return;

    function handleMessage(event: MessageEvent): void {
      if (!isTrustedOrigin(event.origin)) return;
      if (event.data?.type !== 'NAVIGATE_TO_HASH') return;

      const hash: string = event.data.hash ?? '';
      if (!hash) return;

      const next = hash.startsWith('#') ? hash : `#${hash}`;
      if (window.location.hash !== next) window.location.hash = next;
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
}
