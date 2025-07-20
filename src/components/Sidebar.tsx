"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  LayoutDashboard,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Sidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: <CalendarDays className="w-5 h-5" />,
      label: "Calendar",
      href: "/calendar",
    },
    { icon: <BarChart className="w-5 h-5" />, label: "Stats", href: "/stats" },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      className="h-full border-l bg-background flex flex-col justify-between overflow-hidden"
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="p-4 border-t flex justify-start">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </Button>
      </div>
      <div className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-md text-sm transition",
                collapsed ? "justify-center" : "",
                isActive ? "bg-muted font-semibold" : "hover:bg-muted"
              )}
            >
              <span className="w-5 h-5 shrink-0">{item.icon}</span>

              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
