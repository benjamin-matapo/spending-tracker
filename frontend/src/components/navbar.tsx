"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, PlusCircle, List, PieChart } from "lucide-react";

const NAV = [
  { href: "/add", label: "Add", icon: PlusCircle },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/summary", label: "Summary", icon: PieChart },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 w-full border-t bg-background md:top-0 md:bottom-auto md:border-b">
      <div className="container">
        <div className="hidden md:flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span className="font-semibold">Spending Tracker</span>
          </div>
          <div className="flex items-center gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={cn("px-3 py-2 rounded-md text-sm", pathname === item.href ? "bg-accent" : "hover:bg-accent")}>{item.label}</Link>
            ))}
          </div>
        </div>
        <div className="md:hidden grid grid-cols-3 gap-2 py-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn("flex flex-col items-center justify-center p-2 rounded-md text-xs", active ? "bg-accent" : "hover:bg-accent")}> 
                <Icon className="h-5 w-5" />
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
