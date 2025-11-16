import { useState, useEffect, useMemo } from 'react';
import { RouterContext } from './context';
import { createLocation, findMatches } from './utils';
import type { Location, RouteConfig, RouterContextValue, NavigateOptions } from './types';

interface BrowserRouterProps {
  children: React.ReactNode;
  routes?: RouteConfig[];
}

export const BrowserRouter = ({ children, routes = [] }: BrowserRouterProps) => {
  const [location, setLocation] = useState<Location>(createLocation);

  useEffect(() => {
    const handlePopState = () => {
      setLocation(createLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      // Navigate by delta (back/forward)
      window.history.go(to);
      return;
    }

    if (options?.replace) {
      window.history.replaceState(options.state || null, '', to);
    } else {
      window.history.pushState(options?.state || null, '', to);
    }

    setLocation(createLocation());
  };

  const matches = useMemo(() => {
    return findMatches(routes, location);
  }, [routes, location]);

  const contextValue: RouterContextValue = useMemo(
    () => ({
      location,
      navigate,
      matches,
    }),
    [location, navigate, matches]
  );

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};

