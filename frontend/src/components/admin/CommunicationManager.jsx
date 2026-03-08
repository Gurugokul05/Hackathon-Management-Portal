import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Card from "../Card";
import Button from "../Button";
import Input from "../Input";
import Swal from "sweetalert2";

const CommunicationManager = () => {
  const [noticeData, setNoticeData] = useState({
    title: "",
    description: "",
    category: "General",
  });
  const [complaints, setComplaints] = useState([]);

  const [notices, setNotices] = useState([]);
  const [editingNotice, setEditingNotice] = useState(null);

  useEffect(() => {
    fetchComplaints();
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/communication/notices");
      setNotices(res.data);
    } catch (error) {}
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/communication/complaints");
      setComplaints(res.data);
    } catch (error) {}
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await api.put(
          `/communication/notices/${editingNotice._id}`,
          editingNotice,
        );
        Swal.fire({
          icon: "success",
          title: "Notice Updated",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        setEditingNotice(null);
      } else {
        await api.post("/communication/notices", noticeData);
        Swal.fire({
          icon: "success",
          title: "Notice Posted",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        setNoticeData({ title: "", description: "", category: "General" });
      }
      fetchNotices();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Operation failed",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
    }
  };

  const handleDeleteNotice = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Notice?",
      text: "This will permanently remove the bulletin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--accent-danger)",
      cancelButtonColor: "var(--text-muted)",
      confirmButtonText: "DELETE",
      background: "var(--bg-secondary)",
      color: "#fff",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/communication/notices/${id}`);
        Swal.fire({
          icon: "success",
          title: "Notice Removed",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        fetchNotices();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text:
            error.response?.data?.message ||
            "The server may need a restart to recognize this new command.",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
      }
    }
  };

  const handleResolve = async (id) => {
    const { value: response } = await Swal.fire({
      title: "Enter Admin Response",
      input: "textarea",
      inputLabel: "Response",
      inputPlaceholder: "Type your reply here...",
      inputAttributes: {
        "aria-label": "Type your reply here",
      },
      showCancelButton: true,
      background: "var(--bg-secondary)",
      color: "#fff",
      confirmButtonColor: "var(--accent-gold)",
    });

    if (response) {
      try {
        await api.put(`/communication/complaints/${id}`, {
          status: "Resolved",
          adminResponse: response,
        });
        fetchComplaints();
        Swal.fire({
          icon: "success",
          title: "Resolved",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Resolve failed",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
      }
    }
  };

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Card title={editingNotice ? "Edit Notice" : "Post Notice"}>
          <form onSubmit={handleNoticeSubmit}>
            <Input
              label="Title"
              value={editingNotice ? editingNotice.title : noticeData.title}
              onChange={(e) =>
                editingNotice
                  ? setEditingNotice({
                      ...editingNotice,
                      title: e.target.value,
                    })
                  : setNoticeData({ ...noticeData, title: e.target.value })
              }
              required
            />
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
                value={
                  editingNotice ? editingNotice.category : noticeData.category
                }
                onChange={(e) =>
                  editingNotice
                    ? setEditingNotice({
                        ...editingNotice,
                        category: e.target.value,
                      })
                    : setNoticeData({ ...noticeData, category: e.target.value })
                }
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
                <option>Important</option>
                <option>Round Update</option>
              </select>
            </div>
            <Input
              label="Description"
              value={
                editingNotice
                  ? editingNotice.description
                  : noticeData.description
              }
              onChange={(e) =>
                editingNotice
                  ? setEditingNotice({
                      ...editingNotice,
                      description: e.target.value,
                    })
                  : setNoticeData({
                      ...noticeData,
                      description: e.target.value,
                    })
              }
              required
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button type="submit" style={{ flex: 1 }}>
                {editingNotice ? "Update Notice" : "Post Notice"}
              </Button>
              {editingNotice && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingNotice(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card title="Bulletin Board Management">
          {notices.length === 0 ? (
            <p>No notices posted.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  style={{
                    padding: "1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.05)",
                        color:
                          notice.category === "Important"
                            ? "var(--accent-danger)"
                            : notice.category === "Round Update"
                              ? "var(--accent-gold)"
                              : "var(--text-muted)",
                      }}
                    >
                      {notice.category.toUpperCase()}
                    </span>
                    <div style={{ display: "flex", gap: "0.8rem" }}>
                      <button
                        onClick={() => setEditingNotice(notice)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--accent-gold)",
                          fontSize: "0.7rem",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(notice._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--accent-danger)",
                          fontSize: "0.7rem",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                  <h4 style={{ margin: "0.5rem 0", color: "#fff" }}>
                    {notice.title}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {notice.description}
                  </p>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.2)",
                      marginTop: "0.5rem",
                    }}
                  >
                    POSTED: {new Date(notice.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card title="Complaints / Queries">
        {complaints.length === 0 ? (
          <p>No complaints.</p>
        ) : (
          <div style={{ maxHeight: "800px", overflowY: "auto" }}>
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid var(--border-color)",
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
                    style={{ fontWeight: "bold", color: "var(--accent-gold)" }}
                  >
                    {complaint.team?.teamName} ({complaint.team?.teamId})
                  </span>
                  <span
                    style={{
                      color:
                        complaint.status === "Resolved"
                          ? "var(--accent-success)"
                          : "var(--accent-danger)",
                      border: `1px solid ${complaint.status === "Resolved" ? "var(--accent-success)" : "var(--accent-danger)"}`,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0.5rem 0",
                    fontStyle: "italic",
                    color: "var(--text-secondary)",
                  }}
                >
                  "{complaint.category}: {complaint.description}"
                </p>
                {complaint.status !== "Resolved" && (
                  <Button
                    onClick={() => handleResolve(complaint._id)}
                    style={{ fontSize: "0.8rem" }}
                  >
                    Resolve & Reply
                  </Button>
                )}
                {complaint.adminResponse && (
                  <p
                    style={{
                      marginTop: "0.5rem",
                      color: "var(--accent-success)",
                    }}
                  >
                    Admin: {complaint.adminResponse}
                  </p>
                )}
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.2)",
                    marginTop: "0.5rem",
                  }}
                >
                  RECEIVED: {new Date(complaint.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CommunicationManager;
