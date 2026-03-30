import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

// Hardcoded credentials (client-side demo only)
const VALID_CREDENTIALS = [
  { email: "admin",               password: "admin", name: "Admin User",    role: "Administrator" },
  { email: "admin@iot-console.com", password: "admin", name: "Admin User",  role: "Administrator" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("iot_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((email, password) => {
    const match = VALID_CREDENTIALS.find(
      c => c.email.toLowerCase() === email.toLowerCase().trim() && c.password === password
    );
    if (match) {
      const userData = { email: match.email, name: match.name, role: match.role };
      setUser(userData);
      sessionStorage.setItem("iot_user", JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: "Invalid email or password." };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("iot_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
