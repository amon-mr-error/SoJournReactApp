import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, Link, useLocation } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import Dashboard from "./components/Dashboard";
import UsersPage from "./components/UsersPage";
import CategoriesPage from "./components/CategoriesPage";
import ProductsPage from "./components/ProductsPage";
import OrdersPage from "./components/OrdersPage";
import HealthPage from "./components/HealthPage";
import { getToken, removeToken } from "./api";
import { ShoppingCart, User } from "lucide-react";
import logo from "./auth/logo.png";
import LandingPage from "./LandingPage";
import { Menu, X } from "lucide-react";

const ProtectedRoute = ({ user, children }) => {
  if (!getToken() || !user) return <Navigate to="/login" replace />;
  return children;
};
 
const AppLayout = ({ user, onLogout }) => {
  const isAdmin = user?.role === "admin";
  const location = useLocation();
  const path = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    ...(isAdmin ? [{ to: "/users", label: "Users" }] : []),
    { to: "/categories", label: "Categories" },
    { to: "/products", label: "Products" },
    { to: "/health", label: "Health" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Nav */}
      <nav className="bg-blue-900 text-white px-3 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 relative">
        <div className="flex items-center w-full">
          <Link
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            to="/dashboard"
          >
            <img src={logo} alt="Shojourn Logo" className="h-8 w-8" />
            <span className="text-lg sm:text-2xl font-bold">SoJourn Express</span>
          </Link>
          {/* Hamburger menu for mobile */}
          <button
            className="sm:hidden ml-auto"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
        {/* Desktop nav actions */}
        <div className="hidden sm:flex sm:ml-auto items-center gap-4">
          <Link className="hover:bg-blue-800 px-3 py-2 rounded" to="/dashboard">
            <User className="inline mr-1" size={18} /> Account
          </Link>
          <Link className="hover:bg-blue-800 px-3 py-2 rounded" to="/orders">
            <ShoppingCart className="inline mr-1" size={18} /> Orders
          </Link>
          <button
            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Secondary Nav (desktop only) */}
      <div className="bg-white shadow gap-2 sm:gap-4 px-2 sm:px-6 py-2 overflow-x-auto whitespace-nowrap text-xs sm:text-sm hidden sm:flex">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            className={`px-3 py-2 rounded ${path === link.to ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
            to={link.to}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="bg-white w-64 max-w-full h-full shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-bold text-blue-900 text-lg">Menu</span>
              <button
                className="text-blue-900"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-4 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded ${path === link.to ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/orders"
                className="px-3 py-2 rounded text-blue-900 hover:bg-blue-100 flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingCart className="inline mr-1" size={18} /> Orders
              </Link>
              <button
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold mt-2"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
              >
                Logout
              </button>
            </nav>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-full sm:max-w-7xl mx-auto mt-4 sm:mt-6 p-2 sm:p-4">
        <Routes>
          <Route path="/dashboard" element={<Dashboard onLogout={onLogout} />} />
          <Route path="/users" element={isAdmin ? <UsersPage user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/categories" element={<CategoriesPage user={user} />} />
          <Route path="/products" element={<ProductsPage user={user} />} />
          <Route path="/orders" element={<OrdersPage user={user} />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleAuth = (userObj) => setUser(userObj || { role: "user" });

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    setUser(null);
    //navigate("/"); // Redirect to landing page
    window.location.href = "/";
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onLogin={() => (window.location.href = "/login")}
            onGetStarted={() => (window.location.href = "/dashboard")}
          />
        }
      />
      <Route path="/login" element={<AuthPage onAuth={handleAuth} />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;