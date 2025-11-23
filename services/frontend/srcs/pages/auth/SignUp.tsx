import { Layout } from "@/components/layout";
import SignUpForm from "@/features/auth/SignUpForm";

const Signup = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        
        {/* Ambient Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
