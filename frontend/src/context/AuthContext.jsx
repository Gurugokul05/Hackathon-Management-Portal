import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await api.get("/auth/me");
        // Backend returns { user: userData, role: 'team'/'admin'/'staff', permissions: [...] }
        if (res.data.user) {
          const userData = res.data.user;
          const userRole = res.data.role || userData.role;
          const userPermissions =
            res.data.permissions || userData.permissions || [];
          setUser({
            ...userData,
            role: userRole,
            permissions: userPermissions,
          });
        } else {
          setUser(res.data); // Fallback if direct object
        }
      } catch (error) {

        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const loginTeam = async (teamId, email) => {
    const res = await api.post("/auth/login-team", { teamId, email });
    localStorage.setItem("token", res.data.token);
    setUser({ ...res.data.team, role: "team" });
    return res.data;
  };

  const loginAdmin = async (username, password) => {
    const res = await api.post("/auth/login-admin", { username, password });
    localStorage.setItem("token", res.data.token);
    setUser({ ...res.data.admin });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const registerTeam = async (data) => {
    const res = await api.post("/auth/register-team", data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginTeam,
        loginAdmin,
        logout,
        registerTeam,
        refreshUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
