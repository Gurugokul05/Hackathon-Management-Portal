import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  disabled = false,
  style = {},
}) => {
  return (
    <div style={{ marginBottom: "1rem" }} className={className}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "1rem 1.2rem",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          color: "#fff",
          outline: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          fontSize: "1rem",
          ...style,
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = "var(--accent-cyan)";
            e.target.style.boxShadow = "0 0 15px rgba(69, 162, 158, 0.3)";
            e.target.style.backgroundColor = "rgba(69, 162, 158, 0.05)";
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.target.style.boxShadow = "none";
            e.target.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
          }
        }}
      />
    </div>
  );
};

export default Input;
