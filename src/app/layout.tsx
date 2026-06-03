import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velytics — Transform Data Into Decisions",
  description: "Upload any business data. Get instant insights, forecasts, and reports. No coding required.",
  openGraph: {
    title: "Velytics — Transform Data Into Decisions",
    description: "The data analytics platform for non-technical teams.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
