import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

interface FieldProps extends React.ComponentProps<"div"> {
  orientation?: "vertical" | "horizontal";
  invalid?: boolean;
  disabled?: boolean;
}

export function Field({
  className,
  orientation = "vertical",
  invalid = false,
  disabled = false,
  ...props
}: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      data-invalid={invalid}
      data-disabled={disabled}
      className={cn(
        "group/field flex w-full gap-2",
        orientation === "vertical"
          ? "flex-col *:w-full"
          : "flex-row items-center *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:items-start",
        invalid && "text-destructive",
        className
      )}
      {...props}
    />
  );
}

export function FieldContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      )}
      {...props}
    />
  );
}

export function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium text-white/80 ml-1",
        "flex w-fit gap-2 leading-snug",
        "group-data-[disabled=true]/field:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "ml-1 text-muted-foreground text-xs leading-normal font-normal",
        "group-has-data-[orientation=horizontal]/field:text-balance",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

export function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  if (!children) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal ml-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function FieldSuccess({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  if (!children) return null;

  return (
    <div 
	className={cn("text-emerald-600 ml-1", className)}
	data-slot="field-success"
	{...props}>
      {children}
    </div>
  );
}

