import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message: string | null;
  className?: string;
}

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-xs uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2",
        className
      )}
    >
      <ShieldAlert className="w-4 h-4 shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

