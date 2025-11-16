import { Link } from "react-router";


// I will create a proper layout and sandbox component later 
// but for now this will do.
const Sandbox = (props: { children: React.ReactNode, backgroundImage?: boolean, className?: string, HomeButton?: boolean }) => {
	return (
    <div
      className="w-full min-h-screen bg-cover bg-center" 
      style={{
        backgroundImage: props.backgroundImage !== false ? "url('/lab.jpg')" : "transparent",
      }}
      aria-label="Page background"
    >
      <div className="flex items-center justify-center">
        <div className={`relative bg-white rounded-xl shadow-lg h-full p-8 mt-24 border-2 border-white/30 max-w-xl w-full ${props.className}`}>
          {props.HomeButton !== false && <Link to="/" className="text-white bg-black rounded-md px-4 py-2 absolute top-4 right-4">Home</Link>}
		  {props.children}
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
