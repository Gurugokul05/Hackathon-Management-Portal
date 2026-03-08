import React, { useState, useEffect } from "react";
import api from "../services/api";
import Card from "./Card";
import Button from "./Button";
import Input from "./Input";
import Swal from "sweetalert2";

const ComplaintBox = () => {
  const [data, setData] = useState({ category: "General", description: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch complaint history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/communication/complaints");
      setHistory(res.data);
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/communication/complaints", data);
      Swal.fire({
        icon: "success",
        title: "Sent",
        text: "Your query has been transmitted to Central Command.",
        background: "var(--bg-secondary)",
        color: "#fff",
        confirmButtonColor: "var(--accent-cyan)",
      });
      setData({ category: "General", description: "" });
      fetchHistory(); // Refresh list
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Transmission Error",
        text: "Failed to send query.",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Card title="Raise Query / Complaint">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              Category
            </label>
            <select
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                backgroundColor: "var(--bg-secondary)",
                color: "white",
                border: "1px solid var(--border-color)",
              }}
            >
              <option>General</option>
              <option>Technical</option>
              <option>Evaluation</option>
              <option>Other</option>
            </select>
          </div>
          <Input
            label="Description"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            required
            placeholder="Describe your issue..."
          />
          <Button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Transmitting..." : "Submit Query"}
          </Button>
        </form>
      </Card>

      {history.length > 0 && (
        <Card title="Query Log" style={{ marginTop: "2rem" }}>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              paddingRight: "0.5rem",
            }}
          >
            {history.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderLeft: `3px solid ${item.status === "Resolved" ? "var(--accent-success)" : "var(--accent-cyan)"}`,
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{ fontWeight: 600, color: "var(--accent-cyan)" }}
                  >
                    {item.category}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color:
                        item.status === "Resolved"
                          ? "var(--accent-success)"
                          : "var(--accent-cyan)",
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                  {item.description}
                </p>

                {item.adminResponse && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem",
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      borderRadius: "4px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--accent-success)",
                        fontWeight: "bold",
                      }}
                    >
                      Command Response:
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.adminResponse}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ComplaintBox;
