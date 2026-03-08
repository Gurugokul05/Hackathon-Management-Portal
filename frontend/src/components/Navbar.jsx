import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import { FaSignOutAlt, FaRobot, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "90%",
          maxWidth: "1200px",
          padding: "0.8rem 2rem",
          background: "rgba(11, 12, 16, 0.7)",
          backdropFilter: "blur(15px)",
          borderRadius: "50px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            textDecoration: "none",
          }}
        >
          <FaRobot size={28} color="var(--accent-cyan)" />
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "4px",
            }}
          >
            PIXEL<span style={{ color: "var(--accent-cyan)" }}>IT</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="desktop-menu"
        >
          <Link
            to="/leaderboard"
            style={{
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              letterSpacing: "2px",
              textDecoration: "none",
            }}
          >
            RANKINGS
          </Link>
          {user ? (
            <>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "1px",
                    height: "20px",
                    background: "rgba(255,255,255,0.2)",
                  }}
                ></div>
                <span
                  style={{
                    color: "var(--accent-cyan)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  {user.teamName?.toUpperCase() || user.username?.toUpperCase()}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                style={{
                  padding: "0.4rem 1.2rem",
                  fontSize: "0.8rem",
                  borderRadius: "20px",
                  borderColor: "var(--accent-danger)",
                  color: "var(--accent-danger)",
                }}
              >
                DISCONNECT
              </Button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/login">
                <Button
                  variant="secondary"
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "0.9rem",
                    borderRadius: "20px",
                  }}
                >
                  LOGIN
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="primary"
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "0.9rem",
                    borderRadius: "20px",
                  }}
                >
                  ENLIST
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: "var(--accent-cyan)",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "400px",
            background: "rgba(11, 12, 16, 0.95)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            padding: "1.5rem",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          className="mobile-menu"
        >
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontSize: "1rem",
              letterSpacing: "2px",
              textDecoration: "none",
              padding: "0.8rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            RANKINGS
          </Link>
          {user ? (
            <>
              <div
                style={{
                  color: "var(--accent-cyan)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  padding: "0.8rem",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {user.teamName?.toUpperCase() || user.username?.toUpperCase()}
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  fontSize: "0.9rem",
                  borderRadius: "10px",
                  borderColor: "var(--accent-danger)",
                  color: "var(--accent-danger)",
                }}
              >
                DISCONNECT
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="secondary"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    fontSize: "0.9rem",
                    borderRadius: "10px",
                  }}
                >
                  LOGIN
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="primary"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    fontSize: "0.9rem",
                    borderRadius: "10px",
                  }}
                >
                  ENLIST
                </Button>
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
      @media (max-width: 768px) {
        .desktop-menu {
          display: none !important;
        }
        .mobile-menu-btn {
          display: block !important;
        }
      }
    `}</style>
    </>
  );
};

export default Navbar;
