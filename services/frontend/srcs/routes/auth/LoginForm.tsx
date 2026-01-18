import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { ArrowRight, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FormInput } from "@/components/forms/FormInput";
import { Otp } from "./Otp";
import { FormError } from "@/components/forms/FormError";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { LoginResponse } from "@/api/types";
import { Button } from "@/components/ui";

export const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [require2fa, setRequire2fa] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // loading state

  const { login, user } = useAuth();

  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!identifier || !password.trim()) {
        setError("Identifier and password are required");
        return;
      }

	  if (password.length < 8) {
		setError("Invalid credentials.");
		return;
	  }

      const data = (await login(identifier, password)) as LoginResponse;
      if (data && "require2fa" in data) {
        setRequire2fa(true);
        setIsSubmitting(false);
        return;
      }

      navigate("/");
    } catch (err) {
      const error = err as Error;
      setPassword("");
      setError(error.message || "Login Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("must be 6 digits");
      setIsSubmitting(false);
      setOtp("");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await login(identifier, password, otp);
      navigate("/");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Verification Failed");
      setOtp("");
      setIsSubmitting(false);
    }
  };

  if (require2fa) {
    return (
      <Otp
        otp={otp}
        setOtp={(val) => {
          setOtp(val);
          if (error) setError(null);
        }}
        onSubmit={handleOtpSubmit}
        onBack={() => {
          setRequire2fa(false);
          setOtp("");
          setError(null);
        }}
        isLoading={isSubmitting}
        error={error}
      />
    );
  }

  // ADD loading state on the button
  // but maybe i will add it to the real button component once created
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

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <FormInput
          label="Pilot Pseudo or email"
          id="identifier"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (error) setError(null);
          }}
          icon={User}
          placeholder="IDENTIFIER"
          required
        />

        <PasswordInput
          label="Passcode"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(null);
          }}
          icon={Lock}
          placeholder="••••••••"
        //   labelRight={
        //     <Link
        //       to="/forgot-password"
        //       className="text-[10px] text-primary hover:text-white transition-colors uppercase tracking-wider"
        //     >
        //       Lost Key?
        //     </Link>
        //   }
          required
        />

        {error && <FormError message={error} />}
		
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="group relative w-full font-bold tracking-[0.2em] uppercase rounded-none"
        >
          Initialize{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
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
