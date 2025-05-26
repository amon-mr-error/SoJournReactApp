// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import AuthPage from "./auth/AuthPage";
// import Dashboard from "./components/Dashboard";
// import UsersPage from "./components/UsersPage";
// import CategoriesPage from "./components/CategoriesPage";
// import ProductsPage from "./components/ProductsPage";
// import OrdersPage from "./components/OrdersPage";
// import HealthPage from "./components/HealthPage";
// import { getToken, removeToken } from "./api";
// import { ShoppingCart, User } from "lucide-react";
// import logo from "./auth/logo.png";
// import LandingPage from "./LandingPage";

// const App = () => {
//   const [showLanding, setShowLanding] = useState(true);
//   const [ authRole, setAuthRole ] = useState(null);
//   const [user, setUser] = useState(null);
//   const [page, setPage] = useState("dashboard");

//   if (showLanding) {
//     return ( <LandingPage
//         onLogin={() => { setAuthRole("admin"); setShowLanding(false); }}
//       />
//     );
//   }

//   const handleAuth = (userObj) => {
//     setUser(userObj || { role: "user" });
//   };

//   const handleLogout = () => {
//     removeToken();
//     localStorage.removeItem("user");
//     setUser(null);
//     setShowLanding(true); // Return to landing
//   };

//   if (!getToken() || !user) {
//     return <AuthPage onAuth={handleAuth} />;
//   }

//   const isAdmin = user.role === "admin";

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans">
//       {/* Top Nav */}
//       <nav className="bg-blue-900 text-white px-6 py-3 flex items-center gap-4">
//         <div
//           className="flex items-center gap-3 cursor-pointer"
//           onClick={() => setPage("dashboard")}
//         >
//           <img src={logo} alt="Shojourn Logo" className="h-8 w-8" />
//           <span className="text-2xl font-bold">Shojourn Express</span>
//         </div>

//         <div className="ml-auto flex items-center gap-4">
//           <button
//             className="hover:bg-blue-800 px-3 py-2 rounded"
//             onClick={() => setPage("dashboard")}
//           >
//             <User className="inline mr-1" size={18} /> Account
//           </button>
//           <button
//             className="hover:bg-blue-800 px-3 py-2 rounded"
//             onClick={() => setPage("orders")}
//           >
//             <ShoppingCart className="inline mr-1" size={18} /> Orders
//           </button>
//           <button
//             className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Secondary Nav */}
//       <div className="bg-white shadow flex gap-4 px-6 py-2 overflow-x-auto whitespace-nowrap text-sm">
//         <button
//           className={`px-4 py-2 rounded ${page === "dashboard" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
//           onClick={() => setPage("dashboard")}
//         >
//           Dashboard
//         </button>
//         {isAdmin && (
//           <button
//             className={`px-4 py-2 rounded ${page === "users" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
//             onClick={() => setPage("users")}
//           >
//             Users
//           </button>
//         )}
//         <button
//           className={`px-4 py-2 rounded ${page === "categories" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
//           onClick={() => setPage("categories")}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${page === "products" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
//           onClick={() => setPage("products")}
//         >
//           Products
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${page === "health" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`}
//           onClick={() => setPage("health")}
//         >
//           Health
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto mt-6 p-4">
        
//         {page === "dashboard" && <Dashboard onLogout={handleLogout} />}
//         {page === "users" && isAdmin && <UsersPage user={user} />}
//         {page === "categories" && <CategoriesPage user={user} />}
//         {page === "products" && <ProductsPage user={user} />}
//         {page === "orders" && <OrdersPage user={user} />}
//         {page === "health" && <HealthPage />}
//       </div>
//     </div>
//   );
// };

// export default App;
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

const ProtectedRoute = ({ user, children }) => {
  if (!getToken() || !user) return <Navigate to="/login" replace />;
  return children;
};

const AppLayout = ({ user, onLogout }) => {
  const isAdmin = user?.role === "admin";
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Nav */}
      <nav className="bg-blue-900 text-white px-6 py-3 flex items-center gap-4">
        <Link className="flex items-center gap-3 cursor-pointer" to="/dashboard">
          <img src={logo} alt="Shojourn Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold">SoJourn Express</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
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

      {/* Secondary Nav */}
      <div className="bg-white shadow flex gap-4 px-6 py-2 overflow-x-auto whitespace-nowrap text-sm">
        <Link className={`px-4 py-2 rounded ${path === "/dashboard" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`} to="/dashboard">
          Dashboard
        </Link>
        {isAdmin && (
          <Link className={`px-4 py-2 rounded ${path === "/users" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`} to="/users">
            Users
          </Link>
        )}
        <Link className={`px-4 py-2 rounded ${path === "/categories" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`} to="/categories">
          Categories
        </Link>
        <Link className={`px-4 py-2 rounded ${path === "/products" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`} to="/products">
          Products
        </Link>
        <Link className={`px-4 py-2 rounded ${path === "/health" ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-100"}`} to="/health">
          Health
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-6 p-4">
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