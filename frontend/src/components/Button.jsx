import React from "react";

const Button = React.memo(
  ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    ...props
  }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`btn btn-${variant} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
