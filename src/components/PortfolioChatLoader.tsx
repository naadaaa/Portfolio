"use client";

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

export default PortfolioChat;