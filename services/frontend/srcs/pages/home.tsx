import { ButtonLink } from "@/lib/ui/button";
import { Layout } from "@/components/layout";
import { useState } from "react";

async function fetchResult(resultId: number) {
  const res = await fetch(`/api/blockchain/results/${resultId}`);
  if (!res.ok) throw new Error("Failed to fetch result");
  return res.json(); // { tournamentId, winnerId, timestamp }
}

const Home = () => {
  const [resultId, setResultId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchResult = async () => {
    setError("");
    setResult(null);

    const id = parseInt(resultId);
    if (isNaN(id)) {
      setError("Please enter a valid number");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchResult(id);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <h1 className="text-3xl font-bold">Welcome to Transcendence</h1>
        <p className="text-gray-600 mt-2">Your 3D Pong game awaits!</p>
        <div className="flex flex-row gap-4 py-8">
          <ButtonLink to="/auth/login" variant="default" size="lg">
            Login
          </ButtonLink>
          <ButtonLink to="/auth/signup" variant="default" size="lg">
            Signup
          </ButtonLink>
        </div>

        <div className="mt-8 w-full max-w-md">
          <div className="flex flex-col gap-4 p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold">Fetch Result</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={resultId}
                onChange={(e) => setResultId(e.target.value)}
                placeholder="Enter result ID"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleFetchResult}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Fetch"}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                {error}
              </div>
            )}

            {result && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="font-semibold mb-2">Result:</p>
                <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
