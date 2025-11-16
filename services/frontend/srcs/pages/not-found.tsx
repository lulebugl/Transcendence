import { Link } from 'react-router';
import Background from '../components/background';

const NotFound = () => {
  return (
	<Background>	
    <div className="p-6 space-y-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300">Page Not Found</h2>
        <p className="text-gray-400 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
	</Background>
  );
};

export default NotFound;

