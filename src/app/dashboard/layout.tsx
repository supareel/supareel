"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import SidebarOptionsButton from "../_components/dashboard/sidebarOptionButton";
import {
  HomeIcon,
  ChevronRight,
  BlocksIcon,
  CalendarDaysIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { DashboardTopNavigation } from "../_components/dashboard/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import SideBarSlide from "../_components/dashboard/sideBarSlide";
import Sidebar from "../_components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="flex">
        <Sidebar />
        <div className="w-full">
          <DashboardTopNavigation />
          <h2>Side Navbar</h2>
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
}
