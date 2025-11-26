import { ShieldAlert } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { LoginForm } from "@/features/auth/LoginForm";

export const Login = () => {
  return (
    <Layout>	
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-md">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-transparent to-primary/50" />

          <LoginForm />

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
