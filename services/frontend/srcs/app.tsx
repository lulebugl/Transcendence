import React from "react";
import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./styles.css";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoutes } from "@/features/ProtectedRoutes";
import { Signup } from "@/pages/auth/SignUp";
import { Login } from "@/pages/auth/Login";
import { Loading } from "@/components/Loading";
import { UserProfile, Settings, Home, NotFound, TestSandbox } from "./pages";
import { ErrorBoundary } from "./features/errors/ErrorBoundary";
import { PongErrorFallback } from "./features/errors/ErrorFallback";

// DESIGN INSPIRATION PAGES, will be deleted later
import InspirationHome from "./pages/inspiration/inspiration";
import CodexDesign from "./pages/inspiration/codex-design";
import GeminiDesign from "./pages/inspiration/gemini-design";
import TestDesign from "./pages/inspiration/test-design";
import DevHub from "./pages/dev-hub";

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
            <Route path="/sandbox" element={<TestSandbox />} />
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
            </Route>
            {/* DESIGN INSPIRATION PAGES */}
            <Route path="/inspiration">
              <Route index element={<InspirationHome />} />
              <Route path="codex-design" element={<CodexDesign />} />
              <Route path="gemini-design" element={<GeminiDesign />} />
              <Route path="test-design" element={<TestDesign />} />
            </Route>
            {/* Test Page and dev below */}
            import.meta.env.DEV && (
            <>
              <Route path="/dev-hub" element={<DevHub />} />
            </>
            ){/* NOT FOUND PAGE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
