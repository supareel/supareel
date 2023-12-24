"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="airplane-mode">Dark Mode</Label>
      <Switch
        checked={theme == "dark"}
        onClick={() => setTheme(theme == "light" ? "dark" : "light")}
        id="airplane-mode"
      />
    </div>
  );
}
