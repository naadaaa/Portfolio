import dynamic from "next/dynamic";

const PortfolioChat = dynamic(() => import("@/components/PortfolioChat"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 200,
        borderRadius: 12,
        background: "#F0E2E7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#8a7a80",
        fontSize: 13,
      }}
    >
      Loading chat...
    </div>
  ),
});

export default function HomePage() {
  return (
    <>
      <section className="flex min-h-[60vh] flex-col justify-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          I build frontend that survives contact with a real backend.
        </h1>
        <p className="max-w-xl text-neutral-600">
          React, TypeScript, and full-stack integration — accessible forms,
          real-time features, and the debugging that comes with actually
          running the infrastructure behind them.
        </p>
      </section>

      <section className="flex flex-col items-center gap-4 pb-20">
        <h2 className="text-lg font-semibold">Ask about my work</h2>
        <PortfolioChat />
      </section>
    </>
  );
}