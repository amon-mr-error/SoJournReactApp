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

  if (error) return <div className="error">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}</h2>
      <p><b>Role:</b> {user.role}</p>
      <p><b>Mobile:</b> {user.mobile}</p>
      <p><b>Address:</b> {user.address}</p>
      <button onClick={() => { removeToken(); onLogout(); }}>Logout</button>
    </div>
  );
};

export default Dashboard;