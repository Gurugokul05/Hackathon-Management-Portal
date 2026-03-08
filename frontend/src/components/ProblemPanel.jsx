import React, { useEffect, useState } from "react";
import api from "../services/api";
import Card from "./Card";
import Button from "./Button";
import Swal from "sweetalert2";
import { FaLock, FaUnlock } from "react-icons/fa";

const ProblemPanel = ({ team, onProblemSelected }) => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get("/problems");
        setProblems(res.data);
      } catch (error) {}
    };
    fetchProblems();
  }, []);

  const teamProblemId =
    typeof team.problemStatement === "object"
      ? team.problemStatement?._id
      : team.problemStatement;
  const currentProblem = problems.find((p) => p._id === teamProblemId);

  const handleSelect = async (problemId) => {
    const result = await Swal.fire({
      title: "Confirm Mission Selection",
      text: "You cannot change your objective once selected. Proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--accent-cyan)",
      cancelButtonColor: "var(--accent-danger)",
      confirmButtonText: "Yes, Lock In",
      background: "var(--bg-secondary)",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await api.post("/problems/select", { problemId });
        Swal.fire({
          title: "Objective Locked",
          text: "Good luck, Commander.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "var(--bg-secondary)",
          color: "#fff",
        });
        onProblemSelected(); // Trigger refresh
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Selection failed",
          icon: "error",
          background: "var(--bg-secondary)",
          color: "#fff",
        });
      }
    }
  };

  if (teamProblemId && currentProblem) {
    return (
      <Card
        title="Current Objective"
        style={{
          borderColor: "var(--accent-success)",
          boxShadow: "0 0 15px rgba(76, 175, 80, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>
            {currentProblem.title}
          </h2>
          <FaLock color="var(--accent-success)" size={24} />
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            color: "var(--text-secondary)",
          }}
        >
          <span
            style={{
              padding: "0.2rem 0.6rem",
              border: "1px solid var(--accent-cyan)",
              borderRadius: "4px",
            }}
          >
            {currentProblem.domain}
          </span>
          <span
            style={{
              padding: "0.2rem 0.6rem",
              border: "1px solid var(--accent-cyan)",
              borderRadius: "4px",
              color: "var(--accent-cyan)",
            }}
          >
            {currentProblem.difficulty}
          </span>
        </div>
        <p
          style={{
            lineHeight: "1.6",
            fontSize: "1rem",
            color: "var(--text-primary)",
          }}
        >
          {currentProblem.description}
        </p>
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            borderRadius: "var(--radius-sm)",
            borderLeft: "3px solid var(--accent-success)",
          }}
        >
          <p
            style={{
              color: "var(--accent-success)",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            Status: LOCKED
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Modifications restricted by protocol.
          </p>
        </div>
      </Card>
    );
  } else if (teamProblemId && !currentProblem && problems.length > 0) {
    return <Card title="Current Objective">Loading objective data...</Card>;
  }

  return (
    <Card title="Select Mission Objective">
      {problems.length === 0 ? (
        <p>Loading available missions...</p>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {problems.map((problem) => (
            <div
              key={problem._id}
              style={{
                padding: "1.5rem",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{ color: "var(--text-primary)", fontSize: "1.2rem" }}
                >
                  {problem.title}
                </h3>
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "1rem",
                    backgroundColor:
                      problem.difficulty === "Hard"
                        ? "rgba(244, 67, 54, 0.2)"
                        : "rgba(34, 211, 238, 0.1)",
                    color:
                      problem.difficulty === "Hard"
                        ? "var(--accent-danger)"
                        : "var(--accent-cyan)",
                    border: `1px solid ${problem.difficulty === "Hard" ? "var(--accent-danger)" : "var(--accent-cyan)"}`,
                  }}
                >
                  {problem.difficulty}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--accent-red)",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {problem.domain}
              </p>
              <p
                style={{
                  fontSize: "0.95rem",
                  marginBottom: "1.5rem",
                  color: "var(--text-muted)",
                }}
              >
                {problem.description}
              </p>
              <Button
                onClick={() => handleSelect(problem._id)}
                variant="primary"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaUnlock size={14} /> Lock In Objective
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProblemPanel;
