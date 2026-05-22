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
  title: "SpendSense — Premium Expense Tracking",
  description:
    "A clean, elegant, and secure expense tracking dashboard to manage your finances.",
};

import { AuthProvider } from "@/context/AuthContext";

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
        <div className="noise-overlay" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
