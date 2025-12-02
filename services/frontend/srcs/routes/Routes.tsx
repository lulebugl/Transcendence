import { lazy, Suspense } from "react";
import { Loading } from "@/components/Loading";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { PongErrorFallback } from "@/components/errors/ErrorFallback";
import { Home } from "@/routes/home";
import { Login, Signup } from "@/routes/auth";
import { Settings } from "@/routes/settings";
import { UserProfile } from "@/routes/profile";
import { Achievements } from "@/routes/profile/achievements";
import { Lobby } from "@/routes/pong";
import { NotFound } from "@/routes/NotFound";

const Pong = lazy(() =>
  import("@/routes/pong/pong").then((m) => ({ default: m.Pong }))
);

interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export const publicRoutes: RouteConfig[] = [
  { path: "/", element: <Home /> },
  { path: "/lobby", element: <Lobby /> },
  {
    path: "/pong",
    element: (
      <ErrorBoundary fallback={<PongErrorFallback />}>
        <Suspense fallback={<Loading />}>
          <Pong />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/signup", element: <Signup /> },
  { path: "*", element: <NotFound /> },
];

// redirects to login if not authenticated
export const protectedRoutes: RouteConfig[] = [
  { path: "/settings", element: <Settings /> },
  { path: "/profile", element: <UserProfile /> },
  { path: "/profile/achievements", element: <Achievements /> },
];


// ============================================================================
// Dev Routes
// ============================================================================

// lazy loading dev routes
// enable removing files from the build
const DevHub = lazy(() =>
  import("@/routes/dev").then((m) => ({ default: m.DevHub }))
);
const PrimitivesPlayground = lazy(() =>
  import("@/routes/dev").then((m) => ({
    default: m.PrimitivesPlayground,
  }))
);
const ComponentsPlayground = lazy(() =>
  import("@/routes/dev").then((m) => ({
    default: m.ComponentsPlayground,
  }))
);

export const devRoutes: RouteConfig[] = import.meta.env.DEV ? [
  { path: "/dev", element: <DevHub /> },
  { path: "/dev/playground/ui", element: <PrimitivesPlayground /> },
  { path: "/dev/playground/components", element: <ComponentsPlayground /> },
] : [];
