"use client";
import { TooltipProvider } from "~/components/ui/tooltip";
import { DashboardTopNavigation } from "../_components/dashboard/navbar";
import Sidebar from "../_components/dashboard/sidebar";
import { SelectedYoutubeChannelProvider } from "../context/youtubeChannel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SelectedYoutubeChannelProvider>
      <TooltipProvider>
        <div className="h-screen flex">
          <Sidebar />
          <div className="w-16" />
          <div className="w-full">
            <DashboardTopNavigation />
            <div className="overflow-scroll">{children}</div>
          </div>
        </div>
      </TooltipProvider>
    </SelectedYoutubeChannelProvider>
  );
}
