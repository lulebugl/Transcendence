/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { Outlet } from "react-router";
import { Loading } from "@/components/Loading";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { PongErrorFallback } from "@/components/errors/ErrorFallback";
import { Home } from "@/routes/home";
import { Login, Signup } from "@/routes/auth";
import { Settings } from "@/routes/settings";
import { UserProfile, Achievements } from "@/routes/profile";
import { Lobby } from "@/routes/lobby";
import { NotFound } from "@/routes/NotFound";
import { Tournaments } from "@/routes/tournaments";
import { Pong, PongLobby } from "@/routes/pong";
import { TestPongDev } from "@/routes/pong/testPongDev";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export const publicRoutes: RouteConfig[] = [
  { path: "/", element: <Home /> },
  { path: "/lobby", element: <Lobby /> },
  { path: "/lobby-test", element: <PongLobby /> },

  
  { path: "/pong-test", element: <TestPongDev /> },
  { path: "/tournaments", element: <Tournaments /> },
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

// Lazy loading dev routes - enables tree-shaking in production
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

export const DevLayout = () => (
  <Suspense fallback={<Loading />}>
    <Outlet />
  </Suspense>
);

export const devRoutes: RouteConfig[] = import.meta.env.DEV
  ? [
      { path: "", element: <DevHub /> },
      { path: "playground/ui", element: <PrimitivesPlayground /> },
      { path: "playground/components", element: <ComponentsPlayground /> },
    ]
  : [];
