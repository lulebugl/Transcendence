import { ComponentProps, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldError,
  FieldSuccess,
} from "@/lib/ui/Field";
import { Input } from "@/lib/ui/Input";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FormInputProps extends ComponentProps<typeof Input> {
  label: string;
  labelRight?: ReactNode;
  error?: string;
  successField?: string;
  description?: string;
  icon?: LucideIcon;
}

export function FormInput({
  label,
  labelRight,
  error,
  description,
  icon,
  id,
  successField,
  className,
  ...props
}: FormInputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : "");

  const details = error ? <FieldError>{error}</FieldError>
  : successField ? <FieldSuccess>{successField}</FieldSuccess>
  : description ? <FieldDescription>{description}</FieldDescription>
  : null;

  return (
    <Field invalid={!!error}>
      <div className="flex justify-between items-center">
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        {labelRight}
      </div>
      <FieldContent>
        <div className="relative">
          <Input
            id={inputId}
            icon={icon}
            className={cn(
              "transition-all duration-300",
              error && "border-destructive focus-visible:ring-destructive/20",
              !error &&
                successField &&
                "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20 pr-10",
              className
            )}
            {...props}
          />

          <div
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300",
              successField
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-50 -rotate-90"
            )}
          >
            <div className="bg-green-500 rounded-full p-0.5 shadow-sm">
              <Check className="w-3 h-3 text-white stroke-3" />
            </div>
          </div>
        </div>
      </FieldContent>
      <div className="min-h-[20px] mt-1">{details}</div>
    </Field>
  );
}
