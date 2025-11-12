import "./styles.css";
import { Router } from "./utils/router";
import { Home } from "./pages/home";
import { Game } from "./pages/babylon.ts";

const root = document.getElementById("app") as HTMLElement;
const router = new Router(root);

router
  .add("/", Home)
  .add("/game", Game)
  .start();
