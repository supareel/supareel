import React from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
interface ISidebarOptionsButton {
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  children: React.ReactNode;
  tooltip_message: string;
}
export default function SidebarOptionsButton({
  variant,
  children,
  tooltip_message,
}: ISidebarOptionsButton) {
  return (
    <div className="flex flex-col">
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant={variant ?? "default"}
            size="icon"
            className="text-gray-200"
          >
            {children}
          </Button>
          <TooltipContent>
            <p>{tooltip_message}</p>
          </TooltipContent>
        </TooltipTrigger>
      </Tooltip>
    </div>
  );
}
