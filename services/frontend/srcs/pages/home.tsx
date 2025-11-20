import { MainLayout } from "@/components/main-layout";

const Home = () => {
//   console.log(import.meta.env.DEV);
  return (
    <MainLayout>
        <h1 className="text-3xl font-bold">Welcome to Transcendence</h1>
        <p className="text-gray-600 mt-2">Your 3D Pong game awaits!</p>
        <a
          href="https://local.drizzle.studio"
          className="text-blue-500 hover:text-blue-700"
        >
          Drizzle Studio
        </a>
    </MainLayout>	
  );
};

export default Home;
