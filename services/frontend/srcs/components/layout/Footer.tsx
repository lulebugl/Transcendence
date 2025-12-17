import { Link } from "react-router";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5">
      <div className="px-6 py-4 md:py-4">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <span className="text-xs text-foreground/70">
            © {currentYear} Transcendence
            <span className="text-foreground/40 pl-5">·</span>
          </span>

          <nav className="flex items-center justify-center gap-5 md:gap-8">
            <Link
              to="/terms-of-service"
              className="text-xs text-foreground/70 hover:text-foreground"
            >
              Terms of Service
            </Link>
            <span className="text-foreground/40">·</span>
            <Link
              to="/privacy-policy"
              className="text-xs text-foreground/70 hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
