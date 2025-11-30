import { useRef } from "react";
import { Input } from "../ui";
import { FormInput } from "./FormInput";
import { cn } from "@/lib/utils";

interface OtpCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  autoSubmit?: boolean;
  className?: string;
}

export const OtpCodeInput = ({
  value,
  onChange,
  autoFocus = false,
  autoSubmit = false,
  className,
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
    <Input
      ref={inputRef}
	  name="otp"
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={6}
      value={value}
      onChange={handleChange}
      placeholder="000000"
      autoComplete="one-time-code"
      autoFocus={autoFocus}
      className={cn("w-64 text-center tracking-[0.5em] text-lg font-mono", className)}
      aria-label="Enter 6-digit verification code"
    />
  );
};
