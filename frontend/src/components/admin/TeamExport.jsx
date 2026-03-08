import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../Card";
import Button from "../Button";
import Swal from "sweetalert2";

const TeamExport = ({ user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
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
  };

  const exportToCSV = () => {
    if (teams.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Teams",
        text: "No teams available to export.",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      return;
    }

    // Prepare CSV rows with per-member details
    const rows = [];

    // Header row
    const headers = [
      "Team ID",
      "Team Name",
      "Member Type",
      "Member Name",
      "Email",
      "Phone",
      "Registration Number",
      "Department",
      "Section",
      "Year",
      "Problem Selected",
    ];

    if (isAdmin) {
      headers.push(
        "Round 1",
        "Round 2",
        "Team Total",
        "Individual Mark - Round 1",
        "Individual Mark - Round 2",
        "Individual Total",
      );
    }

    headers.push("Team Status");
    rows.push(headers);

    // Data rows - one row per member (leader + members)
    const sortedTeams = [...teams].sort((a, b) =>
      (a.teamId || "").localeCompare(b.teamId || ""),
    );

    sortedTeams.forEach((team) => {
      // Leader row
      const leaderRow = [
        team.teamId || "-",
        team.teamName || "-",
        "Leader",
        team.leader?.name || "-",
        team.leader?.email || "-",
        team.leader?.phone || "-",
        team.leader?.registrationNumber || "-",
        team.leader?.department || "-",
        team.leader?.section || "-",
        team.leader?.year || "-",
        team.problemStatement?.title || "Not Selected",
      ];

      if (isAdmin) {
        leaderRow.push(
          team.marks?.team?.round1 || 0,
          team.marks?.team?.round2 || 0,
          team.marks?.team?.total || 0,
          team.marks?.members?.round1 || 0,
          team.marks?.members?.round2 || 0,
          team.marks?.members?.total || 0,
        );
      }

      leaderRow.push(team.status || "Registered");

      rows.push(leaderRow);

      // Member rows
      team.members?.forEach((member, idx) => {
        const memberRow = [
          team.teamId || "-",
          team.teamName || "-",
          `Member ${idx + 1}`,
          member.name || "-",
          member.email || "-",
          member.phone || "-",
          member.registrationNumber || "-",
          member.department || "-",
          member.section || "-",
          member.year || "-",
          "",
        ];

        if (isAdmin) {
          memberRow.push("", "", "", "");
        }

        memberRow.push("", "");
        rows.push(memberRow);
      });

      // Spacer row for readability between teams
      const spacerRow = Array(isAdmin ? headers.length : headers.length).fill(
        "",
      );
      rows.push(spacerRow);
    });

    // Convert to CSV string
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if needed
            const cellStr = String(cell);
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(","),
      )
      .join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 10);

    link.setAttribute("href", url);
    link.setAttribute("download", `Team_Details_${timestamp}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "success",
      title: "Export Successful",
      text: `Exported ${teams.length} teams with all member details to CSV.`,
      background: "var(--bg-secondary)",
      color: "#fff",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  if (loading) return <p>Loading teams...</p>;

  return (
    <Card title="Export Team Details">
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            padding: "2rem",
            borderRadius: "12px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
            <strong>Total Teams Registered:</strong> {teams.length}
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "2rem",
              fontSize: "0.9rem",
            }}
          >
            Download all team details with individual member information
            (registration number, department, section, year) in CSV format.
          </p>
          <Button
            onClick={exportToCSV}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            Download CSV
          </Button>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h4 style={{ color: "var(--accent-gold)", marginBottom: "1rem" }}>
            Export Preview
          </h4>
          <div
            style={{ overflowX: "auto", maxHeight: "400px", overflowY: "auto" }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
              }}
            >
              <thead style={{ position: "sticky", top: 0 }}>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    textAlign: "left",
                    color: "var(--text-secondary)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <th style={{ padding: "0.8rem" }}>Team ID</th>
                  <th style={{ padding: "0.8rem" }}>Team Name</th>
                  <th style={{ padding: "0.8rem" }}>Leader Dept</th>
                  <th style={{ padding: "0.8rem" }}>Leader Sec</th>
                  <th style={{ padding: "0.8rem" }}>Leader</th>
                  <th style={{ padding: "0.8rem" }}>Members</th>
                  {isAdmin && <th style={{ padding: "0.8rem" }}>Marks</th>}
                </tr>
              </thead>
              <tbody>
                {teams.slice(0, 10).map((team) => (
                  <tr
                    key={team._id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td style={{ padding: "0.8rem", fontWeight: "600" }}>
                      {team.teamId}
                    </td>
                    <td style={{ padding: "0.8rem" }}>{team.teamName}</td>
                    <td style={{ padding: "0.8rem" }}>
                      {team.leader?.department || "-"}
                    </td>
                    <td style={{ padding: "0.8rem" }}>
                      {team.leader?.section || "-"}
                    </td>
                    <td style={{ padding: "0.8rem" }}>{team.leader?.name}</td>
                    <td style={{ padding: "0.8rem" }}>
                      {team.members?.length}
                    </td>
                    {isAdmin && (
                      <td style={{ padding: "0.8rem" }}>
                        {team.marks?.total || 0}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {teams.length > 10 && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  padding: "1rem",
                }}
              >
                ... and {teams.length - 10} more teams
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeamExport;
