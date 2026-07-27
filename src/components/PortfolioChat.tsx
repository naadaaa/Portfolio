"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, type FormEvent } from "react";

export default function PortfolioChat() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isPinnedToBottom = useRef(true);

  const isStreaming = status === "streaming";
  const isSubmitting = status === "submitted";

  // Track whether the user is at the bottom of the scroll container.
  // We only auto-scroll while they're already pinned there — the moment
  // they scroll up to read something, we stop yanking them back down.
  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isPinnedToBottom.current = distanceFromBottom < 40;
  }

  // Auto-scroll on every new token/message, but only if still pinned.
  // Runs on every render during streaming since message content mutates
  // in place rather than triggering array-length changes every token.
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

  return (
    <div style={styles.container}>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={styles.messageList}
      >
        {messages.length === 0 && (
          <p style={styles.emptyState}>
            Ask about my projects, stack, or experience.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageBubble,
              ...(message.role === "user" ? styles.userBubble : styles.assistantBubble),
            }}
          >
            {message.parts.map((part, i) =>
              part.type === "text" ? <span key={i}>{part.text}</span> : null
            )}
          </div>
        ))}

        {/* Thinking indicator: shown only after submit, before the first
            token arrives. Once streaming starts, message content itself
            takes over — no separate "swap", the indicator just stops
            rendering the instant real text exists. */}
        {isSubmitting && (
          <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
            <span style={styles.thinkingDots}>●●●</span>
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
    height: "min(500px, 70vh)",
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
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  emptyState: {
    color: "#8a7a80",
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
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
  thinkingDots: {
    opacity: 0.5,
    letterSpacing: 2,
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
    // 16px prevents iOS Safari from auto-zooming the page when this
    // input is focused, which keeps the layout stable at phone width.
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