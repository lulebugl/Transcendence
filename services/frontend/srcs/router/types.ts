export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

export interface RouteMatch {
  pathname: string;
  params: Record<string, string>;
  route: RouteConfig;
}

export interface RouteConfig {
  path: string;
  element: React.ReactElement | null;
  index?: boolean;
}

export interface RouterContextValue {
  location: Location;
  navigate: (to: string | number, options?: NavigateOptions) => void;
  matches: RouteMatch[];
}

export interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
}

