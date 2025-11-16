import { createContext, useContext } from 'react';
import type { RouterContextValue } from './types';

export const RouterContext = createContext<RouterContextValue | null>(null);

export const useRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('Router components must be used within a Router provider');
  }
  return context;
};

