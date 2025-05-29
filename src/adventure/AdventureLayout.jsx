import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdventureNavBar from "./AdventureNavBar";
import AdventureDashboard from "./Dashboard";
import AdventuresPage from "./AdventuresPage";
import AdventureList from "./AdventureList";
import AdventureView from "./AdventureView";
import MyAdventures from "./MyAdventures";
import AdventureCategoriesPage from "./AdventureCategoriesPage";
import AdventureBookingsPage from "./AdventureBookingsPage";
import AdminAdventureBookingsPage from "./AdminAdventureBookingsPage";

const AdventureLayout = () => (
  <div className="min-h-screen bg-gray-50 p-2 sm:p-6">
    <div className="max-w-6xl mx-auto">
      <AdventureNavBar />
      <Routes>
        <Route path="dashboard" element={<AdventureDashboard />} />
        <Route path="adventures" element={<AdventuresPage />} />
        <Route path="explore" element={<AdventureList />} />
        <Route path="adventures/:id" element={<AdventureView />} />
        <Route path="my-adventures" element={<MyAdventures />} />
        <Route path="categories" element={<AdventureCategoriesPage />} />
        <Route path="adventures/:adventureId/bookings" element={<AdventureBookingsPage />} />
        <Route path="admin-bookings" element={<AdminAdventureBookingsPage />} />
        <Route path="*" element={<Navigate to="/adventure/dashboard" />} />
      </Routes>
    </div>
  </div>
);

export default AdventureLayout;