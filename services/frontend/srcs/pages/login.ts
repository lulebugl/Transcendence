import { Page } from '../router';
import { createManagedEventListener, createManagedWebSocket } from '../utils/cleanup-helpers';

export const Login: Page = () => {
  const el = document.createElement("div");
  el.className = "p-6 space-y-4";
  
  // Array to collect all cleanup functions
  const cleanupFunctions: (() => void)[] = [];
  
  el.innerHTML = `
    <h1 class="text-3xl font-bold">Login Page</h1>
    <nav class="space-x-4">
      <a data-link href="/" class="text-blue-600 hover:underline">Home</a>
      <a data-link href="/game" class="text-blue-600 hover:underline">Game</a>
      <a data-link href="/login" class="text-blue-600 hover:underline">Login</a>
    </nav>
    <form id="loginForm" class="space-y-3 max-w-sm">
      <input type="text" placeholder="Username" class="border rounded px-3 py-2 w-full" />
      <input type="password" placeholder="Password" class="border rounded px-3 py-2 w-full" />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Sign in</button>
    </form>
    <div id="status" class="text-sm text-gray-600"></div>
  `;
  
  const form = el.querySelector('#loginForm') as HTMLFormElement;
  const statusEl = el.querySelector('#status') as HTMLDivElement;
  
  // AUTOMATIC: Use helper for form submission
  createManagedEventListener(form, 'submit', (e) => {
    e.preventDefault();
    console.log("🔐 Login form submitted (automatic cleanup)");
    statusEl.textContent = "Form submitted! (This would connect to server)";
  }, cleanupFunctions);
  
  // AUTOMATIC: Simulate WebSocket connection (would be real in production)
  // This shows how automatic cleanup works with network connections
  try {
    createManagedWebSocket('ws://localhost:3000/auth', (event) => {
      console.log("🔐 WebSocket message received:", event.data);
      statusEl.textContent = `Server: ${event.data}`;
    }, cleanupFunctions);
  } catch (error) {
    // WebSocket will fail in development, that's OK
    statusEl.textContent = "WebSocket connection simulated (would connect to ws://localhost:3000/auth)";
  }
  
  // Return element AND cleanup function (hybrid approach)
  return {
    el,
    cleanup: () => {
      console.log("🔐 Login page cleanup called!");
      
      // AUTOMATIC: All managed resources cleaned up automatically
      cleanupFunctions.forEach(fn => fn());
      
      // MANUAL: Any additional cleanup can go here
      statusEl.textContent = "Login page cleaned up";
    }
  };
};
