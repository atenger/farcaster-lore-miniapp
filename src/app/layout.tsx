import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MiniAppWrapper from "@/components/MiniAppWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farcaster Lore - GM Farcaster Casts",
  description: "Explore casts featured on GM Farcaster episodes through time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MiniAppWrapper>
          {children}
        </MiniAppWrapper>
      </body>
    </html>
  );
}