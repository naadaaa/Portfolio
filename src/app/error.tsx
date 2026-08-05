"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app this would go to an error-tracking service.
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20 }}>Something broke on this page.</h2>
      <p style={{ margin: 0, color: "#8a7a80", maxWidth: 400 }}>
        This isn't a chat error — the page itself hit a problem loading.
        Try again, or refresh.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          background: "#A14B65",
          color: "#FDF6F3",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}