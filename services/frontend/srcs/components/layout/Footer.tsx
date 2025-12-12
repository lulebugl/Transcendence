import { Link } from "react-router";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5">
      <div className="px-6 py-4 md:py-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <span className="text-xs font-mono text-secondary-foreground">
            © {currentYear} Transcendence
            <span className="text-secondary-foreground/40 pl-5">·</span>
          </span>

          <nav className="flex items-center gap-5 md:gap-8">
            <Link
              to="/terms-of-service"
              className="text-xs font-mono text-secondary-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-secondary-foreground/40">·</span>
            <Link
              to="/privacy-policy"
              className="text-xs font-mono text-secondary-foreground hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
