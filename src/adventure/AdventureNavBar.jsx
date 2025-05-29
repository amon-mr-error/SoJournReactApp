import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../AppContext";

const navs = [
  { to: "/adventure/explore", label: "Explore", roles: ["admin", "adventurer", "public"] },
  { to: "/adventure/adventures", label: "Manage Adventures", roles: ["admin", "adventurer"] },
  { to: "/adventure/my-adventures", label: "My Adventures", roles: ["admin", "adventurer"] },
  { to: "/adventure/categories", label: "Manage Categories", roles: ["admin"] },
  { to: "/adventure/admin-bookings", label: "All Bookings", roles: ["admin"] },
  { to: "/adventure/dashboard", label: "Dashboard", roles: ["admin", "adventurer"] },
];

const AdventureNavBar = () => {
  const { user, handleLogout } = useAppContext();
  const location = useLocation();
  const role = user?.role || "public";

  return (
    <nav className="flex flex-wrap gap-2 mb-6 items-center">
      {navs
        .filter((n) => n.roles.includes(role))
        .map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={`px-4 py-2 rounded font-medium ${
              location.pathname.startsWith(n.to)
                ? "bg-blue-900 text-white"
                : "bg-gray-200 text-blue-900 hover:bg-blue-100"
            }`}
          >
            {n.label}
          </Link>
        ))}
      {user && (
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded font-medium bg-red-600 text-white hover:bg-red-700 ml-auto"
          style={{ marginLeft: "auto" }}
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default AdventureNavBar;