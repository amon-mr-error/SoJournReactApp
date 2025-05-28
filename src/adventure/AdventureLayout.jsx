import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdventureDashboard from "./Dashboard";

const AdventureLayout = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fb", padding: "2rem" }}>
      <Routes>
        <Route path='dashboard' element={<AdventureDashboard />} />
        <Route path='*' element={<Navigate to='/adventure/dashboard' />} />
      </Routes>
    </div>
  );
};

export default AdventureLayout;
