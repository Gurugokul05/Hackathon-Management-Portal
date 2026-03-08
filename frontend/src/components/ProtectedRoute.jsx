import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && role === "admin") {
    // Allow both 'admin' and 'staff' roles for admin dashboard
    if (user.role !== "admin" && user.role !== "staff") {
      return <Navigate to="/" />;
    }
  } else if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
