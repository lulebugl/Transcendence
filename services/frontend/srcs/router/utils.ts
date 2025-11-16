import type { Location, RouteMatch, RouteConfig } from './types';

/**
 * Parse a pathname with params into a match object
 * Example: matchRoute('/user/:id', '/user/123') => { pathname: '/user/123', params: { id: '123' } }
 */
export const matchRoute = (
  pattern: string,
  pathname: string
): { matched: boolean; params: Record<string, string> } => {
  // Normalize paths
  const normalizedPattern = pattern === '*' ? '*' : pattern.replace(/\/$/, '') || '/';
  const normalizedPathname = pathname.replace(/\/$/, '') || '/';

  // Exact match for root
  if (normalizedPattern === '/' && normalizedPathname === '/') {
    return { matched: true, params: {} };
  }

  // Wildcard matches everything
  if (normalizedPattern === '*') {
    return { matched: true, params: {} };
  }

  const patternParts = normalizedPattern.split('/').filter(Boolean);
  const pathnameParts = normalizedPathname.split('/').filter(Boolean);

  // Check for wildcard at the end
  const hasWildcard = patternParts[patternParts.length - 1] === '*';
  const minLength = hasWildcard ? patternParts.length - 1 : patternParts.length;

  if (pathnameParts.length < minLength) {
    return { matched: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathnamePart = pathnameParts[i];

    if (patternPart === '*') {
      // Wildcard matches everything remaining
      break;
    }

    if (patternPart.startsWith(':')) {
      // Parameter match
      const paramName = patternPart.slice(1);
      params[paramName] = pathnamePart || '';
    } else if (patternPart !== pathnamePart) {
      // Exact match required
      return { matched: false, params: {} };
    }
  }

  // If pattern has wildcard, it matches regardless of remaining pathname parts
  if (hasWildcard) {
    return { matched: true, params };
  }

  // Exact length match required (unless wildcard)
  if (patternParts.length !== pathnameParts.length) {
    return { matched: false, params: {} };
  }

  return { matched: true, params };
};

/**
 * Find all matching routes for the current pathname
 */
export const findMatches = (
  routes: RouteConfig[],
  location: Location
): RouteMatch[] => {
  const matches: RouteMatch[] = [];

  for (const route of routes) {
    const { matched, params } = matchRoute(route.path, location.pathname);
    if (matched) {
      matches.push({
        pathname: location.pathname,
        params,
        route,
      });
    }
  }

  return matches;
};

/**
 * Create a Location object from window.location
 */
export const createLocation = (): Location => {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: null,
    key: `${Date.now()}-${Math.random()}`,
  };
};

/**
 * Parse search params from a search string
 */
export const parseSearchParams = (search: string): URLSearchParams => {
  return new URLSearchParams(search);
};

