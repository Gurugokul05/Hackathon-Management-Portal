import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import {
  FaUserAstronaut,
  FaTimes,
  FaGamepad,
  FaUserSecret,
  FaIdBadge,
} from "react-icons/fa";

const Register = () => {
  const { registerTeam } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    leader: {
      name: "",
      email: "",
      phone: "",
      registrationNumber: "",
      department: "",
      section: "",
      year: "",
    },
    members: [],
  });

  React.useEffect(() => {
    document.title = "Register Your Team - Hackathon Platform";
  }, []);

  const addMember = () => {
    if (formData.members.length < 3) {
      setFormData({
        ...formData,
        members: [
          ...formData.members,
          {
            name: "",
            email: "",
            phone: "",
            registrationNumber: "",
            department: "",
            section: "",
            year: "",
          },
        ],
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "Maximum 4 people (1 leader + up to 3 members)",
      });
    }
  };

  const removeMember = async (index) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Remove this member?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "var(--accent-danger)",
    });
    if (result.isConfirmed) {
      const newMembers = [...formData.members];
      newMembers.splice(index, 1);
      setFormData({ ...formData, members: newMembers });
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    setFormData({ ...formData, members: newMembers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerTeam(formData);
      Swal.fire({
        icon: "success",
        title: "Team Registered!",
        html: `<p>Your Team ID: <strong style="color:var(--accent-cyan)">${res.teamId}</strong></p><p>Please save this ID to access the portal.</p>`,
        background: "rgba(20, 20, 25, 0.95)",
        color: "#fff",
        confirmButtonColor: "var(--accent-cyan)",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message || "Check your details and try again.",
        background: "rgba(20, 20, 25, 0.95)",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.teamName)
      return Swal.fire({
        icon: "error",
        title: "Input Needed",
        text: "Please enter a team name.",
      });
    if (
      step === 2 &&
      (!formData.leader.name ||
        !formData.leader.email ||
        !formData.leader.phone ||
        !formData.leader.registrationNumber ||
        !formData.leader.department ||
        !formData.leader.section ||
        !formData.leader.year)
    )
      return Swal.fire({
        icon: "error",
        title: "Input Needed",
        text: "Please fill all leader details.",
      });
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "8rem 1rem 4rem",
        background:
          "linear-gradient(135deg, #0b0c10 0%, #1f2833 50%, #0b0c10 100%)",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Navbar />
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1
              style={{
                fontSize: "3.5rem",
                letterSpacing: "4px",
                margin: 0,
                color: "#fff",
              }}
            >
              TEAM{" "}
              <span style={{ color: "var(--accent-cyan)" }}>REGISTRATION</span>
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.1rem",
                marginTop: "1rem",
                letterSpacing: "2px",
              }}
            >
              Create your team to join the hackathon
            </p>
          </motion.div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: `2px solid ${step >= i ? "var(--accent-cyan)" : "rgba(255,255,255,0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: step >= i ? "var(--accent-cyan)" : "var(--text-muted)",
                  fontWeight: "bold",
                }}
              >
                {i}
              </div>
              <span
                style={{
                  fontSize: "1rem",
                  color: step >= i ? "#fff" : "var(--text-muted)",
                  letterSpacing: "2px",
                }}
              >
                {i === 1 ? "Team Name" : i === 2 ? "Leader Details" : "Members"}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              style={{
                padding: "4rem",
                background: "rgba(10, 10, 15, 0.8)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(102, 252, 241, 0.2)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              }}
            >
              {step === 1 && (
                <div>
                  <h3
                    style={{
                      marginBottom: "2.5rem",
                      color: "var(--accent-cyan)",
                      borderLeft: "4px solid var(--accent-cyan)",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    Team Details
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                    }}
                  >
                    <Input
                      label="Team Name"
                      value={formData.teamName}
                      onChange={(e) =>
                        setFormData({ ...formData, teamName: e.target.value })
                      }
                      placeholder="Enter team name"
                    />
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        onClick={nextStep}
                        style={{ padding: "1rem 4rem" }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3
                    style={{
                      marginBottom: "2.5rem",
                      color: "var(--accent-cyan)",
                      borderLeft: "4px solid var(--accent-cyan)",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    Team Leader
                  </h3>
                  <div
                    style={{
                      position: "relative",
                      background: "rgba(255,255,255,0.02)",
                      padding: "2.5rem",
                      borderRadius: "15px",
                      border: "1px solid rgba(102, 252, 241, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-15px",
                        left: "20px",
                        background: "var(--bg-primary)",
                        padding: "0 10px",
                        color: "var(--accent-cyan)",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FaUserAstronaut /> LEADER
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "2rem",
                      }}
                    >
                      <Input
                        label="Full Name"
                        value={formData.leader.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leader: {
                              ...formData.leader,
                              name: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter full name"
                      />
                      <Input
                        label="Email"
                        value={formData.leader.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leader: {
                              ...formData.leader,
                              email: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter email address"
                      />
                      <Input
                        label="Phone Number"
                        value={formData.leader.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leader: {
                              ...formData.leader,
                              phone: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter phone number"
                      />
                      <Input
                        label="Registration Number"
                        value={formData.leader.registrationNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leader: {
                              ...formData.leader,
                              registrationNumber: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter registration number"
                      />
                      <Input
                        label="Department"
                        value={formData.leader.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leader: {
                              ...formData.leader,
                              department: e.target.value,
                            },
                          })
                        }
                        placeholder="E.g., IT , CSE ..."
                      />
                      <Input
                        label="Section"
                        value={formData.leader.section}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leader: {
                              ...formData.leader,
                              section: e.target.value,
                            },
                          })
                        }
                        placeholder="E.g., A, B, C"
                      />
                      <Input
                        label="Year"
                        value={formData.leader.year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leader: {
                              ...formData.leader,
                              year: e.target.value,
                            },
                          })
                        }
                        placeholder="E.g., 2nd Year, 3rd Year"
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "4rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button onClick={prevStep} variant="secondary">
                      Back
                    </Button>
                    <Button onClick={nextStep}>Next</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "3rem",
                    }}
                  >
                    <h3
                      style={{
                        color: "var(--accent-cyan)",
                        borderLeft: "4px solid var(--accent-cyan)",
                        paddingLeft: "1.5rem",
                      }}
                    >
                      Team Members
                    </h3>
                    <Button onClick={addMember} variant="secondary">
                      Add Member
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                    }}
                  >
                    {formData.members.map((member, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "2rem",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: "12px",
                          position: "relative",
                          border: "1px solid rgba(255,255,255,0.05)",
                          transition: "all 0.3s",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "-15px",
                            left: "20px",
                            background: "var(--bg-primary)",
                            padding: "0 10px",
                            color: "var(--accent-cyan)",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <FaUserSecret /> Member {idx + 1}
                        </div>
                        <button
                          onClick={() => removeMember(idx)}
                          style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            background: "rgba(244, 67, 54, 0.1)",
                            border: "1px solid var(--accent-danger)",
                            color: "var(--accent-danger)",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "var(--radius-sm)",
                            width: "auto",
                            height: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "0.3s",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background =
                              "var(--accent-danger)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(244, 67, 54, 0.1)")
                          }
                        >
                          Remove Member
                        </button>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "1.5rem",
                          }}
                        >
                          <Input
                            placeholder="Full name"
                            value={member.name}
                            onChange={(e) =>
                              updateMember(idx, "name", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Email address"
                            value={member.email}
                            onChange={(e) =>
                              updateMember(idx, "email", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Phone number"
                            value={member.phone}
                            onChange={(e) =>
                              updateMember(idx, "phone", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Registration number"
                            value={member.registrationNumber}
                            onChange={(e) =>
                              updateMember(
                                idx,
                                "registrationNumber",
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Department (e.g., CSE, ECE)"
                            value={member.department}
                            onChange={(e) =>
                              updateMember(idx, "department", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Section (e.g., A, B)"
                            value={member.section}
                            onChange={(e) =>
                              updateMember(idx, "section", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Year (e.g., 2nd Year)"
                            value={member.year}
                            onChange={(e) =>
                              updateMember(idx, "year", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: "4rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button onClick={prevStep} variant="secondary">
                      Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                      {loading ? "Submitting..." : "Register Team"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Register;
