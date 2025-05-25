import React, { useEffect, useState } from "react";
import api, { handleApiError } from "../api";

const HealthPage = () => {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/health")
      .then((res) => setHealth(res.data))
      .catch((err) => setError(handleApiError(err)));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-8 mb-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Health Check</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{error}</div>}
      {health ? (
        <pre className="bg-blue-50 rounded p-4">{JSON.stringify(health, null, 2)}</pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default HealthPage;