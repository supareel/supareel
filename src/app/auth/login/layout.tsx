"use client";
import { TooltipProvider } from "~/components/ui/tooltip";
import Sidebar from "~/app/_components/dashboard/sidebar";
import { TopNavigation } from "~/app/_components/landing/navbar";

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
          <TopNavigation />
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
}
