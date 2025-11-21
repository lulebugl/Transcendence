import { useEffect, useState } from "react";
import { Link, redirect } from "react-router";
import { ArrowRight, Lock, User, ShieldAlert } from "lucide-react";
import { MainLayout } from "@/components/main-layout";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(pseudo, password);
      redirect("/");
    } catch (error) {
      console.error("Login failed", error.message);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        {/* Ambient Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Decorative Header Line */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-transparent to-primary/50" />

          <div className="relative z-10 border border-white/5 bg-card/30 backdrop-blur-xl rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="p-8 text-center border-b border-white/5 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                <span className="text-[10px] font-mono text-primary tracking-[0.2em] uppercase">
                  Secure Gateway
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-white">
                SYSTEM // ACCESS
              </h1>
              <p className="text-sm text-muted-foreground font-light">
                Enter credentials to initialize connection.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                  Pilot Pseudo
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pt-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    className="mt-1.5 w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                    placeholder="IDENTIFIER"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                    Passcode
                  </label>
                  {/* TODO: this maybe can be a way to connect with otp that would allow to change password or something like that*/}
                  {/* TODO: this maybe can be a way to connect with otp that would allow to change password or something like that*/}
                  {/* TODO: this maybe can be a way to connect with otp that would allow to change password or something like that*/}
                  <Link
                    to="/forgot-password"
                    className="text-[10px] text-primary hover:text-white transition-colors uppercase tracking-wider"
                  >
                    Lost Key?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="group relative w-full py-4 bg-primary text-primary-foreground text-sm font-bold tracking-[0.2em] uppercase clip-path-button overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_var(--color-primary)]">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-3">
                  Initialize{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="p-6 bg-black/20 border-t border-white/5 text-center">
              <p className="text-xs text-muted-foreground">
                No identification found? <br />
                <Link
                  to="/auth/signup"
                  className="text-primary hover:text-white transition-colors font-medium uppercase tracking-wider mt-2 inline-block border-b border-primary/20 hover:border-primary"
                >
                  Create Pilot Profile
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Encrypted
            </span>
            <span>•</span>
            <span>Secure V.2.0</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
