import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../Card";
import Button from "../Button";
import Swal from "sweetalert2";

const MarksManager = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const openMarksModal = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  const handleSaveMarks = async () => {
    if (!selectedTeam) return;

    // Get team marks
    const teamR1 = document.getElementById(`team-round1`)?.value;
    const teamR2 = document.getElementById(`team-round2`)?.value;
    const teamMarks = {
      round1: parseFloat(teamR1) || 0,
      round2: parseFloat(teamR2) || 0,
    };

    const memberMarks = {};

    // Get leader marks
    const leaderR1 = document.getElementById(`leader-round1`)?.value;
    const leaderR2 = document.getElementById(`leader-round2`)?.value;
    memberMarks.leader = {
      round1: parseFloat(leaderR1) || 0,
      round2: parseFloat(leaderR2) || 0,
    };

    // Get member marks
    selectedTeam.members.forEach((member) => {
      const r1 = document.getElementById(`${member._id}-round1`)?.value;
      const r2 = document.getElementById(`${member._id}-round2`)?.value;
      memberMarks[member._id] = {
        round1: parseFloat(r1) || 0,
        round2: parseFloat(r2) || 0,
      };
    });

    try {
      await api.put(`/teams/${selectedTeam._id}/marks`, {
        teamMarks,
        memberMarks,
      });
      Swal.fire({
        icon: "success",
        title: "✓ Success!",
        text: "Marks updated successfully",
        background: "var(--bg-secondary)",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false,
      });
      closeModal();
      fetchTeams();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update marks",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.teamId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "var(--text-secondary)" }}>Loading teams...</p>
        </div>
      </Card>
    );

  return (
    <>
      <Card>
        {/* Header Section */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.8rem",
                  color: "var(--accent-gold)",
                  fontWeight: "700",
                }}
              >
                Marks Management
              </h2>
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                Manage team performance and individual member marks across 2
                rounds
              </p>
            </div>
            <div
              style={{
                background: "rgba(0,255,255,0.1)",
                borderRadius: "8px",
                padding: "0.8rem 1.2rem",
                border: "1px solid rgba(0,255,255,0.2)",
              }}
            >
              <div
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
              >
                Total Teams
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "var(--accent-gold)",
                }}
              >
                {filteredTeams.length}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search teams by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              background: "var(--bg-primary)",
              border: "1px solid rgba(0,255,255,0.3)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "0.95rem",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent-gold)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(0,255,255,0.3)")}
          />
        </div>

        {/* Teams Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div
                key={team._id}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,255,255,0.05), rgba(139,92,246,0.05))",
                  border: "1px solid rgba(0,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-gold)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,255,255,0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,255,255,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Team Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        marginBottom: "0.3rem",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {team.teamId}
                    </div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.2rem",
                        color: "#fff",
                        fontWeight: "700",
                      }}
                    >
                      {team.teamName}
                    </h3>
                  </div>
                  <span
                    style={{
                      background: "rgba(0,255,255,0.2)",
                      color: "var(--accent-gold)",
                      padding: "0.3rem 0.7rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    {1 + (team.members?.length || 0)} 👥
                  </span>
                </div>

                {/* Marks Display */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {/* Team Marks */}
                    <div
                      style={{
                        background: "rgba(139,92,246,0.2)",
                        border: "1px solid rgba(139,92,246,0.4)",
                        borderRadius: "8px",
                        padding: "1rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--accent-red)",
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        🏆 Team
                      </div>
                      <div
                        style={{
                          fontSize: "1.8rem",
                          fontWeight: "700",
                          color: "var(--accent-red)",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {team.marks?.team?.total || 0}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        R1:{team.marks?.team?.round1 || 0}|R2:
                        {team.marks?.team?.round2 || 0}
                      </div>
                    </div>

                    {/* Member Marks */}
                    <div
                      style={{
                        background: "rgba(0,255,255,0.2)",
                        border: "1px solid rgba(0,255,255,0.4)",
                        borderRadius: "8px",
                        padding: "1rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--accent-gold)",
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        👥 Members
                      </div>
                      <div
                        style={{
                          fontSize: "1.8rem",
                          fontWeight: "700",
                          color: "var(--accent-gold)",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {team.marks?.members?.total || 0}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        R1:{team.marks?.members?.round1 || 0}|R2:
                        {team.marks?.members?.round2 || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <Button
                  onClick={() => openMarksModal(team)}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    background:
                      "linear-gradient(135deg, var(--accent-gold), var(--accent-red))",
                    border: "none",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    transition: "all 0.3s",
                    color: "#fff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  ✏️ Edit Marks
                </Button>
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
                color: "var(--text-secondary)",
              }}
            >
              {searchQuery
                ? "No teams found matching your search"
                : "No teams registered yet"}
            </div>
          )}
        </div>
      </Card>

      {/* Edit Marks Modal */}
      {showModal && selectedTeam && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
            backdropFilter: "blur(4px)",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "16px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
              padding: "2.5rem",
              boxShadow: "0 20px 60px rgba(0,255,255,0.2)",
              border: "1px solid rgba(0,255,255,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                marginBottom: "2rem",
                borderBottom: "2px solid rgba(0,255,255,0.2)",
                paddingBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.6rem",
                  color: "var(--accent-gold)",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                }}
              >
                ✏️ {selectedTeam.teamName}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                }}
              >
                {selectedTeam.teamId} •{" "}
                {1 + (selectedTeam.members?.length || 0)} total members
              </p>
            </div>

            {/* Content */}
            <div style={{ marginBottom: "2rem" }}>
              {/* Team Performance Section */}
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.15))",
                    border: "2px solid rgba(139,92,246,0.3)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent-red), var(--accent-pink))",
                        color: "#fff",
                        padding: "0.4rem 0.9rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        marginRight: "0.8rem",
                      }}
                    >
                      🏆 TEAM PERFORMANCE
                    </span>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--text-secondary)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Overall team score (used for ranking)
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.2rem",
                    }}
                  >
                    {[1, 2].map((round) => (
                      <div key={round}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.6rem",
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Round {round}
                        </label>
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <input
                            id={`team-round${round}`}
                            type="number"
                            step="0.5"
                            min="0"
                            defaultValue={
                              selectedTeam.marks?.[`team`]?.[`round${round}`] ||
                              0
                            }
                            style={{
                              width: "100%",
                              padding: "0.8rem 1rem",
                              background: "var(--bg-primary)",
                              border: "2px solid rgba(139,92,246,0.3)",
                              borderRadius: "8px",
                              color: "#fff",
                              fontSize: "1rem",
                              fontWeight: "600",
                              transition: "all 0.3s",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor =
                                "var(--accent-red)";
                              e.target.style.boxShadow =
                                "0 0 12px rgba(139,92,246,0.2)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor =
                                "rgba(139,92,246,0.3)";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Members Section */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      background: "rgba(0,255,255,0.2)",
                      color: "var(--accent-gold)",
                      padding: "0.4rem 0.9rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      marginRight: "0.8rem",
                    }}
                  >
                    👥 INDIVIDUAL MARKS
                  </span>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Evaluate each member's contribution
                  </p>
                </div>

                {/* Leader */}
                <div
                  style={{
                    background: "rgba(0,255,255,0.08)",
                    border: "1px solid rgba(0,255,255,0.2)",
                    borderRadius: "10px",
                    padding: "1.2rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        background: "var(--accent-gold)",
                        color: "#000",
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        marginRight: "0.6rem",
                      }}
                    >
                      LEADER
                    </span>
                    <strong style={{ color: "#fff", fontSize: "0.95rem" }}>
                      {selectedTeam.leader.name}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    {[1, 2].map((round) => (
                      <input
                        key={round}
                        id={`leader-round${round}`}
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder={`R${round}`}
                        defaultValue={
                          selectedTeam.leader.marks?.[`round${round}`] || 0
                        }
                        style={{
                          padding: "0.7rem 0.9rem",
                          background: "var(--bg-primary)",
                          border: "1px solid rgba(0,255,255,0.3)",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "0.9rem",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "var(--accent-gold)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(0,255,255,0.3)";
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Members */}
                {selectedTeam.members.map((member, idx) => (
                  <div
                    key={member._id}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(236,72,153,0.3)",
                          color: "var(--accent-pink)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          marginRight: "0.6rem",
                        }}
                      >
                        M{idx + 1}
                      </span>
                      <strong
                        style={{
                          color: "#fff",
                          fontSize: "0.95rem",
                          marginRight: "0.5rem",
                        }}
                      >
                        {member.name}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        ({member.registrationNumber})
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                      }}
                    >
                      {[1, 2].map((round) => (
                        <input
                          key={round}
                          id={`${member._id}-round${round}`}
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder={`R${round}`}
                          defaultValue={member.marks?.[`round${round}`] || 0}
                          style={{
                            padding: "0.7rem 0.9rem",
                            background: "var(--bg-primary)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                            color: "#fff",
                            fontSize: "0.9rem",
                            transition: "all 0.2s",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "var(--accent-pink)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor =
                              "rgba(255,255,255,0.1)";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={closeModal}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "0.8rem 1.8rem",
                  fontSize: "0.9rem",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMarks}
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-gold), var(--accent-red))",
                  border: "none",
                  padding: "0.8rem 2rem",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                }}
              >
                💾 Save Marks
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarksManager;
