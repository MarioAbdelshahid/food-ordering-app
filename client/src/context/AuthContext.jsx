import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const getInitialUser = () => {
  const savedUser = localStorage.getItem("foodUser");

  if (savedUser) {
    return JSON.parse(savedUser);
  }

  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = (userData) => {
    localStorage.setItem("foodUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("foodUser");
    setUser(null);
  };

  const authHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}