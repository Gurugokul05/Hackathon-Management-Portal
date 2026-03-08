import React from "react";
import api from "../../services/api";
import Button from "../Button";
import { FaCog, FaSave } from "react-icons/fa";
import AdminMembers from "./AdminMembers";

const EventSettings = () => {
  const [eventName, setEventName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/settings");
        if (mounted) {
          setEventName(res.data?.eventName || "");
        }
      } catch (e) {
        // no-op
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await api.put("/settings/event-name", { eventName });
      setMessage("Event name updated successfully.");
    } catch (e) {
      setMessage("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1rem",
        }}
      >
        <FaCog style={{ color: "var(--accent-red)" }} />
        <h3 style={{ margin: 0 }}>Event Settings</h3>
      </div>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name (e.g., Hackathon 2026)"
              style={{
                padding: "0.8rem 1rem",
                minWidth: "320px",
                borderRadius: "8px",
              }}
            />
            <Button
              onClick={onSave}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaSave /> {saving ? "Saving..." : "Save"}
            </Button>
            {message && (
              <span style={{ color: "var(--text-muted)" }}>{message}</span>
            )}
          </div>

          {/* Admin Members Management */}
          <AdminMembers />
        </>
      )}
    </div>
  );
};

export default EventSettings;
