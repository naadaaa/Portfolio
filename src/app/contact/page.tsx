export default function ContactPage() {
  return (
    <div
      style={{
        paddingTop: 60,
        paddingBottom: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 28, margin: 0 }}>
        I build frontend that survives contact with a real backend.
      </h1>
      <p style={{ color: "#8a7a80", maxWidth: 420, fontSize: 15 }}>
        If that&apos;s what you need on your team, I&apos;d rather you just email
        me directly than fill out a form.
      </p>
      <a
        href="mailto:nw2052005@gmail.com"
        style={{
          marginTop: 8,
          padding: "12px 28px",
          borderRadius: 8,
          background: "#A14B65",
          color: "#FDF6F3",
          fontWeight: 600,
          textDecoration: "none",
          fontSize: 15,
        }}
      >
        nw2052005@gmail.com
      </a>
      <div style={{ display: "flex", gap: 20, marginTop: 24, fontSize: 14 }}>
        <a href="https://github.com/naadaaa" style={{ color: "#9B8AC4" }}>
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/nada-waleed-551731279"
          style={{ color: "#9B8AC4" }}
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}