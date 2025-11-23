import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import TestSandbox from "./pages/sandbox";
import { Home, NotFound, Pong } from "./pages";
import "./styles.css";
import { AuthProvider } from "./context/AuthProvider";

// DESIGN INSPIRATION PAGES, will be deleted later
import InspirationHome from "./pages/inspiration/inspiration";
import CodexDesign from "./pages/inspiration/codex-design";
import GeminiDesign from "./pages/inspiration/gemini-design";
import TestDesign from "./pages/inspiration/test-design";
import DevHub from "./pages/dev-hub";
import Signup from "@/pages/auth/SignUp";
import Login from "@/pages/auth/Login";

const root = document.getElementById("root") as HTMLElement;
if (!root) {
  throw new Error(
    "Root element not found. Make sure <main id='root'> exists in index.html"
  );
}

ReactDOM.createRoot(root).render(
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sandbox" element={<TestSandbox />} />
        <Route path="/pong" element={<Pong />} />

        {/* AUTH PAGES */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* DESIGN INSPIRATION PAGES */}
        <Route path="/inspiration">
          <Route index element={<InspirationHome />} />
          <Route path="codex-design" element={<CodexDesign />} />
          <Route path="gemini-design" element={<GeminiDesign />} />
          <Route path="test-design" element={<TestDesign />} />
        </Route>

        {/* DEV HUB PAGE */}
        <Route path="/dev-hub" element={<DevHub />} />

        {/* NOT FOUND PAGE */}
        {/* <Route path="/not-found" element={<NotFound />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </AuthProvider>
);
