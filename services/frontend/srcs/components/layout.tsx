import { Link } from "react-router";
import { LogIn, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export const Navbar = () => {
  const { user, logout, isLoading } = useAuth();

  const navItems = [
    { label: "Overview", path: "/" },
    { label: "Play", path: "/pong" },
    { label: "Tournaments", path: "/tournaments" },
  ];

  // @ts-expect-error: Vite injects the env at runtime
  if (import.meta.env.DEV) {
    navItems.push({ label: "Dev-Hub", path: "/dev-hub" });
  }

  return (
    <>
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
                  user ? "" : "text-muted-foreground"
                }`}
              >
                {user ? user.username : "GUEST_PILOT"}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider ${
                  user ? "text-primary" : "text-muted-foreground/80"
                }`}
              >
                {user ? `Lv.42` : "// UNAUTHORIZED"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative group cursor-pointer">
                  <img
                    src={user.avatar_url}
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
			  {/* Settings */}
              {user ? (
                <Link
                  to="/settings"
                  className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
                >
                  <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ) : null}
			  {/* Login/Logout Button */}
              {user ? (
                <button
                  onClick={() => logout()}
                  className="text-[10px] cursor-pointer uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth/login"
                  className="text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <LogIn className="w-3 h-3" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 relative pt-20 px-12">{children}</main>
    </div>
  );
};
