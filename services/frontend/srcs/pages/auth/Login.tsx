import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/features/auth/LoginForm";

export const Login = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
