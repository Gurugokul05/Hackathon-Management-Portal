import React from "react";

const Card = ({ children, className = "", title, style = {}, ...props }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "clamp(1rem, 3vw, 1.5rem)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        ...style,
      }}
      {...props}
    >
      {title && (
        <h3
          style={{
            marginBottom: "clamp(1rem, 2vw, 1.5rem)",
            color: "var(--accent-cyan)",
            letterSpacing: "2px",
            borderLeft: "3px solid var(--accent-cyan)",
            paddingLeft: "1rem",
            fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
