import type { ReactNode } from 'react';

export interface RouteProps {
  path: string;
  element: ReactNode | null;
  index?: boolean;
}

// Route is just a configuration component - Routes handles the rendering
export const Route = (_props: RouteProps) => {
  return null;
};

