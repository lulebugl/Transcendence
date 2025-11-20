import { Link } from "react-router";

export const Navbar = () => {
	return (
	  <nav className="w-full bg-white/10 backdrop-blur-sm border-b border-white/20">
		<div className="container mx-auto px-4 py-3">
		  <div className="flex items-center justify-between">
			<Link to="/" className="text-xl font-semibold text-white">Transcendence</Link>
			<div className="flex gap-4">
			  <Link to="/pong" className="text-white hover:text-gray-300">Pong</Link>
			  <Link to="/test" className="text-white hover:text-gray-300">Test</Link>
			  <Link to="/sandbox" className="text-white hover:text-gray-300">Sandbox</Link>
			  <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
			</div>
		  </div>
		</div>
	  </nav>
	);
  };

const MainLayout = ({ children, backgroundImage = true }: { children: React.ReactNode, backgroundImage?: boolean }) => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center" 
      style={{
        backgroundImage: backgroundImage ? "url('/lab.jpg')" : "transparent",
      }}
      aria-label="Page background"
    >
      <div className="bg-black/20 min-h-screen w-full flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
