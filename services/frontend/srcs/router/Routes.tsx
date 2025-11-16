import { Children, isValidElement } from 'react';
import { useRouterContext } from './context';
import { matchRoute } from './utils';
import { Route } from './Route';
import type { ReactElement, ReactNode } from 'react';
import type { RouteProps } from './Route';

interface RoutesProps {
  children: ReactElement<RouteProps> | ReactElement<RouteProps>[] | ReactNode;
}

export const Routes = ({ children }: RoutesProps) => {
  const { location } = useRouterContext();
  
  // Use React.Children to properly iterate over children
  let matchedElement: ReactElement | null = null;

  Children.forEach(children, (child) => {
    // Skip if we already found a match
    if (matchedElement) return;

    // Check if it's a valid React element and is a Route component
    if (isValidElement(child) && child.type === Route) {
      const props = child.props as RouteProps;
      if (props && props.path) {
        const { matched } = matchRoute(props.path, location.pathname);
        if (matched) {
          matchedElement = props.element as ReactElement;
        }
      }
    }
  });

  return matchedElement;
};

