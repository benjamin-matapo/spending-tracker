"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, PlusCircle, List, PieChart, Moon, Sun, Info } from "lucide-react";
import { useTheme } from "next-themes";

const NAV = [
  { href: "/add", label: "Add", icon: PlusCircle },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/summary", label: "Summary", icon: PieChart },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  return (
    <nav className="sticky bottom-0 w-full border-t bg-background md:top-0 md:bottom-auto md:border-b">
      <div className="container">
        <div className="hidden md:flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90" aria-label="Go to home">
              <Wallet className="h-5 w-5" />
              <span className="font-semibold">Spending Tracker</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn("px-3 py-2 rounded-md text-sm", pathname === item.href ? "bg-accent" : "hover:bg-accent")}
              >
                {item.label}
              </Link>
            ))}
            <button aria-label="Toggle theme" onClick={toggleTheme} className="ml-2 p-2 rounded-md hover:bg-accent">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="md:hidden grid grid-cols-5 gap-1 py-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className={cn("min-w-0 overflow-hidden flex flex-col items-center justify-center p-2 rounded-md text-xs whitespace-nowrap", active ? "bg-accent" : "hover:bg-accent")}
              > 
                {item.icon ? <item.icon className="h-5 w-5" /> : <span className="h-5" />}
                {/* Hide labels on very small screens to prevent wrapping; show from sm and up */}
                <span className="mt-1 text-[10px] leading-none hidden sm:block">{item.label}</span>
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          })}
          <button aria-label="Toggle theme" onClick={toggleTheme} className={cn("min-w-0 flex flex-col items-center justify-center p-2 rounded-md text-xs hover:bg-accent")}> 
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="mt-1 text-[10px] leading-none hidden sm:block">Theme</span>
            <span className="sr-only">Theme</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
