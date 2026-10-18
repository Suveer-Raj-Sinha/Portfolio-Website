import { useState, useEffect, useCallback } from 'react';

// Custom event to synchronize route changes in SPA mode
const ROUTE_CHANGE_EVENT = 'app:route-change';

function normalizePath(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

export function useRoute() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname)
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener(ROUTE_CHANGE_EVENT, handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener(ROUTE_CHANGE_EVENT, handleLocationChange);
    };
  }, []);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean; scrollId?: string }) => {
      const url = new URL(to, window.location.origin);
      const newPath = normalizePath(url.pathname);
      const currentNorm = normalizePath(window.location.pathname);

      if (options?.replace) {
        window.history.replaceState(null, '', to);
      } else {
        window.history.pushState(null, '', to);
      }

      window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_EVENT));
      setCurrentPath(newPath);

      // Handle scrolling
      if (newPath !== currentNorm) {
        if (options?.scrollId) {
          setTimeout(() => {
            document
              .getElementById(options.scrollId!)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      } else if (url.hash) {
        const id = url.hash.replace(/^#/, '');
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  const isProjectsArchive = currentPath.startsWith('/projects');

  return {
    currentPath,
    isProjectsArchive,
    navigate,
  };
}
