import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignUpForm } from "@/features/auth/SignUpForm";

export const Signup = () => {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
};
