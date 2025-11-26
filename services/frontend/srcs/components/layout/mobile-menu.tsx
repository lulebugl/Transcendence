import { useAuth } from "@/context/auth-context";
import { Link } from "react-router";
import { NAV_ITEMS } from "./layout";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  currentPath,
}: MobileMenuProps) => {
  const { user, logout } = useAuth();

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        className={`absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-3 px-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 rounded-lg ${
                  isActive
                    ? "text-foreground bg-white/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block py-3 px-4 text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all duration-300"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block py-3 px-4 text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all duration-300"
                >
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left py-3 px-4 text-sm font-medium tracking-widest uppercase text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="block py-3 px-4 text-sm font-medium tracking-widest uppercase text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
