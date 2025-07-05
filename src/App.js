import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import LandingPage from "./LandingPage";
import LocalMarketLayout from "./localmarket/LocalMarketLayout";
import AdventureLayout from "./adventure/AdventureLayout";
import RenterLayout from "./renter/RenterLayout";
import { AppProvider, useAppContext } from "./AppContext";
import { getToken } from "./api";

const ProtectedRoute = ({ user, children }) => {
  if (!getToken() || !user) return <Navigate to='/login' replace />;
  return children;
};

const AppRoutes = () => {
  const { user, handleAuth, handleLogout } = useAppContext();
  return (
    <Routes>
      <Route
        path='/'
        element={
          <LandingPage
            onLogin={() => (window.location.href = "/login")}
            onGetStarted={() => (window.location.href = "/dashboard")}
          />
        }
      />
      <Route path='/login' element={<AuthPage onAuth={handleAuth} />} />
      <Route path='/admin/select-role' element={<AdminRoleSelect />} />
      <Route
        path='/localmarket/*'
        element={
          <ProtectedRoute user={user}>
            <LocalMarketLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path='/adventure/*'
        element={
          <ProtectedRoute user={user}>
            <AdventureLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path='/renter/*'
        element={
          <ProtectedRoute user={user}>
            <RenterLayout user={user} />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  );
};

const AdminRoleSelect = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Role Selection</h1>
      <p>Choose which dashboard to access:</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button
          onClick={() => navigate("/localmarket/dashboard")}
          style={{
            padding: "1rem 2rem",
            background: "#2c5364",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Vendor Dashboard
        </button>
        <button
          onClick={() => navigate("/adventure/dashboard")}
          style={{
            padding: "1rem 2rem",
            background: "#0f2027",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Adventure Dashboard
        </button>
        <button
          onClick={() => navigate("/renter/dashboard")}
          style={{
            padding: "1rem 2rem",
            background: "#1e3c72",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Renter Dashboard
        </button>
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
);

export default App;
