import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserAstronaut } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Login = () => {
  const { loginTeam } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ teamId: "", email: "" });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    document.title = "Warrior Portal - Vinland Saga Challenge";
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginTeam(formData.teamId, formData.email);
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: error.response?.data?.message || "Invalid Credentials",
        background: "rgba(20, 20, 25, 0.95)",
        color: "#fff",
        confirmButtonColor: "var(--accent-danger)",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 3vw, 2rem)",
        background:
          "linear-gradient(135deg, #0b0c10 0%, #1f2833 50%, #0b0c10 100%)",
        position: "relative",
      }}
    >
      <Navbar />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "650px",
          marginTop: "clamp(2rem, 10vw, 4rem)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "1.5rem",
              borderRadius: "50%",
              background: "rgba(69, 162, 158, 0.1)",
              border: "1px solid var(--accent-cyan)",
              marginBottom: "1rem",
              boxShadow: "0 0 30px rgba(69, 162, 158, 0.2)",
            }}
          >
            <FaUserAstronaut size={48} color="var(--accent-cyan)" />
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: "2.5rem",
              letterSpacing: "6px",
              margin: 0,
            }}
          >
            WARRIOR SUMMONS
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "0.5rem",
              fontSize: "1rem",
              letterSpacing: "2px",
            }}
          >
            SQUADRON PORTAL ACCESS
          </p>
        </div>

        <Card
          style={{
            padding: "3rem",
            border: "1px solid rgba(69, 162, 158, 0.2)",
            background: "rgba(10, 10, 15, 0.8)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <label
                style={{
                  color: "var(--accent-cyan)",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  letterSpacing: "2px",
                }}
              >
                SQUADRON IDENTIFIER
              </label>
              <Input
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                placeholder="E.G. HACK26-XXXXX"
                required
                style={{
                  padding: "1.2rem",
                  fontSize: "1.1rem",
                  background: "rgba(255,255,255,0.03)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <label
                style={{
                  color: "var(--accent-cyan)",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  letterSpacing: "2px",
                }}
              >
                ACCESS PROTOCOL (EMAIL)
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="COMMANDER@SQUADRON.COM"
                required
                style={{
                  padding: "1.2rem",
                  fontSize: "1.1rem",
                  background: "rgba(255,255,255,0.03)",
                }}
              />
            </div>

            <Button
              type="submit"
              style={{
                width: "100%",
                marginTop: "1rem",
                padding: "1.2rem",
                fontSize: "1.2rem",
                fontWeight: "bold",
                letterSpacing: "4px",
                boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)",
              }}
              disabled={loading}
            >
              {loading ? "SYNCHRONIZING..." : "AUTHENTICATE"}
            </Button>
          </form>
        </Card>
        <p
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.8rem",
            opacity: 0.5,
          }}
        >
          SECURE ENCRYPTED CHANNEL 256-BIT SSL
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
