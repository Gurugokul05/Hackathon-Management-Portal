import React, { useEffect, useState, useMemo } from "react";

const QUOTES = [
  {
    text: "The blade that does not swing still guards the path.",
    author: "Vinland proverb",
  },
  {
    text: "Strength is the patience to wait for the right fight.",
    author: "Old warrior",
  },
  {
    text: "Victory is earned before the battle begins.",
    author: "Shield hall",
  },
  {
    text: "Stand firm. The storm remembers the steady ones.",
    author: "Sea oath",
  },
];

const WarriorQuote = React.memo(() => {
  // Memoize the random quote selection to prevent unnecessary re-renders
  const quote = useMemo(() => {
    const index = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[index];
  }, []); // Empty dependency array ensures this runs only once

  return (
    <figure
      style={{
        margin: 0,
        padding: "1.5rem",
        borderRadius: "12px",
        background: "rgba(69, 162, 158, 0.08)",
        border: "1px solid rgba(69, 162, 158, 0.35)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
      }}
    >
      <blockquote
        style={{
          margin: 0,
          fontSize: "1.1rem",
          fontStyle: "italic",
          color: "var(--text-primary)",
        }}
      >
        "{quote.text}"
      </blockquote>
      <figcaption
        style={{
          marginTop: "0.75rem",
          textAlign: "right",
          letterSpacing: "1px",
          color: "var(--accent-cyan)",
          textTransform: "uppercase",
          fontSize: "0.85rem",
        }}
      >
        - {quote.author}
      </figcaption>
    </figure>
  );
});

WarriorQuote.displayName = "WarriorQuote";

export default WarriorQuote;
