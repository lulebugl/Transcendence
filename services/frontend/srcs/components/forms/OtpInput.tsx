import { useRef } from "react";

interface OtpCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  autoSubmit?: boolean;
}

export const OtpCodeInput = ({
  value,
  onChange,
  autoFocus = false,
  autoSubmit = false,
}: OtpCodeInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange(digits);

    if (autoSubmit && digits.length === 6) {
      // Give React time to update state before submitting
      setTimeout(() => inputRef.current?.form?.requestSubmit(), 0);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={6}
      value={value}
      onChange={handleChange}
      placeholder="000000"
      autoComplete="one-time-code"
      autoFocus={autoFocus}
      className="w-48 text-center text-2xl tracking-[0.5em] font-mono bg-background border border-border rounded-lg py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      aria-label="Enter 6-digit verification code"
    />
  );
};
