import ReactDOM from "react-dom/client";
import Home from "./pages/home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import TestSandbox from "./pages/sandbox";
import { Test, NotFound, Pong, Login, Register, TestApi } from "./pages";
import CodexDesign from "./pages/codex-design";
import GeminiDesign from "./pages/gemini-design";
import "./styles.css";
import TestDesign from "./pages/test-design";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <Router>	
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sandbox" element={<TestSandbox />} />
      <Route path="/test" element={<Test />} />
      <Route path="/pong" element={<Pong />} />
	  <Route path="/codex-design" element={<CodexDesign />} />
	  <Route path="/gemini-design" element={<GeminiDesign />} />
	  <Route path="/test-design" element={<TestDesign />} />	
      {/* <Route path="/game" element={<Game />} /> */}
	  <Route path="/not-found" element={<NotFound />} />
	  <Route path="/login" element={<Login />} />
	  <Route path="/register" element={<Register />} />
	  <Route path="/testApi" element={ <TestApi />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  </Router>,
);
