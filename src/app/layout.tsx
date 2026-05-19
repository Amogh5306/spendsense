import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpendSense — Mission Control for Your Finances",
  description:
    "A futuristic expense tracking dashboard for students. Monitor your spending from orbit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${jetbrains.variable} ${barlow.variable}`}
    >
      <body className="font-barlow text-ghost-white antialiased">
        {children}
      </body>
    </html>
  );
}
