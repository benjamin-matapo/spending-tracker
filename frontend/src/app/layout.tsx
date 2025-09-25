import "./globals.css";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Spending Tracker",
  description: "Track your expenses with ease",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <div className="flex-1 container py-4 md:py-8">
            {children}
          </div>
          <Navbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
