import Image from "next/image";

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 560 }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Image
          src="/images/nada-photo.jpeg"
          alt="Nada Waleed Abdelsattar"
          width={140}
          height={140}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #F0E2E7",
          }}
        />
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 style={{ fontSize: 28, marginTop: 0, marginBottom: 8 }}>About</h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#2B2420" }}>
            CS student at Zewail City, full-stack focus with a frontend lean.
            I&apos;ve built accessible React forms, real-time UI features, and
            debugged real integration failures across microservices and
            containerized apps.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#2B2420" }}>
            Looking for a software engineering or full-stack internship where
            I can keep building things that hold up under real conditions.
          </p>
        </div>
      </div>
    </div>
  );
}