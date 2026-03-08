import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Card from "../Card";
import Input from "../Input";
import Button from "../Button";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaFolderOpen,
  FaExternalLinkAlt,
  FaDatabase,
  FaFileDownload,
  FaTrash,
} from "react-icons/fa";

const AdminSubmissionManager = () => {
  const [view, setView] = useState("portals"); // portals, submissions
  const [portals, setPortals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPortal, setNewPortal] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (view === "portals") {
        const res = await api.get("/submissions/portals");
        setPortals(res.data);
      } else {
        const res = await api.get("/submissions/admin/all");
        setSubmissions(res.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Create new portal (fixes blank screen due to missing handler)
  const handleCreatePortal = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newPortal };
      // Ensure deadline is a valid date string
      if (!payload.deadline) {
        return Swal.fire({ icon: "warning", title: "Deadline required" });
      }
      await api.post("/submissions/admin/portals", payload);
      Swal.fire({
        icon: "success",
        title: "Portal Activated",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      setNewPortal({ title: "", description: "", deadline: "" });
      fetchData();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Activation Failed" });
    }
  };

  const exportToCSV = () => {
    // Require selecting a specific round for export
    if (selectedPortal === "all") {
      return Swal.fire({
        icon: "info",
        title: "Select a specific round to export",
      });
    }

    if (!filteredSubmissions || filteredSubmissions.length === 0) {
      return Swal.fire({
        icon: "info",
        title: "No data to export for this round",
      });
    }

    const headers = [
      "Team Name",
      "Team ID",
      "Leader Name",
      "Leader Email",
      "Portal Title",
      "Submission Link",
      "Submitted At",
    ];
    const csvRows = [headers.join(",")];

    filteredSubmissions.forEach((team) => {
      team.submissions.forEach((sub) => {
        const row = [
          `"${team.teamName}"`,
          `"${team.teamId}"`,
          `"${team.leader.name}"`,
          `"${team.leader.email}"`,
          `"${sub.portalId?.title || "Unknown"}"`,
          `"${sub.link}"`,
          `"${new Date(sub.submittedAt).toLocaleString()}"`,
        ];
        csvRows.push(row.join(","));
      });
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const portalTitle =
      portals.find((p) => p._id === selectedPortal)?.title || "Round";
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Submissions_${portalTitle.replace(/\s+/g, "_")}_${new Date().toLocaleDateString()}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Admin quick editor removed per request

  const handleDeleteSubmission = async (teamId, portalId) => {
    const confirm = await Swal.fire({
      title: "Terminate Submission?",
      text: "This action will purge the record from the repository.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--accent-danger)",
      cancelButtonColor: "var(--text-muted)",
      confirmButtonText: "PURGE DATA",
      background: "var(--bg-secondary)",
      color: "#fff",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/submissions/admin/${teamId}/${portalId}`);
        Swal.fire({
          icon: "success",
          title: "Data Purged",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        fetchData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Purge Failed" });
      }
    }
  };

  const [selectedPortal, setSelectedPortal] = useState("all");

  const handleBulkDelete = async (portalId, portalTitle) => {
    const confirm = await Swal.fire({
      title: `DELETE ROUND: ${portalTitle.toUpperCase()}`,
      text: "CAUTION: This will permanently delete all team submissions for this round. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--accent-danger)",
      confirmButtonText: "DELETE SUBMISSIONS",
      background: "var(--bg-secondary)",
      color: "#fff",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/submissions/admin/${portalId}`);
        Swal.fire({
          icon: "success",
          title: "Data Deleted",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        fetchData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Delete Failed" });
      }
    }
  };

  const [editingPortal, setEditingPortal] = useState(null);

  const handleUpdatePortal = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/submissions/admin/portals/${editingPortal._id}`,
        editingPortal,
      );
      Swal.fire({
        icon: "success",
        title: "Portal Updated",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      setEditingPortal(null);
      fetchData();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Update Failed" });
    }
  };

  const handleDeletePortal = async (id, title) => {
    const confirm = await Swal.fire({
      title: `DELETE PORTAL: ${title.toUpperCase()}`,
      text: "CAUTION: This will permanently remove the portal AND ALL associated team submissions. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--accent-danger)",
      confirmButtonText: "DELETE EVERYTHING",
      background: "var(--bg-secondary)",
      color: "#fff",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/submissions/admin/portals/${id}`);
        Swal.fire({
          icon: "success",
          title: "Portal Removed",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        fetchData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Deletion Failed" });
      }
    }
  };

  const filteredSubmissions =
    selectedPortal === "all"
      ? submissions
      : submissions
          .map((team) => ({
            ...team,
            submissions: team.submissions.filter(
              (s) =>
                s.portalId?._id === selectedPortal ||
                s.portalId === selectedPortal,
            ),
          }))
          .filter((team) => team.submissions.length > 0);

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Button
          onClick={() => setView("portals")}
          variant={view === "portals" ? "primary" : "secondary"}
        >
          PORTAL MANAGEMENT
        </Button>
        <Button
          onClick={() => setView("submissions")}
          variant={view === "submissions" ? "primary" : "secondary"}
        >
          ROUND REPOSITORY
        </Button>
      </div>

      {view === "portals" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "2rem",
          }}
        >
          <Card title={editingPortal ? "EDIT PORTAL" : "GENERATE NEW PORTAL"}>
            <form
              onSubmit={editingPortal ? handleUpdatePortal : handleCreatePortal}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <Input
                label="PORTAL TITLE"
                value={editingPortal ? editingPortal.title : newPortal.title}
                onChange={(e) =>
                  editingPortal
                    ? setEditingPortal({
                        ...editingPortal,
                        title: e.target.value,
                      })
                    : setNewPortal({ ...newPortal, title: e.target.value })
                }
                placeholder="E.G. ROUND 1 PROJECT"
                required
              />
              <Input
                label="DESCRIPTION"
                value={
                  editingPortal
                    ? editingPortal.description
                    : newPortal.description
                }
                onChange={(e) =>
                  editingPortal
                    ? setEditingPortal({
                        ...editingPortal,
                        description: e.target.value,
                      })
                    : setNewPortal({
                        ...newPortal,
                        description: e.target.value,
                      })
                }
                placeholder="SUBMISSION REQUIREMENTS"
              />
              <Input
                label="DEADLINE"
                type="datetime-local"
                value={
                  editingPortal
                    ? editingPortal.deadline
                      ? new Date(editingPortal.deadline)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                    : newPortal.deadline
                }
                onChange={(e) =>
                  editingPortal
                    ? setEditingPortal({
                        ...editingPortal,
                        deadline: e.target.value,
                      })
                    : setNewPortal({ ...newPortal, deadline: e.target.value })
                }
                required
              />
              {editingPortal && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <label
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    STATUS:
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPortal({
                        ...editingPortal,
                        isActive: !editingPortal.isActive,
                      })
                    }
                    style={{
                      padding: "0.3rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      background: editingPortal.isActive
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(255,255,255,0.05)",
                      color: editingPortal.isActive
                        ? "var(--accent-success)"
                        : "var(--text-muted)",
                      border: "1px solid currentColor",
                      cursor: "pointer",
                    }}
                  >
                    {editingPortal.isActive ? "OPERATIONAL" : "OFFLINE"}
                  </button>
                </div>
              )}
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button type="submit" style={{ flex: 1, marginTop: "1rem" }}>
                  {editingPortal ? "SAVE CHANGES" : "ACTIVATE PORTAL"}
                </Button>
                {editingPortal && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingPortal(null)}
                    style={{ flex: 1, marginTop: "1rem" }}
                  >
                    CANCEL
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {loading ? (
              <p>LOADING PORTALS...</p>
            ) : (
              portals.map((p) => (
                <Card
                  key={p._id}
                  style={{
                    borderLeft: `4px solid ${editingPortal?._id === p._id ? "var(--accent-gold)" : "var(--accent-red)"}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, color: "var(--accent-red)" }}>
                        {p.title}
                      </h3>
                      <p
                        style={{
                          margin: "0.5rem 0",
                          fontSize: "0.9rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {p.description}
                      </p>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--accent-gold)",
                        }}
                      >
                        DEADLINE: {new Date(p.deadline).toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        alignItems: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          padding: "0.3rem 0.8rem",
                          borderRadius: "20px",
                          fontSize: "0.7rem",
                          background: p.isActive
                            ? "rgba(76, 175, 80, 0.1)"
                            : "rgba(255,255,255,0.05)",
                          color: p.isActive
                            ? "var(--accent-success)"
                            : "var(--text-muted)",
                          border: "1px solid currentColor",
                        }}
                      >
                        {p.isActive ? "OPERATIONAL" : "OFFLINE"}
                      </span>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                          onClick={() => setEditingPortal(p)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-gold)",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleBulkDelete(p._id, p.title)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-gold)",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                          }}
                        >
                          PURGE DATA
                        </button>
                        <button
                          onClick={() => handleDeletePortal(p._id, p.title)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-danger)",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                          }}
                        >
                          DELETE PORTAL
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {view === "submissions" && (
        <Card title="CENTRAL DATA REPOSITORY" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
              >
                FILTER BY ROUND:
              </span>
              <select
                value={selectedPortal}
                onChange={(e) => setSelectedPortal(e.target.value)}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "0.5rem",
                  borderRadius: "4px",
                }}
              >
                <option value="all">ALL ROUNDS</option>
                {portals.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={exportToCSV}
              variant="secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                border: "1px solid var(--accent-success)",
                color: "var(--accent-success)",
              }}
            >
              <FaFileDownload /> EXPORT TO EXCEL
            </Button>
          </div>

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
                    style={{ padding: "1rem", color: "var(--text-secondary)" }}
                  >
                    SQUADRON
                  </th>
                  <th
                    style={{ padding: "1rem", color: "var(--text-secondary)" }}
                  >
                    MISSION
                  </th>
                  <th
                    style={{ padding: "1rem", color: "var(--text-secondary)" }}
                  >
                    LINK ADDRESS
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      color: "var(--text-secondary)",
                      textAlign: "center",
                    }}
                  >
                    TIMESTAMP
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      color: "var(--text-secondary)",
                      textAlign: "center",
                    }}
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((team) =>
                  team.submissions.map((sub, idx) => (
                    <tr
                      key={`${team._id}-${idx}`}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: "bold", color: "#fff" }}>
                          {team.teamName}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {team.teamId}
                        </div>
                      </td>
                      <td
                        style={{ padding: "1rem", color: "var(--accent-gold)" }}
                      >
                        {sub.portalId?.title || "Unknown Portal"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <a
                          href={sub.link.startsWith('http://') || sub.link.startsWith('https://') ? sub.link : `https://${sub.link}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: "var(--accent-gold)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "300px",
                          }}
                        >
                          <FaExternalLinkAlt size={12} /> {sub.link}
                        </a>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(sub.submittedAt).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          display: "flex",
                          gap: "0.8rem",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => {
                            const newLink = prompt(
                              "Enter new submission link:",
                              sub.link,
                            );
                            if (newLink !== null) {
                              api
                                .put(
                                  `/submissions/admin/${team._id}/${sub.portalId?._id || sub.portalId}`,
                                  { link: newLink },
                                )
                                .then(() => {
                                  Swal.fire({
                                    icon: "success",
                                    title: "Link Updated",
                                    background: "var(--bg-secondary)",
                                    color: "#fff",
                                  });
                                  fetchData();
                                })
                                .catch(() =>
                                  Swal.fire({
                                    icon: "error",
                                    title: "Update Failed",
                                  }),
                                );
                            }
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-gold)",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                            padding: "0.4rem 0.8rem",
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSubmission(
                              team._id,
                              sub.portalId?._id || sub.portalId,
                            )
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-danger)",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                            padding: "0.4rem 0.8rem",
                          }}
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminSubmissionManager;
