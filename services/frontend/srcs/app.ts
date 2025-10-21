import "./styles.css";
import { Router } from "./utils/router";
import { Home } from "./pages/home";

const root = document.getElementById("app") as HTMLElement;
const router = new Router(root);

router
  .add("/", Home)
  .start();
