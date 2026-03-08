import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { FaUserShield, FaKey } from "react-icons/fa";

const AdminLogin = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  React.useEffect(() => {
    document.title = "Admin Login - Vinland Saga Challenge";
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(formData.username, formData.password);
      navigate("/admin/dashboard");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Admin Access Granted",
        showConfirmButton: false,
        timer: 2000,
        background: "var(--bg-secondary)",
        color: "#fff",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Invalid Admin Credentials",
        background: "var(--bg-secondary)",
        color: "#fff",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ width: "100%", maxWidth: "550px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <FaUserShield
            size={64}
            color="var(--accent-red)"
            style={{ filter: "drop-shadow(0 0 10px var(--accent-red))" }}
          />
          <h1
            style={{ marginTop: "1rem", color: "#fff", letterSpacing: "4px" }}
          >
            COMMAND LOGIN
          </h1>
        </div>

        <Card
          style={{
            padding: "3rem",
            border: "1px solid rgba(167, 139, 250, 0.3)",
            background: "rgba(10, 10, 15, 0.9)",
            boxShadow: "0 0 50px rgba(0,0,0,0.8)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  color: "var(--accent-red)",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  letterSpacing: "1px",
                }}
              >
                ADMIN IDENTIFIER
              </label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ padding: "1.2rem", fontSize: "1.1rem" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  color: "var(--accent-red)",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  letterSpacing: "1px",
                }}
              >
                SECURITY CLEARANCE KEY
              </label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ padding: "1.2rem", fontSize: "1.1rem" }}
              />
            </div>

            <Button
              type="submit"
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "1.2rem",
                backgroundColor: "var(--accent-red)",
                fontSize: "1.2rem",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              EXECUTE AUTHORIZATION
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
