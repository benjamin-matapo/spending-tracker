import "./globals.css";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Spending Tracker",
  description: "Track your expenses with ease",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <div className="flex-1 container py-4 md:py-8">
          {children}
        </div>
        <Navbar />
      </body>
    </html>
  );
}
