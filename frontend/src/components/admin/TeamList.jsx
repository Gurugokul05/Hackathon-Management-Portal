import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../services/api";
import Card from "../Card";
import Button from "../Button";
import Swal from "sweetalert2";

const TeamList = React.memo(({ user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch teams",
      });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  if (loading) return <p>Loading Teams...</p>;

  return (
    <Card title="Registered Teams">
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9rem",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border-color)",
                textAlign: "left",
                color: "var(--text-secondary)",
              }}
            >
              <th style={{ padding: "1rem" }}>Team ID</th>
              <th style={{ padding: "1rem" }}>Team Name</th>
              <th style={{ padding: "1rem" }}>Leader</th>
              <th style={{ padding: "1rem" }}>Problem</th>
              {isAdmin && <th style={{ padding: "1rem" }}>Total Marks</th>}
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team._id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <td style={{ padding: "1rem", fontWeight: 600 }}>
                  {team.teamId}
                </td>
                <td style={{ padding: "1rem", fontWeight: 600 }}>
                  {team.teamName}
                </td>
                <td style={{ padding: "1rem" }}>
                  {team.leader?.name} <br />
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    {team.leader?.email}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  {team.problemStatement?.title || (
                    <span style={{ color: "var(--accent-danger)" }}>
                      Not Selected
                    </span>
                  )}
                </td>
                {isAdmin && (
                  <td
                    style={{
                      padding: "1rem",
                      fontWeight: 600,
                      color: "var(--accent-red)",
                    }}
                  >
                    {team.marks?.team?.total || 0}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});

TeamList.displayName = "TeamList";

export default TeamList;
