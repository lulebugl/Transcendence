import { ComponentProps, ReactNode } from "react";
import { Check, LucideIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface FormInputProps extends ComponentProps<typeof Input> {
  label: string;
  labelRight?: ReactNode;
  error?: string;
  isSuccess?: boolean;
  description?: string;
  icon?: LucideIcon;
}

export function FormInput({
  label,
  labelRight,
  error,
  isSuccess,
  description,
  icon,
  id,
  className,
  ...props
}: FormInputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : "");

  return (
    <Field invalid={!!error} className="relative group">
      <div className="flex justify-between items-center">
        <FieldLabel htmlFor={inputId} className="text-sm font-medium">{label}</FieldLabel>
        {labelRight}
      </div>
      <FieldContent>
        <div className="relative">
          <Input
            id={inputId}
            icon={icon}
            className={cn(
              error
                ? "border-red-500/50 focus:border-red-500"
                : isSuccess
                ? "border-green-500/50 focus-visible:border-green-500"
                : className
            )}
            {...props}
          />
		  {/* 
		  ** Success notif in the input
		  ** the elements exist even if not visible to allow the animation to work
		  ** but it impact every Form input so maybe update it later
		  ** if needed
		  */}
          <div
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300",
              isSuccess
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            )}
          >
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full">
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                Saved
              </span>
            </div>
          </div>
        </div>
      </FieldContent>
      {description && !error && (
        <FieldDescription>{description}</FieldDescription>
      )}
      <FieldError>{error}</FieldError>
    </Field>
  );
}
