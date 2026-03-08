import React from "react";
import api from "../services/api";

const DynamicEventName = () => {
  const [eventName, setEventName] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/settings");
        if (mounted) setEventName(res.data?.eventName || "");
      } catch (e) {
        // silent fail
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!eventName) return null;

  return (
    <div style={{ marginBottom: "1.2rem", color: "var(--accent-cyan)" }}>
      <span
        style={{
          fontSize: "2.5rem",
          fontWeight: 800,
          letterSpacing: "2px",
          textShadow: "0 0 18px rgba(69, 162, 158, 0.4)",
        }}
      >
        {eventName}
      </span>
    </div>
  );
};

export default DynamicEventName;
