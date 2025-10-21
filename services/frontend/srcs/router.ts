// router.ts - Enhanced version with automatic cleanup
let currentPageCleanups: (() => void)[] = [];

// Helper functions for automatic cleanup
export function useCleanup(cleanup: () => void) {
  currentPageCleanups.push(cleanup);
}

export function useTimer(callback: () => void, delay: number) {
  const timer = setInterval(callback, delay);
  useCleanup(() => clearInterval(timer));
  return timer;
}

export function useEventListener(
  element: HTMLElement,
  event: string,
  handler: (e: Event) => void
) {
  element.addEventListener(event, handler);
  useCleanup(() => element.removeEventListener(event, handler));
}

export type Page = (ctx: { params: Record<string, string> }) => {
  el: HTMLElement;
  cleanup: () => void;
};

/**
 * Route type definition:
 * - pattern: Regular expression to match URLs (like /^\/users\/([^\/]+)$/)
 * - keys: Array of parameter names (like ["id"] for /users/:id)
 * - page: Function that creates the page content
 */
type Route = {
  pattern: RegExp;
  keys: string[];
  page: Page;
};

export class Router {
  private routes: Route[] = [];
  private root: HTMLElement;
  private activePageCleanup?: () => void;

  constructor(root: HTMLElement) {
    this.root = root;
    window.addEventListener("popstate", () => {
      this.resolve(location.pathname);
    });

    document.addEventListener("click", (e) => {
      // use data-link for internal navigation of the app
      // i.e. <a data-link href="/game">Game</a>
      const a = (e.target as HTMLElement).closest(
        "a[data-link]"
      ) as HTMLAnchorElement | null;
      if (!a) return;

      const url = new URL(a.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      this.navigate(url.pathname);
    });
  }

  /**
   * Add a new route to the router
   * @param path - URL pattern (like "/", "/game", "/users/:id")
   * @param page - Function that creates the page content
   */
  add(path: string, page: Page) {
    const keys: string[] = [];

    // convert the path pattern to a regular expression for matching in resolve
    const pattern = new RegExp(
      "^" +
        path.replace(/:([^/]+)/g, (_, k) => {
          keys.push(k);
          return "([^/]+)";
        }) +
        "$"
    );

    this.routes.push({ pattern, keys, page });
    return this;
  }

  start() {
    this.resolve(location.pathname);
  }

  navigate(path: string) {
    if (path !== location.pathname) {
      history.pushState({}, "", path);
    }
    this.resolve(path);
  }

  private resolve(path: string) {
    for (const r of this.routes) {
      const m = path.match(r.pattern);

      if (m) {
        // example: path="/users/123" with route="/users/:id"
        const params: Record<string, string> = {};
        r.keys.forEach((k, i) => {
          params[k] = decodeURIComponent(m[i + 1]);
        });

        if (this.activePageCleanup) {
          this.activePageCleanup();
        }

        currentPageCleanups = [];
        const { el, cleanup } = r.page({ params });

        this.activePageCleanup = () => {
          currentPageCleanups.forEach((fn) => fn());
          currentPageCleanups = [];
          cleanup();
        };

        this.root.replaceChildren(el);
        return;
      }
    }

    // TODO: maybe return a 404 page later
    this.root.textContent = "Not found";
  }
}
