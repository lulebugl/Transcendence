export const Navbar = (): HTMLElement => {
  const nav = document.createElement("nav");
  nav.className = "space-x-4";

  const aHome = document.createElement("a");
  aHome.href = "/";
  aHome.className = "text-blue-600 hover:underline";
  aHome.textContent = "Home";

  nav.appendChild(aHome);
  return nav;
};
