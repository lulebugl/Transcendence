import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { LogIn, LogOut, Settings, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MobileMenu } from "./mobile-menu";
import { UserAvatar } from "@/components/UserAvatar";

const NAV_ITEMS = [
  { label: "Play", path: "/lobby" },
  { label: "Tournaments", path: "/tournaments" },
  { label: "Leaderboard", path: "/leaderboard" },
//   ...(import.meta.env.DEV ? [{ label: "Dev-Hub", path: "/dev-hub" }] : []),
];

export const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="relative px-6 h-20 flex items-center justify-between">
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

          {/* Center Nav - Desktop */}
		  {/* translate-x-[40%] is to center the nav 
		    * it might need to be adjusted based on the number of items in the nav
		  */}
          <nav className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-[40%]">
            {NAV_ITEMS.map((item) => {
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

          <div className="flex items-center gap-3">
            <UserSection />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        navItems={NAV_ITEMS}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={location.pathname}
      />
    </>
  );
};

const UserSection = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <UserSectionSkeleton />;
  }

  if (!user) {
    return <GuestSection />;
  }

  return (
    <div className="relative flex items-center gap-4">
      <Link
        to="/profile"
        className="flex items-center gap-4 group cursor-pointer"
        aria-label={`View ${user.username}'s profile`}
      >
        <div className="flex flex-col items-end text-right">
          <span className="text-sm font-medium font-mono group-hover:text-primary transition-colors">
            {user.username}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-primary group-hover:text-primary/80 transition-colors">
            Lv.42
          </span>
        </div>
        <UserAvatar
          username={user.username}
          avatarUrl={user.avatar_url}
          className="grayscale-25 group-hover:grayscale-0"
        />
      </Link>

      <div className="hidden md:flex items-center gap-3">
        <Link
          to="/settings"
          aria-label="Settings"
          className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
        >
          <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <button
          onClick={logout}
          aria-label="Logout"
          className="text-[10px] cursor-pointer uppercase tracking-widest p-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {/* Logout */}
        </button>
      </div>
    </div>
  );
};

const UserSectionSkeleton = () => (
  <div className="relative hidden md:flex items-center gap-4 animate-pulse">
    <div className="flex flex-col items-end gap-1.5">
      <div className="h-4 w-24 bg-white/10 rounded" />
      <div className="h-3 w-16 bg-white/5 rounded" />
    </div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/10" />
      <div className="w-8 h-8 rounded-full bg-white/5" />
      <div className="w-20 h-8 rounded-full bg-white/5" />
    </div>
  </div>
);

const GuestSection = () => (
  <div className="relative flex items-center gap-4">
    <div className="hidden md:flex flex-col items-end text-right">
      <span className="text-sm font-medium font-mono text-muted-foreground">
        GUEST_PILOT
      </span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
        // UNAUTHORIZED
      </span>
    </div>
    <div className="flex items-center gap-3">
      <div className="hidden md:flex w-10 h-10 rounded-full border border-dashed border-white/15 items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
        AI
      </div>
      <Link
        to="/auth/login"
        className="hidden md:flex text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 items-center gap-2"
      >
        <LogIn className="w-3 h-3" />
        Login
      </Link>
    </div>
  </div>
);
