import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RenterDashboard from "./Dashboard";
import AdminRentalBookingsPage from "./bookings/AdminRentalBookingsPage";
import RenterNavBar from "./RenterNavBar";
import MyRentalsPage from "./MyRentalsPage";
import RentalDetailPage from "./RentalDetailPage";

const RenterLayout = ({ user }) => {
  // Allow access if user is renter or admin
  if (!user || (user.role !== "renter" && user.role !== "admin")) {
    return <Navigate to='/login' replace />;
  }
  return (
    <div className='min-h-screen bg-gray-50 p-2 sm:p-6'>
      <RenterNavBar user={user} />
      <div className='max-w-6xl mx-auto'>
        <Routes>
          <Route path='dashboard' element={<RenterDashboard user={user} />} />
          <Route path='my-rentals' element={<MyRentalsPage user={user} />} />
          <Route path='my-rentals/:id' element={<RentalDetailPage />} />
          {user.role === "admin" && (
            <Route
              path='admin-bookings'
              element={<AdminRentalBookingsPage />}
            />
          )}
          <Route path='*' element={<Navigate to='/renter/dashboard' />} />
        </Routes>
      </div>
    </div>
  );
};

export default RenterLayout;
