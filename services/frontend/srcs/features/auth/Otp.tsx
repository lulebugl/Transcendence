import { FormInput } from "@/components/forms/FormInput";
import { ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { FormError } from "@/components/forms/FormError";

interface OtpProps {
  otp: string;
  setOtp: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const Otp = ({
  otp,
  setOtp,
  onSubmit,
  onBack,
  isLoading,
  error,
}: OtpProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
      if (value.length === 6) {
        setTimeout(() => {
          target.form?.requestSubmit();
        }, 0);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="relative z-10 border border-white/5 bg-card/30 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col">
        <OtpHeader />

        <form
          onSubmit={onSubmit}
          className="p-8 h-fit flex-1 flex flex-col justify-center space-y-6"
        >
          <FormInput
            label="Security Code"
            id="otp"
            value={otp}
            onChange={(e) => handleSubmit(e)}
            icon={KeyRound}
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="000000"
            autoFocus
            required
            className="text-center tracking-[0.5em] font-mono text-lg"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-4 bg-primary text-primary-foreground text-sm font-bold tracking-[0.2em] uppercase clip-path-button overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative flex items-center justify-center gap-3">
              {isLoading ? "Verifying..." : "Verify Access"}
              {!isLoading && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </span>
          </button>

          {error && <FormError message={error} />}
        </form>

        <div className="p-6 bg-black/20 border-t border-white/5 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-muted-foreground hover:text-white transition-colors text-xs flex items-center justify-center gap-2 w-full uppercase tracking-wider group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const OtpHeader = () => {
  return (
    <div className="p-8 text-center border-b border-white/5 space-y-2">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
        <span className="text-[10px] font-mono text-primary tracking-[0.2em] uppercase">
          Security Check
        </span>
      </div>
      <h1 className="text-3xl font-bold tracking-tighter text-white">
        TWO-FACTOR AUTHENTICATION
      </h1>
      <p className="text-sm text-muted-foreground font-light">
        Enter the code from your authenticator app.
      </p>
    </div>
  );
};
