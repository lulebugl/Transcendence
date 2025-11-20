import { Link } from "react-router";
import { LogIn, LogOut } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

const Navbar = () => {
  const isLoggedIn = true;
  const user = CURRENT_USER;

  const toggleAuth = () => {
    console.log("toggleAuth");
  };

  const navItems = [
    { label: "Overview", path: "/" },
    { label: "Play", path: "/game" },
    { label: "Tournaments", path: "/tournaments" },
    { label: "Dev-Hub", path: "/devhub" },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 border border-white/20 rotate-45 transition-transform group-hover:rotate-90 duration-700" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            </div>
            <Link
              to="/"
              className="flex flex-col group cursor-pointer select-none"
            >
              <span className="font-bold tracking-[0.2em] text-sm uppercase text-primary group-hover:text-primary/80 transition-colors">
                Transcendence
              </span>
              <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">
                Sys.Ver.2.0
              </span>
            </Link>
          </div>
          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-medium tracking-widest uppercase transition-all duration-300 hover-underline py-2 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}

          <div className="relative flex items-center gap-4">
            <div className="flex flex-col items-end text-right">
              <span
                className={`text-sm font-medium font-mono ${
                  isLoggedIn ? "" : "text-muted-foreground"
                }`}
              >
                {isLoggedIn && user ? user.username : "GUEST_PILOT"}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider ${
                  isLoggedIn ? "text-primary" : "text-muted-foreground/80"
                }`}
              >
                {isLoggedIn && user ? `Lv.${user.level}` : "// UNAUTHORIZED"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn && user ? (
                <div className="relative group cursor-pointer">
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500/80 rounded-full border-2 border-background shadow-[0_0_10px_#10b981]"></div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full border border-dashed border-white/15 flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
                  AI
                </div>
              )}
              <button
                onClick={toggleAuth}
                className="text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                {isLoggedIn ? (
                  <>
                    <LogOut className="w-3 h-3" />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn className="w-3 h-3" />
                    Demo Login
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 relative pt-20">{children}</main>
    </div>
  );
};
