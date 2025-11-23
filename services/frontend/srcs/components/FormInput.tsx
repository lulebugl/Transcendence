import { ComponentProps, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldError } from "@/lib/ui/Field";
import { Input } from "@/lib/ui/Input";

interface FormInputProps extends ComponentProps<typeof Input> {
  label: string;
  labelRight?: ReactNode;
  error?: string;
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
  className,
  ...props 
}: FormInputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : "");

  return (
    <Field invalid={!!error}>
      <div className="flex justify-between items-center">
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        {labelRight}
      </div>
      <FieldContent>
        <Input 
          id={inputId} 
          icon={icon} 
          className={error ? "border-red-500/50 focus:border-red-500" : className}
          {...props} 
        />
      </FieldContent>
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{error}</FieldError>
    </Field>
  );
}
