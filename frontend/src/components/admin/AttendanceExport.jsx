import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../Card";
import Button from "../Button";
import Swal from "sweetalert2";

const AttendanceExport = ({ user }) => {
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

  const exportAttendanceToCSV = () => {
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

    // Prepare CSV rows with attendance details
    const rows = [];

    // Header row
    const headers = [
      "Team ID",
      "Team Name",
      "Member Type",
      "Member Name",
      "Email",
      "Registration Number",
      "Round 1",
      "Round 2",
      "Round 3",
    ];

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
        team.leader?.registrationNumber || "-",
        team.leader?.round1?.status || "Not Captured",
        team.leader?.round2?.status || "Not Captured",
        team.leader?.round3?.status || "Not Captured",
      ];

      rows.push(leaderRow);

      // Member rows
      team.members?.forEach((member, idx) => {
        const memberRow = [
          team.teamId || "-",
          team.teamName || "-",
          `Member ${idx + 1}`,
          member.name || "-",
          member.email || "-",
          member.registrationNumber || "-",
          member.round1?.status || "Not Captured",
          member.round2?.status || "Not Captured",
          member.round3?.status || "Not Captured",
        ];

        rows.push(memberRow);
      });

      // Spacer row for readability between teams
      rows.push(Array(headers.length).fill(""));
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
    link.setAttribute("download", `Attendance_Details_${timestamp}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "success",
      title: "Export Successful",
      text: `Exported attendance details for ${teams.length} teams.`,
      background: "var(--bg-secondary)",
      color: "#fff",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  if (loading)
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "var(--text-secondary)" }}>Loading teams...</p>
        </div>
      </Card>
    );

  return (
    <Card title="Export Attendance Details">
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            padding: "2rem",
            borderRadius: "12px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                color: "var(--accent-gold)",
                fontSize: "1.2rem",
              }}
            >
              📋 Attendance Records
            </h3>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              Download attendance status for all team members (Leader & Members)
              across all rounds.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button
              onClick={exportAttendanceToCSV}
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-gold), var(--accent-red))",
                border: "none",
                padding: "0.8rem 2rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              ⬇️ Download Attendance CSV
            </Button>
          </div>

          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "rgba(212, 175, 55, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(212, 175, 55, 0.3)",
            }}
          >
            <h4 style={{ margin: "0 0 1rem 0", color: "var(--accent-gold)" }}>
              📊 Export Details
            </h4>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.5rem",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.8",
              }}
            >
              <li>Includes leader and all team members</li>
              <li>Shows attendance status for each round (Round 1, 2, 3)</li>
              <li>
                Status values: Not Captured, Pending, Verified, or Rejected
              </li>
              <li>One row per member for easy analysis</li>
              <li>File name includes export date</li>
            </ul>
          </div>
        </div>

        {/* Preview Table */}
        <div style={{ overflowX: "auto" }}>
          <h3 style={{ color: "var(--accent-gold)", marginBottom: "1rem" }}>
            📌 Preview (First 10 Teams)
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(212, 175, 55, 0.1)",
                  borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                }}
              >
                <th style={{ padding: "0.8rem", textAlign: "left" }}>
                  Team ID
                </th>
                <th style={{ padding: "0.8rem", textAlign: "left" }}>
                  Team Name
                </th>
                <th style={{ padding: "0.8rem", textAlign: "left" }}>
                  Member Type
                </th>
                <th style={{ padding: "0.8rem", textAlign: "left" }}>
                  Member Name
                </th>
                <th style={{ padding: "0.8rem", textAlign: "left" }}>
                  Round 1
                </th>
                <th style={{ padding: "0.8rem", textAlign: "left" }}>
                  Round 2
                </th>
                <th style={{ padding: "0.8rem", textAlign: "left" }}>
                  Round 3
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.slice(0, 10).map((team) => (
                <React.Fragment key={team._id}>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <td style={{ padding: "0.8rem", fontWeight: "600" }}>
                      {team.teamId}
                    </td>
                    <td style={{ padding: "0.8rem" }}>{team.teamName}</td>
                    <td style={{ padding: "0.8rem" }}>
                      <span
                        style={{
                          background: "rgba(0,255,255,0.2)",
                          color: "var(--accent-gold)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                        }}
                      >
                        Leader
                      </span>
                    </td>
                    <td style={{ padding: "0.8rem" }}>{team.leader?.name}</td>
                    <td style={{ padding: "0.8rem", fontSize: "0.9rem" }}>
                      {team.leader?.round1?.status || "Not Captured"}
                    </td>
                    <td style={{ padding: "0.8rem", fontSize: "0.9rem" }}>
                      {team.leader?.round2?.status || "Not Captured"}
                    </td>
                    <td style={{ padding: "0.8rem", fontSize: "0.9rem" }}>
                      {team.leader?.round3?.status || "Not Captured"}
                    </td>
                  </tr>
                  {team.members?.slice(0, 2).map((member, idx) => (
                    <tr
                      key={`${team._id}-${idx}`}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        background: "rgba(255,255,255,0.01)",
                      }}
                    >
                      <td style={{ padding: "0.8rem" }} colSpan="1"></td>
                      <td style={{ padding: "0.8rem" }}></td>
                      <td style={{ padding: "0.8rem" }}>
                        <span
                          style={{
                            background: "rgba(236,72,153,0.2)",
                            color: "var(--accent-pink)",
                            padding: "0.3rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                          }}
                        >
                          Member {idx + 1}
                        </span>
                      </td>
                      <td style={{ padding: "0.8rem" }}>{member.name}</td>
                      <td style={{ padding: "0.8rem", fontSize: "0.9rem" }}>
                        {member.round1?.status || "Not Captured"}
                      </td>
                      <td style={{ padding: "0.8rem", fontSize: "0.9rem" }}>
                        {member.round2?.status || "Not Captured"}
                      </td>
                      <td style={{ padding: "0.8rem", fontSize: "0.9rem" }}>
                        {member.round3?.status || "Not Captured"}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {teams.length > 10 && (
            <p
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "1rem",
                fontSize: "0.9rem",
              }}
            >
              ... and {teams.length - 10} more teams (view in complete export)
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AttendanceExport;
