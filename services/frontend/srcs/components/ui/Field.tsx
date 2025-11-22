import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/Label"

interface FieldProps extends React.ComponentProps<"div"> {
  orientation?: "vertical" | "horizontal"
  invalid?: boolean
  disabled?: boolean
}

function Field({ 
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
        "group/field flex w-full gap-3",
        orientation === "vertical" 
          ? "flex-col *:w-full" 
          : "flex-row items-center *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:items-start",
        invalid && "text-destructive",
        className
      )}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "text-[10px] uppercase tracking-widest text-muted-foreground ml-1",
        "flex w-fit gap-2 leading-snug",
        "group-data-[disabled=true]/field:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ 
  className, 
  ...props 
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-sm leading-normal font-normal",
        "group-has-data-[orientation=horizontal]/field:text-balance",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function FieldError({ 
  className, 
  children,
  ...props 
}: React.ComponentProps<"div">) {
  if (!children) return null
  
  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Field, FieldContent, FieldLabel, FieldDescription, FieldError }
