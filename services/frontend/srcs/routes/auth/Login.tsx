import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "./LoginForm";

export const Login = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
