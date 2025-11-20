import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import TestSandbox from "./pages/sandbox";
import { Home, Test, NotFound, Pong, Login, Register, TestApi } from "./pages";
import "./styles.css";
import { AuthProvider } from "./context/AuthContext";

// INSPIRATION PAGES, will be deleted later
import InspirationHome from "./pages/inspiration/inspiration";
import CodexDesign from "./pages/inspiration/codex-design";
import GeminiDesign from "./pages/inspiration/gemini-design";
import TestDesign from "./pages/inspiration/test-design";


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
        <Route path="/test" element={<Test />} />
        <Route path="/pong" element={<Pong />} />

        {/* AUTH PAGES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/testApi" element={<TestApi />} />

        {/* INSPIRATION PAGES */}
        <Route path="/inspiration">
          <Route index element={<InspirationHome />} />
          <Route path="codex-design" element={<CodexDesign />} />
          <Route path="gemini-design" element={<GeminiDesign />} />
          <Route path="test-design" element={<TestDesign />} />
        </Route>

        {/* NOT FOUND PAGE */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </Router>
  </AuthProvider>
);
