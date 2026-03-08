import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../Card";
import Button from "../Button";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FaUserAstronaut,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaUserCheck,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

const DEFAULT_LOCKS = { round1: true, round2: false, round3: false };

const AttendanceManager = ({ user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locks, setLocks] = useState(DEFAULT_LOCKS);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRejection, setCurrentRejection] = useState(null);
  const [lockUpdating, setLockUpdating] = useState(false);
  const [bulkRounds, setBulkRounds] = useState({});
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [totalRounds, setTotalRounds] = useState(3);
  const [creatingRound, setCreatingRound] = useState(false);
  const [deletingRound, setDeletingRound] = useState(null);

  useEffect(() => {
    fetchLocks();
    fetchTeams();
    fetchTotalRounds();
  }, []);

  const fetchTotalRounds = async () => {
    try {
      const res = await api.get("/teams/attendance/rounds");
      setTotalRounds(res.data?.totalRounds || 3);
    } catch (error) {}
  };

  const fetchLocks = async () => {
    try {
      const res = await api.get("/teams/attendance/lock");
      setLocks(res.data?.locks || DEFAULT_LOCKS);
    } catch (error) {}
  };

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleToggle = async (teamId, memberId, round, currentStatus) => {
    try {
      await api.put(`/teams/${teamId}/attendance/member`, {
        memberId,
        round,
        status: !currentStatus,
      });
      fetchTeams();
    } catch (error) {
      MySwal.fire({ icon: "error", title: "Update Failed" });
    }
  };

  const handleVerify = async (teamId, memberId, round, status) => {
    try {
      await api.put(`/teams/${teamId}/attendance/verify`, {
        memberId,
        round,
        status,
      });
      MySwal.fire({
        icon: "success",
        title: `Personnel Status: ${status}`,
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      setCurrentRejection(null);
      setRejectionReason("");
      fetchTeams();
    } catch (error) {
      MySwal.fire({ icon: "error", title: "Action Failed" });
    }
  };

  const handleBulkAddAttendance = async (team) => {
    const round = bulkRounds[team._id] || "round1";
    setBulkUpdating(true);
    try {
      const payloads = [
        { memberId: "leader", round, status: true },
        ...(team.members || []).map((m) => ({
          memberId: m._id,
          round,
          status: true,
        })),
      ];

      await Promise.all(
        payloads.map((body) =>
          api.put(`/teams/${team._id}/attendance/member`, body),
        ),
      );

      MySwal.fire({
        icon: "success",
        title: `Attendance added for ${round.replace("round", "Round ")}`,
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      fetchTeams();
    } catch (error) {
      MySwal.fire({ icon: "error", title: "Bulk Add Failed" });
    } finally {
      setBulkUpdating(false);
    }
  };

  const showRejectionDialog = (teamId, memberId, round) => {
    setCurrentRejection({ teamId, memberId, round });
  };

  const submitRejection = async () => {
    if (currentRejection) {
      const { teamId, memberId, round } = currentRejection;
      await handleVerify(teamId, memberId, round, "Rejected");
    }
  };

  const handleToggleLock = async (round, open) => {
    setLockUpdating(true);
    try {
      const res = await api.put("/teams/attendance/lock", { round, open });
      setLocks(res.data?.locks || ((prev) => ({ ...prev, [round]: open })));
    } catch (error) {
    } finally {
      setLockUpdating(false);
    }
  };

  const handleAddNewRound = async () => {
    setCreatingRound(true);
    try {
      await api.post("/teams/attendance/add-round");
      MySwal.fire({
        icon: "success",
        title: `Round ${totalRounds + 1} Created`,
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      setTotalRounds(totalRounds + 1);
      fetchTeams();
    } catch (error) {
      MySwal.fire({ icon: "error", title: "Failed to create round" });
    } finally {
      setCreatingRound(false);
    }
  };

  const handleDeleteRound = async (roundName) => {
    const roundNum = roundName.replace("round", "Round ");
    const confirm = await MySwal.fire({
      icon: "warning",
      title: `Delete ${roundNum}?`,
      text: "This will remove the round from all teams. This cannot be undone!",
      background: "var(--bg-secondary)",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "var(--accent-danger)",
      cancelButtonColor: "var(--border-color)",
      confirmButtonText: "DELETE",
    });

    if (!confirm.isConfirmed) return;

    setDeletingRound(roundName);
    try {
      await api.delete(`/teams/attendance/round/${roundName}`);
      MySwal.fire({
        icon: "success",
        title: `${roundNum} Deleted`,
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      setTotalRounds(totalRounds - 1);
      fetchTeams();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: error.response?.data?.message || "Failed to delete round",
      });
    } finally {
      setDeletingRound(null);
    }
  };

  const showPhoto = (photo) => {
    MySwal.fire({
      imageUrl: photo,
      imageWidth: 600,
      imageAlt: "Attendance Proof",
      background: "var(--bg-secondary)",
      confirmButtonColor: "var(--accent-gold)",
      confirmButtonText: "CLOSE PREVIEW",
    });
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
    ];

    // Add round headers
    for (let i = 1; i <= totalRounds; i++) {
      headers.push(`Round ${i}`);
    }

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
      ];

      // Add round statuses
      for (let i = 1; i <= totalRounds; i++) {
        const roundName = `round${i}`;
        leaderRow.push(team.leader?.[roundName]?.status || "Not Captured");
      }

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
        ];

        // Add round statuses
        for (let i = 1; i <= totalRounds; i++) {
          const roundName = `round${i}`;
          memberRow.push(member?.[roundName]?.status || "Not Captured");
        }

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

  const groupedRequests = {};
  const rounds = Array.from({ length: totalRounds }, (_, i) => `round${i + 1}`);

  if (Array.isArray(teams)) {
    teams.forEach((team) => {
      if (!team) return;
      const teamIdStr = team._id?.toString();
      if (!teamIdStr) return;

      // Check Leader
      rounds.forEach((round) => {
        if (team.leader?.[round]?.status === "Pending") {
          if (!groupedRequests[teamIdStr]) {
            groupedRequests[teamIdStr] = {
              teamName: team.teamName || "Unknown Team",
              teamId: team.teamId || "N/A",
              requests: [],
            };
          }
          groupedRequests[teamIdStr].requests.push({
            memberId: "leader",
            memberName: team.leader.name || "Commander",
            role: "LEADER",
            round,
            photo: team.leader[round].photo,
            submittedAt: team.leader[round].submittedAt,
            teamDbId: team._id,
          });
        }
      });

      // Check Members
      team.members?.forEach((m) => {
        rounds.forEach((round) => {
          if (m[round]?.status === "Pending") {
            if (!groupedRequests[teamIdStr]) {
              groupedRequests[teamIdStr] = {
                teamName: team.teamName || "Unknown Team",
                teamId: team.teamId || "N/A",
                requests: [],
              };
            }
            groupedRequests[teamIdStr].requests.push({
              memberId: m._id,
              memberName: m.name || "Agent",
              role: "MEMBER",
              round,
              photo: m[round].photo,
              submittedAt: m[round].submittedAt,
              teamDbId: team._id,
            });
          }
        });
      });
    });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      <Card style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <FaUserCheck
              style={{ fontSize: "1.5rem", color: "var(--accent-gold)" }}
            />
            <h2
              style={{
                margin: 0,
                color: "var(--accent-gold)",
                fontSize: "1.3rem",
                letterSpacing: "1px",
              }}
            >
              ATTENDANCE CONTROL
            </h2>
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <Button
              onClick={exportAttendanceToCSV}
              style={{
                padding: "0.6rem 1rem",
                fontSize: "0.8rem",
                background:
                  "linear-gradient(135deg, var(--accent-gold), var(--accent-red))",
                fontWeight: "bold",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Export CSV
            </Button>
            <Button
              disabled={creatingRound}
              onClick={handleAddNewRound}
              style={{
                padding: "0.6rem 1rem",
                fontSize: "0.8rem",
                background: "var(--accent-success)",
                fontWeight: "bold",
                borderRadius: "6px",
              }}
            >
              {creatingRound ? "Creating..." : `+ Round ${totalRounds + 1}`}
            </Button>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {rounds.map((round) => (
            <div
              key={round}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                padding: "1rem",
                border: locks[round]
                  ? "2px solid var(--accent-success)"
                  : "2px solid var(--accent-danger)",
                borderRadius: "10px",
                background: locks[round]
                  ? "rgba(0, 255, 136, 0.05)"
                  : "rgba(255, 71, 87, 0.05)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    letterSpacing: "2px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "var(--accent-gold)",
                  }}
                >
                  {round.replace("round", "Round ")}
                </span>
                <div
                  style={{
                    padding: "0.3rem 0.6rem",
                    borderRadius: "20px",
                    background: locks[round]
                      ? "var(--accent-success)"
                      : "var(--accent-danger)",
                    color: "#000",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                  }}
                >
                  {locks[round] ? "OPEN" : "CLOSED"}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant={locks[round] ? "primary" : "secondary"}
                  disabled={lockUpdating}
                  onClick={() => handleToggleLock(round, !locks[round])}
                  style={{
                    flex: 1,
                    fontSize: "0.75rem",
                    padding: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {locks[round] ? "🔓 LOCK" : "🔒 UNLOCK"}
                </Button>
                {totalRounds > 1 && (
                  <Button
                    disabled={deletingRound === round}
                    onClick={() => handleDeleteRound(round)}
                    style={{
                      background: "var(--accent-danger)",
                      padding: "0.5rem 0.8rem",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {deletingRound === round ? "..." : "🗑 DEL"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {Object.keys(groupedRequests).length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.8rem",
              color: "var(--accent-gold)",
            }}
          >
            PENDING MISSION SYNCHRONIZATIONS
          </h2>

          {Object.values(groupedRequests).map((group, gIdx) => (
            <div
              key={gIdx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    height: "2px",
                    flex: 1,
                    background:
                      "linear-gradient(90deg, var(--accent-gold) 0%, transparent 100%)",
                  }}
                ></div>
                <span
                  style={{
                    fontWeight: 800,
                    letterSpacing: "2px",
                    color: "var(--accent-gold)",
                  }}
                >
                  UNIT: {group.teamName.toUpperCase()}
                </span>
                <div
                  style={{
                    height: "2px",
                    flex: 1,
                    background:
                      "linear-gradient(270deg, var(--accent-gold) 0%, transparent 100%)",
                  }}
                ></div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {group.requests.map((req, idx) => (
                  <Card
                    key={idx}
                    style={{
                      border: "1px solid rgba(255, 215, 0, 0.2)",
                      background: "rgba(255, 215, 0, 0.02)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            color: "var(--accent-gold)",
                            fontSize: "1.1rem",
                          }}
                        >
                          {req.memberName.toUpperCase()}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            letterSpacing: "1px",
                          }}
                        >
                          ROUND: {req.round.toUpperCase()} | {req.role}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {req.submittedAt
                          ? new Date(req.submittedAt).toLocaleTimeString()
                          : "..."}
                      </div>
                    </div>

                    <div
                      onClick={() => showPhoto(req.photo)}
                      style={{
                        position: "relative",
                        cursor: "pointer",
                        width: "100%",
                        height: "220px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.05)",
                        background: "#000",
                      }}
                    >
                      <img
                        src={req.photo}
                        alt="Proof"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          right: "0.5rem",
                          background: "rgba(0,0,0,0.5)",
                          padding: "0.4rem",
                          borderRadius: "50%",
                        }}
                      >
                        <FaImage color="#fff" />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.8rem",
                        marginTop: "auto",
                      }}
                    >
                      <Button
                        onClick={() =>
                          handleVerify(
                            req.teamDbId,
                            req.memberId,
                            req.round,
                            "Verified",
                          )
                        }
                        style={{
                          flex: 1,
                          background: "var(--accent-success)",
                          color: "#fff",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "0.7rem",
                        }}
                      >
                        ✓ VERIFY
                      </Button>
                      <Button
                        onClick={() =>
                          showRejectionDialog(
                            req.teamDbId,
                            req.memberId,
                            req.round,
                          )
                        }
                        variant="secondary"
                        style={{
                          flex: 1,
                          border: "1px solid var(--accent-danger)",
                          color: "var(--accent-danger)",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "0.7rem",
                        }}
                      >
                        ✗ REJECT
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(teams) &&
        teams.map((team) => (
          <Card
            key={team?._id}
            title={`${team?.teamName || "Unnamed"} (${team?.teamId || "N/A"})`}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "var(--text-primary)",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "0.8rem" }}>Role</th>
                  <th style={{ padding: "0.8rem" }}>Name</th>
                  {rounds.map((round) => (
                    <th
                      key={round}
                      style={{ padding: "0.8rem", textAlign: "center" }}
                    >
                      {round.replace("round", "Round ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {team?.leader && (
                  <MemberRow
                    teamId={team._id}
                    memberId="leader"
                    name={team.leader.name}
                    role="LEADER"
                    memberData={team.leader}
                    onToggle={handleToggle}
                    onVerify={handleVerify}
                    showPhoto={showPhoto}
                    rounds={rounds}
                  />
                )}
                {team?.members?.map((member) => (
                  <MemberRow
                    key={member?._id}
                    teamId={team._id}
                    memberId={member?._id}
                    name={member?.name}
                    role="MEMBER"
                    memberData={member}
                    onToggle={handleToggle}
                    onVerify={handleVerify}
                    showPhoto={showPhoto}
                    rounds={rounds}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={2 + totalRounds}
                    style={{
                      padding: "0.8rem",
                      borderTop: "1px solid var(--border-color)",
                    }}
                  ></td>
                </tr>
              </tfoot>
            </table>
          </Card>
        ))}
      {currentRejection && (
        <Card
          title="REJECTION REASON"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            zIndex: 1000,
            boxShadow: "0 0 50px rgba(0,0,0,0.8)",
            border: "2px solid var(--accent-danger)",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.8rem",
                  color: "var(--text-secondary)",
                  fontWeight: "bold",
                }}
              >
                Optional: Reason for rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Photo quality poor, Member not visible, Invalid attendance"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "4px",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  minHeight: "100px",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                onClick={submitRejection}
                style={{
                  flex: 1,
                  background: "var(--accent-danger)",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                CONFIRM REJECTION
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setCurrentRejection(null);
                  setRejectionReason("");
                }}
                style={{ flex: 1 }}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </Card>
      )}
      {currentRejection && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 999,
          }}
          onClick={() => {
            setCurrentRejection(null);
            setRejectionReason("");
          }}
        />
      )}
    </div>
  );
};

const MemberRow = ({
  teamId,
  memberId,
  name,
  role,
  memberData,
  onToggle,
  onVerify,
  showPhoto,
  rounds,
}) => {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <td
        style={{
          padding: "0.8rem",
          color: role === "LEADER" ? "var(--accent-gold)" : "var(--text-muted)",
          fontWeight: "bold",
          fontSize: "0.8rem",
        }}
      >
        {role}
      </td>
      <td style={{ padding: "0.8rem" }}>{name}</td>

      {rounds.map((round) => {
        const data = memberData?.[round] || {};
        const isVerified = data.status === "Verified";
        const photo = data.photo;

        return (
          <td key={round} style={{ padding: "0.8rem", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <AttendanceToggle
                active={isVerified}
                onClick={() => onToggle(teamId, memberId, round, isVerified)}
              />
              {photo && (
                <div
                  onClick={() => showPhoto(photo)}
                  style={{
                    cursor: "pointer",
                    width: "40px",
                    height: "30px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: "1px solid var(--accent-gold)",
                    background: "#000",
                  }}
                >
                  <img
                    src={photo}
                    alt="Proof"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

const AttendanceToggle = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "0.5rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "none",
    }}
  >
    {active ? (
      <FaCheckCircle color="var(--accent-success)" size={20} />
    ) : (
      <FaTimesCircle
        color="var(--accent-danger)"
        size={20}
        style={{ opacity: 0.3 }}
      />
    )}
  </button>
);

export default AttendanceManager;
