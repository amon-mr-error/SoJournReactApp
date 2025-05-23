import React, { useState } from "react";
import AuthPage from "./auth/AuthPage";
import Dashboard from "./components/Dashboard";
import UsersPage from "./components/UsersPage";
import CategoriesPage from "./components/CategoriesPage";
import ProductsPage from "./components/ProductsPage";
import { getToken, removeToken } from "./api";

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

  
  return (
    <div>
      <nav>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("users")}>Users</button>
        <button onClick={() => setPage("categories")}>Categories</button>
        <button onClick={() => setPage("products")}>Products</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <hr />
      {page === "dashboard" && <Dashboard onLogout={handleLogout} />}
      {page === "users" && <UsersPage user={user} />}
      {page === "categories" && <CategoriesPage user={user} />}
      {page === "products" && <ProductsPage user={user} />}
    </div>
  );
};

export default App;