import { useState, ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInput } from "./FormInput";

type PasswordInputProps = Omit<ComponentProps<typeof FormInput>, "type">;

export const PasswordInput = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <FormInput
        {...props}
        type={visible ? "text" : "password"}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-4 lg:top-10 top-7 text-muted-foreground hover:text-foreground transition-colors "
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};
