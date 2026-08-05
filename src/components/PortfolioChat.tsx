"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, type FormEvent } from "react";
import ProjectCard, { type ProjectCardData } from "./ProjectCard";

const EXAMPLE_PROMPTS = [
  "What did she build with Kafka?",
  "Tell me about ClipSphere",
  "What's her experience with accessibility?",
];

export default function PortfolioChat() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [stalled, setStalled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isPinnedToBottom = useRef(true);
  const stallTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isStreaming = status === "streaming";
  const isSubmitting = status === "submitted";
  const hasError = status === "error" || !!error || stalled;

  // Mid-stream network loss doesn't always surface as an SDK "error" —
  // an already-open connection can just go silent instead of failing
  // outright. We detect that by resetting a timer on every message
  // change; if nothing changes for 8s while we're supposedly still
  // streaming, we treat it as a stall and show the same error/retry UI.
  useEffect(() => {
    if (!isStreaming) {
      setStalled(false);
      if (stallTimeoutRef.current) clearTimeout(stallTimeoutRef.current);
      return;
    }

    if (stallTimeoutRef.current) clearTimeout(stallTimeoutRef.current);
    stallTimeoutRef.current = setTimeout(() => {
      setStalled(true);
    }, 8000);

    return () => {
      if (stallTimeoutRef.current) clearTimeout(stallTimeoutRef.current);
    };
  }, [isStreaming, messages]);

  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isPinnedToBottom.current = distanceFromBottom < 40;
  }

  useEffect(() => {
    if (isPinnedToBottom.current) {
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  function jumpToLatest() {
    isPinnedToBottom.current = true;
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming || isSubmitting) return;
    sendMessage({ text: trimmed });
    setInput("");
    isPinnedToBottom.current = true;
  }

  function handleExampleClick(prompt: string) {
    sendMessage({ text: prompt });
    isPinnedToBottom.current = true;
  }

  // Retry only regenerates the failed message, not the whole conversation.
  // Guards against double-click by tracking a local retrying flag —
  // regenerate() is async, and a second click before the first resolves
  // could fire a duplicate request.
  async function handleRetry() {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      if (stalled) {
        stop();
        setStalled(false);
      }
      await regenerate();
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <div style={styles.container}>
      <div ref={scrollContainerRef} onScroll={handleScroll} style={styles.messageList}>
        {messages.length === 0 && !hasError && (
          <div style={styles.emptyState}>
            <p style={{ margin: "0 0 12px" }}>
              Ask about my projects, stack, or experience.
            </p>
            <div style={styles.exampleRow}>
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleExampleClick(prompt)}
                  style={styles.exampleChip}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageBubble,
              ...(message.role === "user" ? styles.userBubble : styles.assistantBubble),
            }}
          >
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return <span key={i}>{part.text}</span>;
              }

              if (part.type === "tool-getProjectDetails") {
                switch (part.state) {
                  case "input-streaming":
                    return (
                      <div key={i} style={styles.toolPending}>
                        <span style={styles.pulseDot} />
                        Deciding which project to look up...
                      </div>
                    );
                  case "input-available":
                    return (
                      <div key={i} style={styles.toolPending}>
                        <span style={styles.pulseDot} />
                        Looking up{" "}
                        <strong>
                          {(part.input as { projectName?: string })?.projectName ??
                            "project"}
                        </strong>
                        ...
                      </div>
                    );
                  case "output-available":
                    return (
                      <div key={i} style={{ marginTop: 4 }}>
                        <ProjectCard {...(part.output as ProjectCardData)} />
                      </div>
                    );
                  case "output-error":
                    return (
                      <div key={i} style={styles.toolError}>
                        <strong>Couldn't find that project.</strong>
                        <p style={{ margin: "4px 0 0", fontSize: 12 }}>
                          {part.errorText}
                        </p>
                      </div>
                    );
                  default:
                    return null;
                }
              }

              return null;
            })}
          </div>
        ))}

        {/* Skeleton: matches the real assistant bubble's shape (same
            padding, border-radius, alignment) so content arriving doesn't
            cause a layout shift — just a content swap inside the same box. */}
        {isSubmitting && (
          <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
            <div style={styles.skeletonLine} />
            <div style={{ ...styles.skeletonLine, width: "70%" }} />
          </div>
        )}

        {/* Designed error state: distinct from a normal message, names
            what failed, and offers a retry that only redoes the failed
            turn — not the whole conversation. */}
        {hasError && (
          <div style={styles.errorBox}>
            <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
              That didn't go through.
            </p>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "#8a5a5a" }}>
              {stalled
                ? "The response stopped coming through — the connection may have dropped."
                : error?.message || "Something went wrong reaching the model."}
            </p>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              style={{
                ...styles.retryButton,
                opacity: isRetrying ? 0.6 : 1,
                cursor: isRetrying ? "default" : "pointer",
              }}
            >
              {isRetrying ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}
      </div>

      {!isPinnedToBottom.current && messages.length > 0 && (
        <button onClick={jumpToLatest} style={styles.jumpButton}>
          ↓ Jump to latest
        </button>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isStreaming || isSubmitting}
          style={styles.input}
        />
        {isStreaming ? (
          <button type="button" onClick={() => stop()} style={styles.stopButton}>
            Stop
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting || !input.trim()} style={styles.sendButton}>
            Send
          </button>
        )}
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    // dvh (dynamic viewport height) instead of vh — vh on mobile Safari
    // is calculated against the viewport BEFORE the URL bar/keyboard
    // collapse it, causing overflow and a jumping layout. dvh tracks the
    // actual visible viewport.
    height: "min(500px, 70dvh)",
    maxWidth: 480,
    width: "100%",
    border: "1px solid #e2d5d9",
    borderRadius: 12,
    overflow: "hidden",
    background: "#FDF6F3",
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    // Prevents mobile Safari's rubber-band overscroll from bubbling up
    // and dragging the whole page instead of just this scroll container.
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  emptyState: {
    color: "#8a7a80",
    fontSize: 14,
    textAlign: "center",
    marginTop: 30,
  },
  exampleRow: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  exampleChip: {
    fontSize: 12,
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid #A14B65",
    background: "#FDF6F3",
    color: "#A14B65",
    cursor: "pointer",
  },
  messageBubble: {
    padding: "10px 14px",
    borderRadius: 12,
    maxWidth: "85%",
    fontSize: 14,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "#A14B65",
    color: "#FDF6F3",
  },
  assistantBubble: {
    alignSelf: "flex-start",
    background: "#F0E2E7",
    color: "#2B2420",
  },
  skeletonLine: {
    height: 10,
    width: "100%",
    borderRadius: 4,
    background:
      "linear-gradient(90deg, #e5d3d9 25%, #f0e2e7 37%, #e5d3d9 63%)",
    backgroundSize: "400% 100%",
    animation: "shimmer 1.4s ease infinite",
    marginBottom: 6,
  },
  toolPending: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#8a7a80",
    fontStyle: "italic",
    padding: "6px 0",
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#9B8AC4",
    display: "inline-block",
  },
  toolError: {
    border: "1px solid #d99",
    background: "#fdf0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: "#a33",
  },
  errorBox: {
    alignSelf: "stretch",
    border: "1px solid #e0b8b8",
    background: "#fdf2f2",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: "#7a3d3d",
  },
  retryButton: {
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: "#A14B65",
    color: "#FDF6F3",
    fontSize: 12,
    fontWeight: 600,
  },
  jumpButton: {
    alignSelf: "center",
    marginBottom: 8,
    padding: "4px 12px",
    borderRadius: 999,
    border: "1px solid #A14B65",
    background: "#FDF6F3",
    color: "#A14B65",
    fontSize: 12,
    cursor: "pointer",
  },
  form: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: "1px solid #e2d5d9",
    background: "#FDF6F3",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d8c5cb",
    fontSize: 16,
  },
  sendButton: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#A14B65",
    color: "#FDF6F3",
    fontWeight: 600,
    cursor: "pointer",
  },
  stopButton: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#9B8AC4",
    color: "#FDF6F3",
    fontWeight: 600,
    cursor: "pointer",
  },
};