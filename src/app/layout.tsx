import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Medora — AI-Powered MBBS MCQ Preparation",
  description:
    "Master your MBBS exams with AI-generated MCQs. Practice Anatomy, Physiology, Pharmacology, and 16 more subjects. University and USMLE preparation modes with instant feedback and detailed explanations.",
  keywords: [
    "MBBS", "MCQ", "Medical", "Exam Preparation", "USMLE", "Anatomy",
    "Physiology", "Pharmacology", "AI", "Medical Education", "Quiz",
  ],
  authors: [{ name: "Medora" }],
  openGraph: {
    title: "Medora — AI-Powered MBBS MCQ Preparation",
    description: "Master your MBBS exams with AI-generated MCQs across 19 medical subjects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0A0F1C] text-gray-100 min-h-screen flex flex-col justify-between font-sans">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
