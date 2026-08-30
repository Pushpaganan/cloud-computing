import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: " Cloud Scale Demo | Next.js on Azure",
  description: "Live autoscaling demo with Next.js, Azure, and k6 load testing, including real-time active user visibility.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}