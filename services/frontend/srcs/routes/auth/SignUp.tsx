import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignUpForm } from "./SignUpForm";

export const Signup = () => {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
};
