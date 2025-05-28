import React, { useEffect, useState } from "react";
import api, { handleApiError, removeToken } from "../api";

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/users/me")
      .then((res) => setUser(res.data))
      .catch((err) => setError(handleApiError(err)));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-blue-900 text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Dashboard</h2>
          
        </div>

        <div className="space-y-4 text-blue-900">
          <div>
            <span className="font-semibold text-gray-600">Name:</span>{" "}
            <span className="text-lg font-medium">{user.name}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Role:</span>{" "}
            <span className="capitalize">{user.role}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Mobile:</span>{" "}
            <span>{user.mobile}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Address:</span>{" "}
            <span>{user.address || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
