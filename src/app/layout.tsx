import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js showcase — Benoît Bremaud",
  description: "A dashboard of my public GitHub projects, built to show current Next.js App Router practice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
