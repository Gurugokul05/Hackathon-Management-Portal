import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Card from "../components/Card";
import DynamicEventName from "../components/DynamicEventName";
import {
  FaBrain,
  FaRobot,
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaFileAlt,
  FaLightbulb,
  FaUserShield,
  FaNetworkWired,
  FaEye,
  FaChartLine,
} from "react-icons/fa";

const LandingPage = () => {
  React.useEffect(() => {
    document.title = "PIXELIT - AI Hackathon";
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />

      {/* Hero Section */}
      <header
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "clamp(3rem, 10vh, 6rem) 1rem",
          position: "relative",
          overflow: "hidden",
          minHeight: "90vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ zIndex: 2 }}
        >
          <h1
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              marginBottom: "1rem",
              textShadow: "0 0 30px rgba(102, 252, 241, 0.6)",
              letterSpacing: "clamp(2px, 1vw, 4px)",
            }}
          >
            PIXEL<span style={{ color: "var(--accent-cyan)" }}>IT</span>
          </h1>
          {/* Dynamic event name (admin-editable) */}
          <DynamicEventName />
          <p
            style={{
              fontSize: "clamp(1rem, 3vw, 1.5rem)",
              color: "var(--text-muted)",
              maxWidth: "800px",
              margin: "0 auto 3rem",
              textShadow: "0 0 5px rgba(0,0,0,0.5)",
              padding: "0 1rem",
            }}
          >
            Build Intelligent Solutions. Innovate with AI. Shape the Future.
          </p>
          <div
            style={{
              display: "flex",
              gap: "clamp(1rem, 3vw, 2rem)",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "0 1rem",
            }}
          >
            <Link to="/login">
              <Button
                variant="primary"
                style={{
                  padding:
                    "clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 4vw, 3rem)",
                  fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                  boxShadow: "0 0 25px rgba(69, 162, 158, 0.6)",
                }}
              >
                <FaBrain style={{ marginRight: "0.5rem" }} /> Enter Portal
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="secondary"
                style={{
                  padding:
                    "clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 4vw, 3rem)",
                  fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                  backgroundColor: "transparent",
                  border: "2px solid var(--accent-cyan)",
                  color: "var(--accent-cyan)",
                }}
              >
                Join The Challenge
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Background Decor - AI theme */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(102, 252, 241, 0.15) 0%, rgba(138, 43, 226, 0.1) 50%, transparent 70%)",
            zIndex: 1,
            pointerEvents: "none",
            animation: "pulse 4s ease-in-out infinite",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            fontSize: "4rem",
            opacity: 0.03,
            transform: "rotate(15deg)",
          }}
        >
          🤖
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "15%",
            fontSize: "3rem",
            opacity: 0.03,
            transform: "rotate(-10deg)",
          }}
        >
          🧠
        </div>
      </header>

      {/* Event Details / Timeline */}
      <section
        className="container"
        style={{ padding: "clamp(2rem, 5vw, 4rem) 1rem" }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            marginBottom: "clamp(1.5rem, 4vw, 3rem)",
            color: "var(--accent-violet)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          }}
        >
          Event Briefing
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              style={{
                height: "100%",
                borderTop: "4px solid var(--accent-cyan)",
              }}
            >
              <FaCalendarAlt
                size={40}
                color="var(--accent-cyan)"
                style={{ marginBottom: "1rem" }}
              />
              <h3>Timeline</h3>
              <ul
                style={{
                  listStyle: "none",
                  marginTop: "1rem",
                  color: "var(--text-muted)",
                }}
              >
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>09:00</strong> - Opening Ceremony
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>10:00</strong> - Hackathon Begins
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>18:00</strong> - Round 1 Evaluation
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>09:00 (+1)</strong> - Final Pitches
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              style={{
                height: "100%",
                borderTop: "4px solid var(--accent-violet)",
              }}
            >
              <FaBrain
                size={40}
                color="var(--accent-violet)"
                style={{ marginBottom: "1rem" }}
              />
              <h3>Themes</h3>
              <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
                Explore <strong>Machine Learning</strong>,{" "}
                <strong>Natural Language Processing</strong>, and{" "}
                <strong>Computer Vision</strong>. Build intelligent AI solutions
                with cutting-edge technology.
              </p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              style={{
                height: "100%",
                borderTop: "4px solid var(--accent-cyan)",
              }}
            >
              <FaTrophy
                size={40}
                color="var(--accent-cyan)"
                style={{ marginBottom: "1rem" }}
              />
              <h3>Rewards</h3>
              <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
                <span
                  style={{ color: "var(--accent-cyan)", fontWeight: "bold" }}
                >
                  Amazing Prizes!
                </span>{" "}
                <br />
                Tech Gear & Cloud Credits for Winners
                <br />
                Certificates for all participants
                <br />
                Exclusive PIXELIT Merch
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* technical Tracks / Mission Tracks */}
      <section
        className="container"
        style={{
          padding: "clamp(3rem, 8vw, 6rem) 1rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "clamp(2rem, 5vw, 4rem)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          }}
        >
          Competition{" "}
          <span style={{ color: "var(--accent-cyan)" }}>Tracks</span>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: "clamp(1rem, 3vw, 2rem)",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {[
            {
              title: "Machine Learning",
              icon: <FaRobot />,
              desc: "Build intelligent systems using TensorFlow, PyTorch, and scikit-learn.",
            },
            {
              title: "Computer Vision",
              icon: <FaEye />,
              desc: "Create AI-powered image and video analysis applications.",
            },
            {
              title: "Natural Language Processing",
              icon: <FaNetworkWired />,
              desc: "Develop smart text analysis, chatbots, and language understanding systems.",
            },
            {
              title: "Data Science & Analytics",
              icon: <FaChartLine />,
              desc: "Extract insights from data using advanced analytics and visualization.",
            },
          ].map((track, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              style={{
                padding: "clamp(1.5rem, 3vw, 2rem)",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255,255,255,0.05)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  color: "var(--accent-cyan)",
                  marginBottom: "1.5rem",
                }}
              >
                {track.icon}
              </div>
              <h3 style={{ marginBottom: "1rem" }}>{track.title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {track.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section removed as requested */}

      {/* (Removed Strategic Partners section as requested) */}

      {/* About the Club */}
      <section
        style={{
          backgroundColor: "rgba(31, 40, 51, 0.3)",
          padding: "clamp(3rem, 8vw, 6rem) 1rem",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                marginBottom: "clamp(1rem, 3vw, 2rem)",
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              }}
            >
              The{" "}
              <span style={{ color: "var(--accent-violet)" }}>Architects</span>
            </h2>
            <p
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                marginBottom: "clamp(2rem, 4vw, 3rem)",
                lineHeight: "1.8",
                padding: "0 1rem",
              }}
            >
              Organized by the <strong>PIXELIT Club</strong> — a club created by
              students and for students. We are a student-led community of AI
              enthusiasts, developers, and innovators building intelligent
              solutions and pushing the boundaries of artificial intelligence.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
                gap: "clamp(1rem, 3vw, 2rem)",
                justifyContent: "center",
                width: "100%",
                maxWidth: "600px",
              }}
            >
              <div
                style={{
                  padding: "clamp(1.5rem, 3vw, 2rem)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(102, 252, 241, 0.05)",
                }}
              >
                <h1
                  style={{
                    color: "var(--accent-cyan)",
                    margin: 0,
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                  }}
                >
                  500+
                </h1>
                <p style={{ margin: 0, fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
                  Participants
                </p>
              </div>
              <div
                style={{
                  padding: "clamp(1.5rem, 3vw, 2rem)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(167, 139, 250, 0.05)",
                }}
              >
                <h1
                  style={{
                    color: "var(--accent-violet)",
                    margin: 0,
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                  }}
                >
                  24H
                </h1>
                <p style={{ margin: 0, fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
                  Non-stop Coding
                </p>
              </div>
              <div
                style={{
                  padding: "clamp(1.5rem, 3vw, 2rem)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(69, 162, 158, 0.05)",
                }}
              >
                <h1
                  style={{
                    color: "var(--accent-cyan)",
                    margin: 0,
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                  }}
                >
                  50+
                </h1>
                <p style={{ margin: 0, fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
                  Projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "clamp(2rem, 4vw, 3rem) 1rem",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          marginTop: "auto",
          backgroundColor: "#050505",
        }}
      >
        <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          &copy; 2026 PIXELIT Hackathon Platform. All Systems Operational.
        </p>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          Created by <strong>PIXELIT Web Team</strong>
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(1rem, 3vw, 2rem)",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/leaderboard"
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              textDecoration: "none",
            }}
          >
            Live Leaderboard
          </Link>
          <span style={{ color: "var(--text-muted)" }}>|</span>
          <Link
            to="/admin/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--accent-violet)",
              fontSize: "1.1rem",
              fontWeight: 600,
              border: "1px solid rgba(167, 139, 250, 0.3)",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
            }}
          >
            <FaUserShield /> Command (Admin) Access
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
