import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Lock, User } from "lucide-react";
import { FormInput } from "@/components/forms/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { FormError } from "@/components/forms/FormError";

export const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { signup, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signup(username, password);
      navigate("/");
    } catch (err) {
      const error = err as Error;

      const message = error.message || "Registration failed";
      const newErrors: Record<string, string> = {};
      const lowerMsg = message.toLowerCase();

      if (lowerMsg.includes("username")) {
        newErrors.username = message;
      } else if (lowerMsg.includes("password")) {
        newErrors.password = message;
      } else {
        newErrors.root = message;
      }

      setErrors(newErrors);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="relative z-10 border mt-20 border-white/5 bg-card/30 backdrop-blur-xl rounded-2xl overflow-hidden">
      <div className="p-8 text-center border-b border-white/5 space-y-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-50" />
        <h1 className="relative text-3xl font-bold tracking-tighter text-white">
          IDENTITY // CREATION
        </h1>
        <p className="relative text-sm text-muted-foreground font-light">
          Register a new pilot profile in the database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        <FormInput
          label="Username"
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username)
              setErrors((prev) => ({ ...prev, username: "" }));
          }}
          icon={User}
          placeholder="PILOT_01"
          error={errors.username}
          required
        />

        <FormInput
          label="Security Key"
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: "" }));
          }}
          icon={Lock}
          placeholder="••••••••"
          error={errors.password}
          description={
            !errors.password
              ? "Security Key must be 8 characters long."
              : undefined
          }
          required
        />

        <FormInput
          label="Confirm Security Key"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirmPassword}
          required
        />

        {errors.root && <FormError message={errors.root} />}
		
        <button
          type="submit"
          className="mt-4 group relative w-full py-4 bg-white/90 text-black text-sm font-bold tracking-[0.2em] uppercase clip-path-button overflow-hidden transition-all hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          <span className="relative flex items-center justify-center gap-3">
            Register Identity{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </form>

      <div className="p-6 bg-black/20 border-t border-white/5 text-center">
        <p className="text-xs text-muted-foreground">
          Already have clearance? <br />
          <Link
            to="/auth/login"
            className="text-white hover:text-primary transition-colors font-medium uppercase tracking-wider mt-2 inline-block border-b border-white/20 hover:border-primary"
          >
            Access System
          </Link>
        </p>
      </div>
    </div>
  );
};
