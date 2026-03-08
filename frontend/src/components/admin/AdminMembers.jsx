import React from "react";
import api from "../../services/api";
import Button from "../Button";
import { FaUserShield, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminMembers = () => {
  const [admins, setAdmins] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/admins");
      setAdmins(res.data || []);
      setLoading(false);
    } catch (e) {

      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Admin Member",
      html: `
        <input id="swal-username" class="swal2-input" placeholder="Username" style="margin-bottom:0.5rem;" />
        <input id="swal-password" type="password" class="swal2-input" placeholder="Password" style="margin-bottom:0.5rem;" />
        <div style="margin-bottom:1rem;">
          <label style="display:block; color:#fff; margin-bottom:0.3rem; font-size:0.9rem;">Role:</label>
          <select id="swal-role" class="swal2-input" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:#fff; font-size:0.95rem;">
            <option value="staff" style="background:#1a1d2e; color:#fff;">Staff (Limited Access)</option>
            <option value="admin" style="background:#1a1d2e; color:#fff;">Admin (Full Access)</option>
          </select>
        </div>
        <div style="margin-top:1rem; text-align:left; padding:0.8rem; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom:0.5rem; font-weight:600; color:var(--accent-gold);">Staff Permissions:</div>
          <label style="display:block; margin-bottom:0.4rem; cursor:pointer;"><input type="checkbox" id="perm-attendance" style="margin-right:0.5rem;" /> Attendance Management</label>
          <label style="display:block; cursor:pointer;"><input type="checkbox" id="perm-marks" style="margin-right:0.5rem;" /> Marks Update</label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      background: "var(--bg-secondary)",
      color: "#fff",
      preConfirm: () => {
        const username = document.getElementById("swal-username").value;
        const password = document.getElementById("swal-password").value;
        const role = document.getElementById("swal-role").value;
        const permissions = [];
        if (document.getElementById("perm-attendance").checked)
          permissions.push("attendance:update");
        if (document.getElementById("perm-marks").checked)
          permissions.push("marks:update");
        if (!username || !password) {
          Swal.showValidationMessage("Username and password required");
        }
        return { username, password, role, permissions };
      },
    });

    if (formValues) {
      try {
        await api.post("/admins", formValues);
        Swal.fire({
          icon: "success",
          title: "Admin created",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        fetchAdmins();
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: e.response?.data?.message || "Failed to create admin",
        });
      }
    }
  };

  const handleEdit = async (admin) => {
    const perms = admin.permissions || [];
    const { value: formValues } = await Swal.fire({
      title: "Edit Admin Member",
      html: `
        <input id="swal-username" class="swal2-input" placeholder="Username" value="${admin.username}" style="margin-bottom:0.5rem;" />
        <input id="swal-password" type="password" class="swal2-input" placeholder="New Password (leave blank to keep)" style="margin-bottom:0.5rem;" />
        <div style="margin-bottom:1rem;">
          <label style="display:block; color:#fff; margin-bottom:0.3rem; font-size:0.9rem;">Role:</label>
          <select id="swal-role" class="swal2-input" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:#fff; font-size:0.95rem;">
            <option value="staff" ${admin.role === "staff" ? "selected" : ""} style="background:#1a1d2e; color:#fff;">Staff (Limited Access)</option>
            <option value="admin" ${admin.role === "admin" ? "selected" : ""} style="background:#1a1d2e; color:#fff;">Admin (Full Access)</option>
          </select>
        </div>
        <div style="margin-top:1rem; text-align:left; padding:0.8rem; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom:0.5rem; font-weight:600; color:var(--accent-gold);">Staff Permissions:</div>
          <label style="display:block; margin-bottom:0.4rem; cursor:pointer;"><input type="checkbox" id="perm-attendance" ${perms.includes("attendance:update") ? "checked" : ""} style="margin-right:0.5rem;" /> Attendance Management</label>
          <label style="display:block; cursor:pointer;"><input type="checkbox" id="perm-marks" ${perms.includes("marks:update") ? "checked" : ""} style="margin-right:0.5rem;" /> Marks Update</label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      background: "var(--bg-secondary)",
      color: "#fff",
      preConfirm: () => {
        const username = document.getElementById("swal-username").value;
        const password = document.getElementById("swal-password").value;
        const role = document.getElementById("swal-role").value;
        const permissions = [];
        if (document.getElementById("perm-attendance").checked)
          permissions.push("attendance:update");
        if (document.getElementById("perm-marks").checked)
          permissions.push("marks:update");
        if (!username) {
          Swal.showValidationMessage("Username required");
        }
        const update = { username, role, permissions };
        if (password) update.password = password;
        return update;
      },
    });

    if (formValues) {
      try {
        await api.put(`/admins/${admin._id}`, formValues);
        Swal.fire({
          icon: "success",
          title: "Admin updated",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        fetchAdmins();
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: e.response?.data?.message || "Failed to update admin",
        });
      }
    }
  };

  const handleDelete = async (admin) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: `Delete ${admin.username}?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "var(--accent-danger)",
      background: "var(--bg-secondary)",
      color: "#fff",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/admins/${admin._id}`);
      Swal.fire({
        icon: "success",
        title: "Admin deleted",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
      fetchAdmins();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: e.response?.data?.message || "Failed to delete",
      });
    }
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <FaUserShield style={{ color: "var(--accent-gold)" }} />
          <h4 style={{ margin: 0 }}>Admin Members</h4>
        </div>
        <Button
          onClick={handleAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <FaPlus /> Add Member
        </Button>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : (
        <div style={{ display: "grid", gap: "0.8rem" }}>
          {admins.map((admin) => (
            <div
              key={admin._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.8rem 1rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>
                  {admin.username}
                </div>
                <div
                  style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                >
                  {admin.role === "admin"
                    ? "Full Admin"
                    : `Staff - ${admin.permissions?.join(", ") || "No permissions"}`}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  onClick={() => handleEdit(admin)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <FaEdit /> Edit
                </Button>
                <Button
                  onClick={() => handleDelete(admin)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                    backgroundColor: "var(--accent-danger)",
                    borderColor: "var(--accent-danger)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
