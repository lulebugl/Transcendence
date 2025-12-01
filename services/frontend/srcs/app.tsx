import React from "react";
import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./styles.css";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoutes } from "@/features/ProtectedRoutes";
import { Loading } from "@/components/Loading";
import { ErrorBoundary } from "./features/errors/ErrorBoundary";
import { PongErrorFallback } from "./features/errors/ErrorFallback";
import {
  UserProfile,
  Settings,
  Home,
  NotFound,
  Login,
  Signup,
  Lobby,
  Achievement,
} from "./pages";

import {
  DevHub,
  PrimitivesPlayground,
  ComponentsPlayground,
} from "./pages/dev";

const root = document.getElementById("root") as HTMLElement;
if (!root) {
  throw new Error(
    "Root element not found. Make sure <main id='root'> exists in index.html"
  );
}

const PongPage = lazy(() =>
  import("./pages/pong/pong").then((module) => ({ default: module.Pong }))
);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route
              path="/pong"
              element={
                <ErrorBoundary fallback={<PongErrorFallback />}>
                  <Suspense fallback={<Loading />}>
                    <PongPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            {/* Just to demonstrate the loading state */}
            <Route path="/loading" element={<Loading />} />
            {/* AUTH PAGES */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            {/* User Pages */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/achievements" element={<Achievement />} />
            </Route>

            {/* Dev Pages - only in development */}
            {import.meta.env.DEV && (
              <>
                <Route path="/dev" element={<DevHub />} />
                <Route
                  path="/dev/playground/ui"
                  element={<PrimitivesPlayground />}
                />
                <Route
                  path="/dev/playground/components"
                  element={<ComponentsPlayground />}
                />
              </>
            )}
            {/* NOT FOUND PAGE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
