import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northstar · Cloud observability demo",
  description: "A cloud observability dashboard prototype powered by clearly simulated telemetry.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
