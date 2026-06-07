import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/auth.css";
import "@/styles/dashboard.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Inventis - Inventory Suite",
  description: "Complete inventory management system for business owners and sales representatives",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
