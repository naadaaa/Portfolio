import type { Metadata } from "next";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nada Waleed Abdelsattar",
  description: "I build frontend that survives contact with a real backend.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}