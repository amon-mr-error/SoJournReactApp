import React from "react";
import { useAppContext } from "../AppContext";

const AdventureDashboard = () => {
  const { user } = useAppContext();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Adventure Dashboard</h1>
      <p>
        {user?.role === "admin"
          ? "Welcome, admin! You can manage all adventures and categories."
          : user?.role === "adventurer"
          ? "Welcome, adventurer! Manage your adventures or explore new ones."
          : "Welcome! Explore adventures."}
      </p>
    </div>
  );
};

export default AdventureDashboard;