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
  description: "Explore casts from GM Farcaster episodes in a browsable, searchable interface",
  other: {
    "fc:frame": JSON.stringify({
      "version": "next",
      "imageUrl": "https://farcaster-lore-miniapp.vercel.app/opengraph-image.png",
      "button": {
        "title": "📚 Explore",
        "action": {
          "type": "launch_miniapp",
          "name": "Farcaster Lore",
          "url": "https://farcaster-lore-miniapp.vercel.app/",
          "splashImageUrl": "https://farcaster-lore-miniapp.vercel.app/logo.png",
          "splashBackgroundColor": "#f3f4f6"
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
