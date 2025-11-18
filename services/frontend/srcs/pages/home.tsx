import MainLayout from "../components/main-layout";
import Sandbox from "../components/sandbox";

const Home = () => {
  return (
    <MainLayout>
      <Sandbox>
        <h1 className="text-3xl font-bold">Welcome to Transcendence</h1>
        <p className="text-gray-600 mt-2">Your 3D Pong game awaits!</p>
        <a
          href="https://local.drizzle.studio"
          className="text-blue-500 hover:text-blue-700"
        >
          Drizzle Studio
        </a>
      </Sandbox>
    </MainLayout>	
  );
};

export default Home;
