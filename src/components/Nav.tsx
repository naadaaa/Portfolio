import Link from "next/link";

export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          fontSize: 22,
          color: "#A14B65",
          textDecoration: "none",
        }}
      >
        Nada
      </Link>
      <div style={{ display: "flex", gap: 24, fontSize: 14 }}>
        <Link href="/work" style={{ color: "#2B2420", textDecoration: "none" }}>
          Work
        </Link>
        <Link href="/about" style={{ color: "#2B2420", textDecoration: "none" }}>
          About
        </Link>
        <Link href="/contact" style={{ color: "#2B2420", textDecoration: "none" }}>
          Contact
        </Link>
      </div>
    </nav>
  );
}