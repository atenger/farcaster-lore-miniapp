import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MiniAppWrapper from "@/components/MiniAppWrapper";
import { miniAppConfig } from "@/lib/config";
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
  other: {
    "fc:frame": JSON.stringify({
      "version": "next",
      "imageUrl": miniAppConfig.imageUrl(),
      "button": {
        "title": "Travel Through Farcaster History",
        "action": {
          "type": "launch_miniapp",
          "name": "Farcaster Lore",
          "url": miniAppConfig.homeUrl(),
          "splashImageUrl": miniAppConfig.splashImageUrl(),
          "splashBackgroundColor": miniAppConfig.splashBackgroundColor
        }
      }
    })
  }
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