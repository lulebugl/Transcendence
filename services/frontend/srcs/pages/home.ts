import { Navbar } from "../components/navbar";

export type Page = () => { el: HTMLElement; cleanup?: () => void };

export const Home: Page = () => {
  const el = document.createElement("div");
  el.className = "p-6 space-y-4";

  el.appendChild(Navbar());

  const h1 = document.createElement("h1");
  h1.className = "text-3xl font-bold";
  h1.textContent = "Welcome to Transcendence";
  el.appendChild(h1);

  const p = document.createElement("p");
  p.className = "text-gray-600";
  p.textContent = "Your 3D Pong game awaits!";
  el.appendChild(p);

  return {
    el,
    cleanup: () => {
      console.log("🏠 Home page cleanup called!");
    },
  };
};
