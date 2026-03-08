import React, { useEffect, useState } from "react";
import api from "../services/api";
import Card from "./Card";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/communication/notices");
        setNotices(res.data);
      } catch (error) {}
    };
    fetchNotices();
  }, []);

  return (
    <Card
      title="Notice Board"
      style={{ height: "100%", maxHeight: "400px", overflowY: "auto" }}
    >
      {notices.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>No new notices.</p>
      ) : (
        notices.map((notice) => (
          <div
            key={notice._id}
            style={{
              padding: "0.75rem",
              marginBottom: "0.75rem",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "var(--radius-sm)",
              borderLeft: `4px solid ${
                notice.category === "Important"
                  ? "var(--accent-danger)"
                  : notice.category === "Round Update"
                    ? "var(--accent-cyan)"
                    : "var(--text-secondary)"
              }`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.25rem",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {notice.title}
              </span>
              <span
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
              >
                {new Date(notice.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
              {notice.description}
            </p>
          </div>
        ))
      )}
    </Card>
  );
};

export default NoticeBoard;
