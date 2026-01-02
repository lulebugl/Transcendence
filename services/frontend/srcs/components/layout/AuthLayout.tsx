import { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Layout } from "./Layout";

interface AuthLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  glowColor?: "primary" | "blue";
}

export const AuthLayout = ({
  children,
  glowColor = "primary",
}: AuthLayoutProps) => {
  const glowClass = glowColor === "blue" ? "bg-blue-500/5" : "bg-primary/5";

  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-6">
        {/* Ambient Background Effects */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${glowClass} rounded-full blur-[120px] pointer-events-none`}
        />

        <div className="relative w-full max-w-md">
          {/* Decorative vertical line */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-transparent to-primary/50" />

          {children}

          {/* Decorative Footer */}
          <div className="mt-8 flex justify-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Encrypted
            </span>
            <span>•</span>
            <span>Secure V.2.0</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};
