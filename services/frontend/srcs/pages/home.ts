import { Navbar } from "../components/navbar";

export type Page = () => { el: HTMLElement; cleanup?: () => void };

const createStatusIndicator = (label: string, statusId: string) => {
	const container = document.createElement("div");
	container.className = "flex items-center gap-2 text-sm";
  
	const labelEl = document.createElement("span");
	labelEl.textContent = label;
	labelEl.className = "text-gray-600";
  
	const statusEl = document.createElement("span");
	statusEl.id = statusId;
	statusEl.className =
	  "px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800";
	statusEl.textContent = "Checking...";
  
	container.appendChild(labelEl);
	container.appendChild(statusEl);
  
	return { container, statusEl };
  };

  
export const Home: Page = () => {
  const el = document.createElement("div");
  el.className = "p-6 space-y-4";

  el.appendChild(Navbar());

  const h1 = document.createElement("h1");
  h1.className = "text-3xl font-bold";
  h1.textContent = "Welcome to Transcendence";
  el.appendChild(h1);

  const p = document.createElement("p");
  p.className = "text-gray-600 mt-2";
  p.textContent = "Your 3D Pong game awaits!";
  el.appendChild(p);

  const dbLink = document.createElement("a");
  dbLink.className = "text-blue-500";
  dbLink.textContent = "Drizzle Studio";
  dbLink.href = "https://local.drizzle.studio/";

  const span = document.createElement("span");
  span.className = "text-gray-600 block mb-3";
  span.textContent = "Check database at: ";
  el.appendChild(span);
  span.appendChild(dbLink);
  
  const { container: healthContainer, statusEl: healthStatus } = createStatusIndicator("Backend Status:", "healthStatus");
  el.appendChild(healthContainer);

  
  fetch("https://localhost:8443/api/health")
    .then((res) =>
      res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))
    )
    .then((data) => {
      healthStatus.textContent = data.status || "OK";
      healthStatus.className =
        "px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800";
    })
    .catch(() => {
      healthStatus.textContent = "Offline";
      healthStatus.className =
        "px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800";
    });

  return {
    el,
    cleanup: () => {
      console.log("🏠 Home page cleanup called!");
    },
  };
};
