import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { LogIn, LogOut, Settings, Menu, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { MobileMenu } from "./mobile-menu";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 relative pt-20 md:px-12 px-4 w-full">{children}</main>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const NAV_ITEMS = [
  { label: "Overview", path: "/" },
  { label: "Play", path: "/pong" },
  { label: "Tournaments", path: "/tournaments" },
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
        <div className="mx-auto px-6 h-20 flex items-center justify-between">
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
          <nav className="hidden md:flex items-center justify-center gap-12">
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

            {/* Mobile Menu Toggle */}
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
        <UserAvatar username={user.username} avatarUrl={user.avatar_url} />
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
          className="text-[10px] cursor-pointer uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
        >
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
}

const UserAvatar = ({ username, avatarUrl }: UserAvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const firstLetter = username.charAt(0).toUpperCase();

  const showImage = avatarUrl && !hasImageError;

  return (
    <div className="relative group cursor-pointer">
      {showImage ? (
        <img
          src={avatarUrl}
          alt={`${username}'s avatar`}
          onError={() => setHasImageError(true)}
          className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-primary/25 transition-all duration-500">
          {firstLetter}
        </div>
      )}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500/80 rounded-full border-2 border-background shadow-[0_0_10px_#10b981]" />
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
