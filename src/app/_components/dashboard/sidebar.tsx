import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import SidebarOptionsButton from "./sidebarOptionButton";
import {
  BlocksIcon,
  CalendarDaysIcon,
  ChevronRight,
  HomeIcon,
  UsersIcon,
} from "lucide-react";
import { Tooltip } from "~/components/ui/tooltip";

function Sidebar() {
  return (
    <>
      <div className="flex flex-col items-center bg-gray-800 h-screen w-16 fixed z-20 py-5 px-3">
        <div className="pb-4 mb-4 border-b border-gray-400">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col items-center gap-2 h-full">
          <SidebarOptionsButton variant="ghost" tooltip_message="HOME">
            <HomeIcon className="h-4 w-4" />
          </SidebarOptionsButton>
          <SidebarOptionsButton variant="ghost" tooltip_message="BUILD">
            <BlocksIcon className="h-4 w-4" />
          </SidebarOptionsButton>
          <SidebarOptionsButton variant="ghost" tooltip_message="CALENDER">
            <CalendarDaysIcon className="h-4 w-4" />
          </SidebarOptionsButton>
          <SidebarOptionsButton variant="ghost" tooltip_message="COMMUNITY">
            <UsersIcon className="h-4 w-4" />
          </SidebarOptionsButton>
        </div>
        <div>
          <Tooltip>
            <SidebarOptionsButton
              variant="destructive"
              tooltip_message="logout"
            >
              <ChevronRight className="h-4 w-4" />
            </SidebarOptionsButton>
          </Tooltip>
        </div>
      </div>

      {/* <SideBarSlide>
        <p>sourabh</p>
      </SideBarSlide> */}
    </>
  );
}

export default Sidebar;
