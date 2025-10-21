export type Page = () => { el: HTMLElement; cleanup?: () => void };

type RouteEntry = {
  path: string;
  page: Page;
};

function isSameOrigin(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

export class Router {
  private outlet: HTMLElement;
  private routes: RouteEntry[] = [];
  private notFound: Page | null = null;
  private currentCleanup: (() => void) | null = null;

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;
  }

  add(path: string, page: Page): this {
    this.routes.push({ path, page });
    return this;
  }

  setNotFound(page: Page): this {
    this.notFound = page;
    return this;
  }

  start(): void {
    window.addEventListener("popstate", () => {
      this.navigate(window.location.pathname + window.location.search, { replace: true });
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || (e as MouseEvent).metaKey || (e as MouseEvent).ctrlKey || (e as MouseEvent).shiftKey || (e as MouseEvent).altKey) return;
      const href = anchor.getAttribute("href");
      if (!href || !isSameOrigin(href)) return;
      e.preventDefault();
      this.navigate(href);
    });

    this.navigate(window.location.pathname + window.location.search, { replace: true });
  }

  navigate(to: string, opts: { replace?: boolean } = {}): void {
    const url = new URL(to, window.location.origin);
    const match = this.routes.find((r) => r.path === url.pathname);
    const page = match?.page ?? this.notFound ?? this.defaultNotFoundPage;

    if (this.currentCleanup) {
      try {
        this.currentCleanup();
      } catch (err) {
        console.error("Error during page cleanup", err);
      }
      this.currentCleanup = null;
    }

    const { el, cleanup } = page();
    this.outlet.replaceChildren(el);

    if (opts.replace) {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
    }

    this.currentCleanup = cleanup ?? null;
    window.scrollTo(0, 0);
  }

  private defaultNotFoundPage: Page = () => {
    const container = document.createElement("div");
    container.style.padding = "1rem";
    const h1 = document.createElement("h1");
    h1.textContent = "404 — Page not found";
    container.appendChild(h1);
    const p = document.createElement("p");
    p.textContent = "The page you requested does not exist.";
    container.appendChild(p);
    const back = document.createElement("a");
    back.href = "/";
    back.textContent = "Go home";
    container.appendChild(back);
    return { el: container };
  };
}


