import Image from "next/image";

export default function WorkPage() {
  return (
    <div style={{ paddingBottom: 80 }}>
      <h1 style={{ fontSize: 32, marginTop: 40, marginBottom: 8 }}>Work</h1>
      <p style={{ color: "#8a7a80", marginBottom: 48 }}>
        Two case studies, leading with the one I&apos;m most confident explaining
        end to end.
      </p>

      {/* ===== Verbalyn ===== */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, marginBottom: 4 }}>Verbalyn</h2>
        <p style={{ color: "#A14B65", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          Microservices Chat Platform
        </p>

        <div style={styles.imageRow}>
          <Image
            src="/images/verbalyn-chat.png"
            alt="Verbalyn chat conversation view"
            width={280}
            height={180}
            style={styles.image}
          />
          <Image
            src="/images/verbalyn-dashboard.png"
            alt="Verbalyn monitoring dashboard"
            width={280}
            height={180}
            style={styles.image}
          />
          <Image
            src="/images/verbalyn-profile.png"
            alt="Verbalyn account profile page"
            width={280}
            height={180}
            style={styles.image}
          />
        </div>

        <h3 style={styles.subheading}>The problem</h3>
        <p style={styles.paragraph}>
          Verbalyn started as a university course project on microservices and
          polyglot systems. A communication mix-up meant we&apos;d built
          everything in Node.js when the course actually expected at least one
          service in Go. Rather than scrap the work, we rewrote the chat
          service, the largest and most central piece of the system, in Go, after it was already built and working in Node.
        </p>

        <h3 style={styles.subheading}>What I did</h3>
        <p style={styles.paragraph}>
          I owned three of the six services: user, auth, and the
          monitoring layer. I built the Prometheus/Grafana monitoring stack
          specifically to track in-app state (active users and rooms), and
          used Kafka to handle notification events asynchronously rather than
          blocking on them in the request path. Kong routed cleanly between
          the Node and Go services with no cross-language issues.
        </p>

        <h3 style={styles.subheading}>What came of it</h3>
        <p style={styles.paragraph}>
          The project was recognized by our professor and TA as one of the
          more complete, real applications of the course&apos;s microservices
          material.
        </p>

        <a href="https://github.com/naadaaa/Verbalyn" style={styles.link}>
          View on GitHub →
        </a>
      </section>

      {/* ===== ClipSphere ===== */}
      <section>
        <h2 style={{ fontSize: 24, marginBottom: 4 }}>ClipSphere</h2>
        <p style={{ color: "#A14B65", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          Short Video Social Platform
        </p>

        <div style={styles.imageRow}>
          <Image
            src="/images/clipsphere-feed.png"
            alt="ClipSphere home feed"
            width={280}
            height={180}
            style={styles.image}
          />
          <Image
            src="/images/clipsphere-live-like.png"
            alt="ClipSphere live-like notification with video player and reviews"
            width={280}
            height={180}
            style={styles.image}
          />
        </div>

        <h3 style={styles.subheading}>The problem</h3>
        <p style={styles.paragraph}>
          A team project to build a TikTok-style short video platform with
          real monetization and moderation, uploads, payments,
          real-time social interaction, and content moderation, not just a
          video feed.
        </p>

        <h3 style={styles.subheading}>What I did</h3>
        <p style={styles.paragraph}>
          I worked on the platform&apos;s real-time layer, likes,
          follows, and tips delivered live via Socket.io, alongside
          REST APIs secured with JWT and role-based access control. Keeping
          live updates synced correctly across connected clients without
          duplicating or breaking under normal use took real iteration; it
          was the hardest and most rewarding part.
        </p>

        <h3 style={styles.subheading}>What came of it</h3>
        <p style={styles.paragraph}>
          A working full-stack platform combining content, payments, and
          real-time social features, proof I can build the interactive
          layer of a product, not just the CRUD underneath it.
        </p>

        <a href="https://github.com/naadaaa/ClipSphere" style={styles.link}>
          View on GitHub →
        </a>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  imageRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  image: {
    borderRadius: 8,
    border: "1px solid #e2d5d9",
    objectFit: "cover",
  },
  subheading: {
    fontSize: 15,
    color: "#A14B65",
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#2B2420",
    margin: 0,
  },
  link: {
    display: "inline-block",
    marginTop: 20,
    fontSize: 14,
    fontWeight: 600,
    color: "#9B8AC4",
  },
};