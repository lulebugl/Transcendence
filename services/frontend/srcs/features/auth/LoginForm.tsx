import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Lock, User, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { FormInput } from "@/components/FormInput";

// TODO: add otp if activated
const Login = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const username = pseudo.trim();
      if (!username || !password.trim()) {
        setError("Username and password are required");
        return;
      }
      await login(username, password);
      navigate("/");
    } catch (err) {
      const error = err as Error;
      console.error("Login failed", error.message);
      setPassword("");
      setError(error.message || "Login Failed");
    }
  };

  return (
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
        <FormInput
            label="Pilot Pseudo"
            id="pseudo"
            value={pseudo}
            onChange={(e) => {
                setPseudo(e.target.value);
                if (error) setError(null);
            }}
            icon={User}
            placeholder="IDENTIFIER"
            required
        />

        <FormInput
            label="Passcode"
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
            }}
            icon={Lock}
            placeholder="••••••••"
            labelRight={
                <Link
                to="/forgot-password"
                className="text-[10px] text-primary hover:text-white transition-colors uppercase tracking-wider"
              >
                Lost Key?
              </Link>
            }
            required
        />

        <button
          type="submit"
          className="group relative w-full py-4 bg-primary text-primary-foreground text-sm font-bold tracking-[0.2em] uppercase clip-path-button overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_var(--color-primary)]"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative flex items-center justify-center gap-3">
            Initialize{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-xs uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
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
  );
};

export default Login;
