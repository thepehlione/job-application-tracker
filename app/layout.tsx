import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Job Application Tracker",
  description: "Track and manage your job applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-slate-900 text-white h-20 items-center flex">


          <div className="mx-auto w-full px-10 py-3 flex items-center justify-between ">
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-slate-900 text-white grid place-items-center font-bold">
                JT
              </div>
              <span className="font-semibold tracking-tight">
                JobTracker
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/applications"
                className="text-white font-bold hover:text-slate-300 transition"
              >
                Applications
              </Link>

              <Link
                href="/applications/new"
                className="rounded-lg bg-white text-black px-5 py-2 font-bold hover:bg-zinc-400 transition"
              >
                + New
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
