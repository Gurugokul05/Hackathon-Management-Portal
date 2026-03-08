import React, { useState, useRef } from "react";
import Card from "./Card";
import Button from "./Button";
import api from "../services/api";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUserAstronaut,
  FaCamera,
  FaSyncAlt,
} from "react-icons/fa";

const DEFAULT_LOCKS = { round1: true, round2: false, round3: false };

const TeamAttendance = ({ team, refreshUser }) => {
  const [activeCapture, setActiveCapture] = useState(null); // { memberId, role, round }
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [localPendingLocks, setLocalPendingLocks] = useState([]); // Array of "memberId-round"
  const [locks, setLocks] = useState(DEFAULT_LOCKS);
  const [totalRounds, setTotalRounds] = useState(3);
  const videoRef = useRef(null);

  // Clean up camera on unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  React.useEffect(() => {
    const fetchLocks = async () => {
      try {
        const res = await api.get("/teams/attendance/lock");
        setLocks(res.data?.locks || DEFAULT_LOCKS);
      } catch (error) {}
    };

    const fetchTotalRounds = async () => {
      try {
        const res = await api.get("/teams/attendance/rounds");
        setTotalRounds(res.data?.totalRounds || 3);
      } catch (error) {}
    };

    fetchLocks();
    fetchTotalRounds();
  }, [team?._id]);

  if (!team || !team.leader) return null;

  const startCamera = async (memberId, role, round) => {
    const memberIdStr = memberId.toString();
    const lockKey = `${memberIdStr}-${round}`;

    if (!locks[round]) {
      return Swal.fire({
        icon: "info",
        title: "Round Locked",
        text: "Admin has not opened this round yet.",
      });
    }

    // Prevent re-submission if already pending or verified
    const member =
      memberIdStr === "leader"
        ? team.leader
        : team.members?.find((m) => m._id?.toString() === memberIdStr);
    const roundData = member?.[round] || {};
    const isVerified = roundData.status === "Verified";
    const isPendingGlobal = roundData.status === "Pending";
    const isPendingLocal = localPendingLocks.includes(lockKey);

    if (isVerified || isPendingGlobal || isPendingLocal) {
      return Swal.fire({
        icon: "info",
        title: "SYNCHRONIZED",
        text: "Personnel data already in transit or verified.",
      });
    }

    setPhoto(null);
    setActiveCapture({ memberId: memberIdStr, role, round });
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = s;
      }, 100);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Camera Access Denied" });
      setActiveCapture(null);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setActiveCapture(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    // Compress JPEG to keep file size under 500KB (server limit)
    let photoData = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
    const sizeKB = photoData.length / 1024;
    if (sizeKB > 400) {
      photoData = canvas.toDataURL("image/jpeg", 0.5); // 50% quality if still large
    }

    setPhoto(photoData);
  };

  const handleSubmit = async () => {
    if (submitting || !activeCapture) return;
    const lockKey = `${activeCapture.memberId}-${activeCapture.round}`;

    setSubmitting(true);
    // Pessimistic lock: Add to local state first
    setLocalPendingLocks((prev) => [...prev, lockKey]);

    try {
      await api.post("/teams/attendance/photo", {
        memberId: activeCapture.memberId,
        role: activeCapture.role,
        round: activeCapture.round,
        photo,
      });

      // Sync with server
      if (refreshUser) await refreshUser();

      // Success: Clean up camera
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      Swal.fire({
        icon: "success",
        title: "Frame Transmitted",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      setPhoto(null);
      setActiveCapture(null);
    } catch (error) {
      // Revert lock on error
      setLocalPendingLocks((prev) => prev.filter((k) => k !== lockKey));
      Swal.fire({ icon: "error", title: "Transmission Error" });
    } finally {
      setSubmitting(false);
    }
  };

  const renderRounds = (memberId, role, memberData) => {
    const rounds = Array.from(
      { length: totalRounds },
      (_, i) => `round${i + 1}`,
    );
    const memberIdStr = memberId.toString();

    const showSubmittedPhoto = (photo) => {
      Swal.fire({
        imageUrl: photo,
        imageWidth: 600,
        imageAlt: "Personnel Scan",
        background: "var(--bg-secondary)",
        confirmButtonColor: "var(--accent-cyan)",
        confirmButtonText: "CLOSE",
      });
    };

    return rounds.map((round) => {
      const lockKey = `${memberIdStr}-${round}`;
      const data = memberData?.[round] || {};
      const isVerified = data.status === "Verified";
      const isPendingGlobal = data.status === "Pending";
      const isPendingLocal = localPendingLocks.includes(lockKey);
      const isLocked = !locks[round];
      const photo = data.photo;

      return (
        <td key={round} style={{ padding: "1rem", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {isVerified ? (
              <FaCheckCircle color="var(--accent-success)" size={20} />
            ) : isPendingGlobal || isPendingLocal ? (
              <div
                style={{
                  color: "var(--accent-cyan)",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}
              >
                PENDING
              </div>
            ) : isLocked ? (
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}
              >
                LOCKED
              </div>
            ) : (
              <button
                onClick={() => startCamera(memberId, role, round)}
                style={{
                  background: "rgba(69, 162, 158, 0.1)",
                  border: "1px solid var(--accent-cyan)",
                  color: "var(--accent-cyan)",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <FaCamera />
              </button>
            )}
            {photo && (
              <div
                onClick={() => showSubmittedPhoto(photo)}
                style={{
                  cursor: "pointer",
                  fontSize: "0.6rem",
                  color: "var(--accent-gold)",
                  background: "rgba(212, 175, 55, 0.05)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                }}
              >
                VIEW SCAN
              </div>
            )}
          </div>
        </td>
      );
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {activeCapture && (
        <Card
          title={`OPTICAL SCAN: ${activeCapture.round.toUpperCase()}`}
          style={{ border: "2px solid var(--accent-cyan)" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "300px",
                background: "#000",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              {!photo && stream && (
                <Button onClick={capturePhoto}>CAPTURE FRAME</Button>
              )}
              {photo && (
                <>
                  <Button onClick={() => setPhoto(null)}>RE-CAPTURE</Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "SENDING..." : "TRANSMIT"}
                  </Button>
                </>
              )}
              <Button variant="secondary" onClick={stopCamera}>
                ABORT
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card
        title="PERSONNEL SYNCHRONIZATION"
        style={{ borderTop: "4px solid var(--accent-cyan)" }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    color: "var(--text-secondary)",
                    fontSize: "0.8rem",
                  }}
                >
                  SQUAD MEMBER
                </th>
                {Array.from({ length: totalRounds }, (_, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                      fontSize: "0.8rem",
                    }}
                  >
                    ROUND {String(i + 1).padStart(2, "0")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: "bold" }}>
                    {team.leader.name} (LEADER)
                  </div>
                </td>
                {renderRounds("leader", "LEADER", team.leader)}
              </tr>
              {team.members?.map((m) => (
                <tr
                  key={m._id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: "bold" }}>{m.name}</div>
                  </td>
                  {renderRounds(m._id, "MEMBER", m)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TeamAttendance;
