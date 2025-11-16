import { Navbar } from '../components/navbar';
import Sandbox from '../components/sandbox';

const TestSandbox = () => {
  return (
    <Sandbox>
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Sandbox</h1>
        <p className="text-gray-600 mt-2">This is a sandbox page.</p>
      </div>
    </Sandbox>
  );
};

export default TestSandbox;
