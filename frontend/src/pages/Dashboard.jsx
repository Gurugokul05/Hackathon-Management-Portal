import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StatsPanel from "../components/StatsPanel";
import ProblemPanel from "../components/ProblemPanel";
import NoticeBoard from "../components/NoticeBoard";
import ComplaintBox from "../components/ComplaintBox";
import TeamAttendance from "../components/TeamAttendance";
import TeamSubmission from "../components/TeamSubmission";
import {
  FaHome,
  FaBullseye,
  FaUserCheck,
  FaCommentAlt,
  FaSyncAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Set page title
  React.useEffect(() => {
    document.title = "Team Dashboard - Hackathon Platform";
  }, []);

  // Auto-refresh data every 30 seconds - with cleanup
  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  // Memoize handleRefresh to prevent unnecessary re-renders
  const handleRefresh = useCallback(async () => {
    await refreshUser();
  }, [refreshUser]);

  // Memoize tabs array to prevent recreation on every render
  const tabs = useMemo(
    () => [
      { id: "overview", label: "OVERVIEW", icon: <FaHome /> },
      { id: "problem", label: "MISSION", icon: <FaBullseye /> },
      { id: "attendance", label: "ATTENDANCE", icon: <FaUserCheck /> },
      {
        id: "submissions",
        label: "SUBMISSIONS",
        icon: <FaCloudUploadAlt />,
      },
      { id: "queries", label: "QUERY", icon: <FaCommentAlt /> },
    ],
    [],
  );

  // Early return for loading state
  if (!user)
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "20vh" }}>
        ⟨ SYNCHRONIZING QUANTUM LINK ⟩ [v.1]
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
      <Navbar />

      <div className="container" style={{ paddingTop: "8rem" }}>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "2.5rem",
              }}
            >
              OPERATIONAL{" "}
              <span style={{ color: "var(--accent-cyan)" }}>DASHBOARD</span>
            </h1>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              SQUADRON ID: {user.teamId}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-color)",
              color: "var(--accent-cyan)",
              padding: "0.6rem 1.2rem",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            <FaSyncAlt /> RE-SYNC
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "0.5rem",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none",
                border: "none",
                color:
                  activeTab === tab.id
                    ? "var(--accent-cyan)"
                    : "var(--text-muted)",
                padding: "1rem 1.5rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                position: "relative",
                transition: "all 0.3s",
                letterSpacing: "2px",
              }}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "var(--accent-cyan)",
                    boxShadow: "0 0 10px var(--accent-cyan)",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "2rem",
                }}
              >
                <StatsPanel team={user} />
                <NoticeBoard />
              </div>
            )}

            {activeTab === "problem" && (
              <ProblemPanel team={user} onProblemSelected={handleRefresh} />
            )}

            {activeTab === "attendance" && (
              <TeamAttendance team={user} refreshUser={refreshUser} />
            )}

            {activeTab === "submissions" && (
              <TeamSubmission team={user} refreshUser={refreshUser} />
            )}

            {activeTab === "queries" && <ComplaintBox />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
