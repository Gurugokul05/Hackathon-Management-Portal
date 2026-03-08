import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages for code splitting
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

// Loading component
const PageLoader = () => (
  <div
    style={{
      color: "#fff",
      textAlign: "center",
      marginTop: "20vh",
      fontSize: "1.2rem",
    }}
  >
    ⟨ SYNCHRONIZING QUANTUM LINK ⟩ [v.1]
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route path="/leaderboard" element={<Leaderboard />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute role="team">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
