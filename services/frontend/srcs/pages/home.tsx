import Background from '../components/background';
import { Navbar } from '../components/navbar';

const Home = () => {
  return (
	<Background>
		<div className="p-6 space-y-4">
			<Navbar />
			<h1 className="text-3xl font-bold text-white">Welcome to Transcendence</h1>
			<p className="text-gray-600 mt-2">Your 3D Pong game awaits!</p>
			<a href="https://local.drizzle.studio" className="text-blue-500 hover:text-blue-700">Drizzle Studio</a>
		</div>
	</Background>
  );
};

export default Home;
