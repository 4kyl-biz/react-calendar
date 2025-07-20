"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, SunMoon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <CalendarDays className="w-5 h-5" />
        Monthly Planner
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <SunMoon className="w-5 h-5" />
        </Button>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Avatar className="w-8 h-8">
          <AvatarFallback>LL</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
