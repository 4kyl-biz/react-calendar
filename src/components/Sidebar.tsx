"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Sidebar() {
  return (
    <NavigationMenu orientation="vertical" className="space-y-2">
      <NavigationMenuList className="flex flex-col gap-2">
        {["Dashboard", "Calendar", "Stats", "Settings"].map((item) => (
          <NavigationMenuItem key={item}>
            <NavigationMenuLink
              href="#"
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition"
              )}
            >
              {item}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
