import React, { useState, useEffect } from "react";
import api from "../services/api";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import Swal from "sweetalert2";
import {
  FaCloudUploadAlt,
  FaLink,
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

const TeamSubmission = ({ team, refreshUser }) => {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [drafts, setDrafts] = useState({}); // Local state for input fields

  useEffect(() => {
    fetchPortals();
  }, []);

  const fetchPortals = async () => {
    try {
      const res = await api.get("/submissions/portals");
      setPortals(res.data);

      // Initialize drafts with any existing links (though they will be locked)
      const initialDrafts = {};
      team.submissions?.forEach((s) => {
        initialDrafts[s.portalId._id || s.portalId] = s.link;
      });
      setDrafts(initialDrafts);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (portalId) => {
    if (submitting) return;

    const link = drafts[portalId];
    if (!link || !link.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "No Data Detected",
        text: "Please input a valid transmission link.",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
    }

    // Final confirmation
    const confirmed = await Swal.fire({
      title: "SEAL ENTRY?",
      text: "Once transmitted, this data will be locked in the encrypted vault and cannot be modified.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "TRANSMIT & LOCK",
      confirmButtonColor: "var(--accent-cyan)",
      background: "var(--bg-secondary)",
      color: "#fff",
    });

    if (!confirmed.isConfirmed) return;

    setSubmitting(true);
    try {
      await api.post("/submissions/submit", { portalId, link });
      await refreshUser();
      Swal.fire({
        icon: "success",
        title: "CONNECTION SECURED",
        text: "Data transmitted successfully. Remote link is now read-only.",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "LINK FAILURE",
        text: error.response?.data?.message || "Transmission failed.",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <div
          className="loader"
          style={{
            border: "3px solid rgba(69, 162, 158, 0.1)",
            borderTop: "3px solid var(--accent-cyan)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      {portals.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "5rem",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "20px",
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <FaCloudUploadAlt
            size={70}
            style={{
              opacity: 0.1,
              marginBottom: "1.5rem",
              color: "var(--accent-cyan)",
            }}
          />
          <p style={{ color: "var(--text-muted)", letterSpacing: "2px" }}>
            NO ACTIVE UPLOAD CHANNELS DETECTED
          </p>
        </div>
      )}

      {portals.map((portal) => {
        const submission = team.submissions?.find(
          (s) => s.portalId._id === portal._id || s.portalId === portal._id,
        );
        const isDeadlinePassed = new Date() > new Date(portal.deadline);
        const isLocked = !!submission || isDeadlinePassed;

        return (
          <Card
            key={portal._id}
            style={{
              position: "relative",
              overflow: "hidden",
              background: isLocked
                ? "rgba(0, 255, 136, 0.02)"
                : "rgba(212, 175, 55, 0.02)",
              border: isLocked
                ? "1px solid rgba(0, 255, 136, 0.2)"
                : "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            {isLocked && (
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  color:
                    isDeadlinePassed && !submission
                      ? "var(--accent-danger)"
                      : "var(--accent-success)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                }}
              >
                {isDeadlinePassed && !submission ? <FaLock /> : <FaShieldAlt />}{" "}
                {isDeadlinePassed && !submission
                  ? "SUBMISSION LOCKED"
                  : "ENCRYPTED & SEALED"}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: isLocked
                      ? "var(--accent-success)"
                      : "var(--accent-cyan)",
                    fontSize: "1.4rem",
                    letterSpacing: "1px",
                  }}
                >
                  {portal.title.toUpperCase()}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    marginTop: "0.8rem",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                  }}
                >
                  {portal.description}
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    color: isDeadlinePassed
                      ? "var(--accent-danger)"
                      : "var(--accent-cyan)",
                    fontSize: "0.8rem",
                    background: isDeadlinePassed
                      ? "rgba(255, 0, 0, 0.05)"
                      : "rgba(69, 162, 158, 0.05)",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "4px",
                    border: isDeadlinePassed
                      ? "1px solid rgba(255, 0, 0, 0.1)"
                      : "1px solid rgba(69, 162, 158, 0.1)",
                  }}
                >
                  <FaLink /> DEADLINE:{" "}
                  {new Date(portal.deadline).toLocaleString()}{" "}
                  {isDeadlinePassed && " - EXPIRED"}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ position: "relative" }}>
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      marginBottom: "0.6rem",
                      display: "block",
                      letterSpacing: "1px",
                    }}
                  >
                    {isLocked
                      ? "MISSION CONTROL REPOSITORY LINK"
                      : "DRIVE / GITHUB / DOCUMENTATION LINK"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Input
                      placeholder="https://drive.google.com/..."
                      value={
                        submission ? submission.link : drafts[portal._id] || ""
                      }
                      onChange={(e) =>
                        !isLocked &&
                        setDrafts({ ...drafts, [portal._id]: e.target.value })
                      }
                      disabled={isLocked}
                      style={{
                        paddingRight: isLocked ? "3rem" : "1rem",
                        background: isLocked
                          ? "rgba(0,0,0,0.3)"
                          : "rgba(255,255,255,0.02)",
                        borderColor: isLocked ? "rgba(0, 255, 136, 0.1)" : "",
                        color: isLocked ? "var(--accent-success)" : "#fff",
                        cursor: isLocked ? "not-allowed" : "text",
                      }}
                    />
                    {isLocked && (
                      <FaLock
                        style={{
                          position: "absolute",
                          right: "1.2rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--accent-success)",
                          opacity: 0.5,
                        }}
                      />
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                  {isDeadlinePassed && !submission ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        padding: "1.5rem",
                        background: "rgba(255, 0, 0, 0.05)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 0, 0, 0.1)",
                        color: "var(--accent-danger)",
                      }}
                    >
                      <FaLock size={24} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontWeight: 800,
                            letterSpacing: "2px",
                            fontSize: "1rem",
                          }}
                        >
                          SUBMISSION LOCKED
                        </span>
                        <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                          DEADLINE HAS EXPIRED - NO MORE UPLOADS ALLOWED
                        </span>
                      </div>
                    </div>
                  ) : submission ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        padding: "1.5rem",
                        background: "rgba(0, 255, 136, 0.05)",
                        borderRadius: "8px",
                        border: "1px solid rgba(0, 255, 136, 0.1)",
                        color: "var(--accent-success)",
                      }}
                    >
                      <FaCheckCircle size={24} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontWeight: 800,
                            letterSpacing: "2px",
                            fontSize: "1rem",
                          }}
                        >
                          SYNCHRONIZATION COMPLETE
                        </span>
                        <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                          LINK ADDRESS HAS BEEN COMMITTED TO THE MAINNER FRAME
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSubmit(portal._id)}
                      disabled={submitting || !drafts[portal._id]?.trim()}
                      style={{
                        width: "100%",
                        padding: "1.2rem",
                        fontSize: "1rem",
                        fontWeight: 800,
                        letterSpacing: "3px",
                      }}
                    >
                      {submitting ? "TRANSMITTING..." : "INTIATE SUBMISSION"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TeamSubmission;
