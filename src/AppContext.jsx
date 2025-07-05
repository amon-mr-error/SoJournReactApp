import React, { createContext, useContext, useState } from "react";
import { removeToken } from "./api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleAuth = (userObj) => {
    const u = userObj || { role: "user" };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AppContext.Provider value={{ user, setUser, handleAuth, handleLogout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
