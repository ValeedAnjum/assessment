import type { Metadata } from "next";
import "./globals.css";
import { LiveBlockRoom } from "@/providers";

export const metadata: Metadata = {
  title: "Assessment day 1",
  description: "ReactFlow LiveBlock Example Replication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LiveBlockRoom>{children}</LiveBlockRoom>
      </body>
    </html>
  );
}
