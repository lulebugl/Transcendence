// src/pages/TestApi.tsx
import { useState } from "react";
import { api } from "../api/api"; // your api() wrapper

export default function TestApi() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);


  const fetchMe = async () => {
    setError(null);
    try {
      const res = await api("/api/users/me"); // uses access token + refresh
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUserData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test API Wrapper</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mr-2"
        />
      </div>

      <div className="mb-4">
        <button onClick={fetchMe} className="bg-green-500 text-white p-2 rounded">
          Fetch /api/users/me
        </button>
      </div>

      {userData && (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(userData, null, 2)}
        </pre>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
