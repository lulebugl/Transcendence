import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "@/Providers";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { devRoutes, protectedRoutes, publicRoutes } from "./routes/Routes";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            <Route element={<ProtectedRoutes />}>
              {protectedRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>

            {import.meta.env.DEV &&
              devRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
