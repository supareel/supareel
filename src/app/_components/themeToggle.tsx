"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "~/components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <SunIcon className="w-4 h-4 text-gray-400" />
      <Switch
        checked={theme == "dark"}
        onClick={() => setTheme(theme == "light" ? "dark" : "light")}
        id="airplane-mode"
      />
      <MoonIcon className="w-4 h-4 text-gray-400" />
    </div>
  );
}
