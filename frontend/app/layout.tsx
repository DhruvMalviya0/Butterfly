import type { Metadata } from "next";
<<<<<<< HEAD
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Project Cascade Dashboard",
  description: "Full-stack analytics dashboard for Project Cascade.",
=======
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Cascade Dashboard",
  description: "Frontend command center for Project Cascade",
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
=======
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
