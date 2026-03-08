import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    document.title = "Leaderboard - Vinland Saga Challenge";
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/teams/leaderboard").catch(
          () => api.get("/teams/leaderboard"), // Fallback for auth-free access
        );
        setTeams(res.data);
      } catch (error) {}
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <Navbar />
      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "2rem", marginTop: "3rem" }}
      >
        <h1
          style={{ marginBottom: "2rem", fontWeight: 300, textAlign: "center" }}
        >
          Team
          <span style={{ fontWeight: 700, color: "var(--accent-cyan)" }}>
            {" "}
            Leaderboard
          </span>
        </h1>

        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "1rem", width: "10%" }}>Rank</th>
                <th style={{ padding: "1rem" }}>Team Name</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>
                  Total Score
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{ padding: "1rem", textAlign: "center" }}
                  >
                    Loading or No Data...
                  </td>
                </tr>
              ) : (
                teams.map((team, index) => (
                  <tr
                    key={team._id}
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      backgroundColor:
                        index < 3 ? "rgba(34, 211, 238, 0.05)" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color:
                          index === 0
                            ? "#66fcf1"
                            : index === 1
                              ? "silver"
                              : index === 2
                                ? "#cd7f32"
                                : "var(--text-primary)",
                      }}
                    >
                      #{index + 1}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 600 }}>
                      {team.teamName}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        fontSize: "1.2rem",
                        color: "var(--accent-red)",
                        fontWeight: "600",
                      }}
                    >
                      {team.marks?.team?.total || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
