import React, { useState } from "react";
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

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const handleAuth = (userObj) => {
    setUser(userObj || { role: "user" });
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  if (!getToken() || !user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Nav */}
      <nav className="bg-blue-900 text-white px-6 py-3 flex items-center gap-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setPage("dashboard")}
        >
          <img src={logo} alt="Shojourn Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold">Shojourn Express</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button
            className="hover:bg-blue-800 px-3 py-2 rounded"
            onClick={() => setPage("dashboard")}
          >
            <User className="inline mr-1" size={18} /> Account
          </button>
          <button
            className="hover:bg-blue-800 px-3 py-2 rounded"
            onClick={() => setPage("orders")}
          >
            <ShoppingCart className="inline mr-1" size={18} /> Orders
          </button>
          <button
            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Secondary Nav */}
      <div className="bg-white shadow flex gap-4 px-6 py-2 overflow-x-auto whitespace-nowrap text-sm">
        <button
          className={`px-4 py-2 rounded ${page === "dashboard" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        {isAdmin && (
          <button
            className={`px-4 py-2 rounded ${page === "users" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
            onClick={() => setPage("users")}
          >
            Users
          </button>
        )}
        <button
          className={`px-4 py-2 rounded ${page === "categories" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
          onClick={() => setPage("categories")}
        >
          Categories
        </button>
        <button
          className={`px-4 py-2 rounded ${page === "products" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
          onClick={() => setPage("products")}
        >
          Products
        </button>
        <button
          className={`px-4 py-2 rounded ${page === "health" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
          onClick={() => setPage("health")}
        >
          Health
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-6 p-4">
        {page === "dashboard" && <Dashboard onLogout={handleLogout} />}
        {page === "users" && isAdmin && <UsersPage user={user} />}
        {page === "categories" && <CategoriesPage user={user} />}
        {page === "products" && <ProductsPage user={user} />}
        {page === "orders" && <OrdersPage user={user} />}
        {page === "health" && <HealthPage />}
      </div>
    </div>
  );
};

export default App;
