import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Hind_Siliguri,
  Noto_Serif_Bengali,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bangla typography for the Islamic poster templates.
// Hind Siliguri — clean, highly readable from a distance (body & references).
const banglaSans = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

// Noto Serif Bengali — elegant headline face (titles & emphasis).
const banglaSerif = Noto_Serif_Bengali({
  variable: "--font-bangla-serif",
  subsets: ["bengali", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Al-Falah Foundation",
  description: "Al-Falah Foundation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${banglaSans.variable} ${banglaSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
