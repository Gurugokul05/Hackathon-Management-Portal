import React, { useEffect, useState, useCallback } from "react";
import Card from "./Card";
import api from "../services/api";

const StatsPanel = React.memo(({ team }) => {
  const [rank, setRank] = useState(null);

  const fetchRank = useCallback(async () => {
    try {
      const res = await api.get("/teams/leaderboard");
      const list = res.data || [];
      const found = list.find(
        (t) => t._id === team?._id || t.teamId === team?.teamId,
      );
      if (found && found.rank) setRank(found.rank);
    } catch (e) {
      setRank(null);
    }
  }, [team?._id, team?.teamId]);

  useEffect(() => {
    fetchRank();
  }, [fetchRank]);

  return (
    <Card title="Team Status" className="stats-panel">
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Total Score
          </p>
          <h3 style={{ color: "var(--accent-red)" }}>
            {team.marks?.total || 0}
          </h3>
        </div>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Current Rank
          </p>
          <h3 style={{ color: "var(--accent-cyan)" }}>#{rank ?? "-"}</h3>
        </div>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Problem
          </p>
          <h3 style={{ fontSize: "1rem" }}>
            {team.problemStatement ? "Selected" : "Not Selected"}
          </h3>
        </div>
      </div>
    </Card>
  );
});

StatsPanel.displayName = "StatsPanel";

export default StatsPanel;
