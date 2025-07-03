import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/renter/dashboard", label: "Dashboard" },
  { to: "/renter/my-rentals", label: "My Rentals" },
  { to: "/renter/admin-bookings", label: "All Bookings", adminOnly: true },
];

const RenterNavBar = ({ user }) => {
  const location = useLocation();
  return (
    <nav
      style={{
        background: "#2c5364",
        color: "#fff",
        padding: "1rem 2rem",
        borderRadius: 12,
        marginBottom: 24,
        display: "flex",
        gap: 24,
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(44,83,100,0.08)",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
        SoJourn Rentals
      </span>
      {navLinks.map((link) => {
        if (link.adminOnly && user.role !== "admin") return null;
        return (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: location.pathname.startsWith(link.to) ? "#ffd700" : "#fff",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 16,
              padding: "0.5rem 1.2rem",
              borderRadius: 8,
              background: location.pathname.startsWith(link.to)
                ? "#0f2027"
                : "transparent",
              transition: "background 0.2s",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default RenterNavBar;
