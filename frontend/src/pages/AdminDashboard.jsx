import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TeamList from "../components/admin/TeamList";
import TeamExport from "../components/admin/TeamExport";
import ProblemManager from "../components/admin/ProblemManager";
import CommunicationManager from "../components/admin/CommunicationManager";
import AttendanceManager from "../components/admin/AttendanceManager";
import AdminSubmissionManager from "../components/admin/AdminSubmissionManager";
import MarksManager from "../components/admin/MarksManager";
import Button from "../components/Button";
import EventSettings from "../components/admin/EventSettings";
import {
  FaUsers,
  FaClipboardList,
  FaBullseye,
  FaCommentAlt,
  FaFileUpload,
  FaDownload,
} from "react-icons/fa";
import { FaCog } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [view, setView] = useState("");

  React.useEffect(() => {
    document.title = "Admin Control Panel - Vinland Saga Challenge";
  }, []);

  const allTabs = [
    {
      id: "teams",
      label: "TEAMS",
      icon: <FaUsers />,
      requiresPermission: "attendance:update",
    },
    {
      id: "export",
      label: "EXPORT",
      icon: <FaDownload />,
      requiresPermission: "attendance:update",
    },
    {
      id: "attendance",
      label: "ATTENDANCE",
      icon: <FaClipboardList />,
      requiresPermission: "attendance:update",
    },
    {
      id: "marks",
      label: "MARKS",
      icon: <FaClipboardList />,
      requiresPermission: "marks:update",
    },
    {
      id: "problems",
      label: "OBJECTIVES",
      icon: <FaBullseye />,
      requiresAdmin: true,
    },
    {
      id: "submissions",
      label: "SUBMISSIONS",
      icon: <FaFileUpload />,
      requiresAdmin: true,
    },
    {
      id: "communication",
      label: "COMMS",
      icon: <FaCommentAlt />,
      requiresAdmin: true,
    },
    { id: "settings", label: "SETTINGS", icon: <FaCog />, requiresAdmin: true },
  ];

  const isAdmin = user?.role === "admin";
  const permissions = user?.permissions || [];

  const tabs = allTabs.filter((tab) => {
    if (isAdmin) return true;
    if (tab.requiresAdmin) return false;
    if (tab.requiresPermission)
      return permissions.includes(tab.requiresPermission);
    return true;
  });

  React.useEffect(() => {
    if (tabs.length > 0 && !view) {
      setView(tabs[0].id);
    }
  }, [tabs, view]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b0c10 0%, #171c24 100%)",
      }}
    >
      <Navbar />
      <div
        className="container"
        style={{ paddingTop: "8rem", paddingBottom: "4rem" }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            marginBottom: "3rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            paddingBottom: "2rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                margin: 0,
                letterSpacing: "4px",
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              }}
            >
              MISSION{" "}
              <span style={{ color: "var(--accent-red)" }}>CONTROL</span>
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                marginTop: "0.5rem",
              }}
            >
              SQUADRON AND OBJECTIVE OVERSIGHT
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.8rem",
              background: "rgba(255,255,255,0.02)",
              padding: "0.8rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setView(tab.id)}
                variant={view === tab.id ? "primary" : "secondary"}
                style={{
                  padding:
                    "clamp(0.5rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1.5rem)",
                  fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  backgroundColor:
                    view === tab.id ? "var(--accent-red)" : "transparent",
                  borderColor:
                    view === tab.id ? "var(--accent-red)" : "transparent",
                  color: view === tab.id ? "#fff" : "var(--text-muted)",
                  transition: "0.3s",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: "clamp(0.9rem, 3vw, 1.2rem)" }}>
                  {tab.icon}
                </span>
                <span className="tab-label">{tab.label}</span>
              </Button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {view === "teams" &&
              (isAdmin || permissions.includes("attendance:update")) && (
                <TeamList user={user} />
              )}
            {view === "export" &&
              (isAdmin || permissions.includes("attendance:update")) && (
                <TeamExport user={user} />
              )}
            {view === "attendance" &&
              (isAdmin || permissions.includes("attendance:update")) && (
                <AttendanceManager user={user} />
              )}
            {view === "marks" &&
              (isAdmin || permissions.includes("marks:update")) && (
                <MarksManager />
              )}
            {view === "problems" && isAdmin && <ProblemManager />}
            {view === "communication" && isAdmin && <CommunicationManager />}
            {view === "submissions" && isAdmin && <AdminSubmissionManager />}
            {view === "settings" && isAdmin && <EventSettings />}
            {!isAdmin &&
              !permissions.includes("attendance:update") &&
              !permissions.includes("marks:update") &&
              tabs.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <h3>No Permission</h3>
                  <p>You don't have access to this section.</p>
                </div>
              )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .tab-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
