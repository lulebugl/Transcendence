import { ButtonLink } from "@/components/button";
import { MainLayout } from "@/components/main-layout";

const Home = () => {
//   console.log(import.meta.env.DEV);
  return (
    <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <h1 className="text-3xl font-bold">Welcome to Transcendence</h1>
        <p className="text-gray-600 mt-2">Your 3D Pong game awaits!</p>
		<div className="flex flex-row gap-4 py-8">
			<ButtonLink to="/auth/login" variant="default" size="lg">Login</ButtonLink>
			<ButtonLink to="/auth/signup" variant="default" size="lg">Signup</ButtonLink>
		</div>
        </div>
    </MainLayout>	
  );
};

export default Home;
