import ReactDOM from "react-dom/client";
import Home from "./pages/home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import TestSandbox from "./pages/sandbox";
import NotFound from "./pages/not-found";
import Test from "./pages/test";
import "./styles.css";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <Router>	
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sandbox" element={<TestSandbox />} />
      <Route path="/test" element={<Test />} />
	  <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  </Router>,
);
