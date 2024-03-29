"use client";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ModeToggle } from "~/app/_components/themeToggle";
import { redirect, useRouter } from "next/navigation";
import { DASHBOARD, LOGIN } from "~/utils/route_names";
import { cn } from "~/lib/utils";
import { NavigationMenuLink } from "~/components/ui/navigation-menu";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { GearIcon, SymbolIcon, BorderDottedIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import YoutubeLogin from "../social/YoutubeLogin";
import { useSelectedYoutubeChannel } from "~/app/context/youtubeChannel";

export function DashboardTopNavigation() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  const router = useRouter();

  const { selectedChannel, ytChannelList, setSelectedChannel } =
    useSelectedYoutubeChannel();

  const handleYTVideosList = async () => {
    // manually refetch
    // await ytVideosSyncList.refetch();
  };

  return status == "authenticated" ? (
    <div className="flex py-3 px-6 justify-between items-center sticky top-0 z-50 border-b dark:bg-gray-950 bg-white border-gray-100 dark:border-gray-900">
      <div>
        <h4
          className="text-xl font-bold italic text-orange-500 cursor-pointer"
          onClick={() => router.push(DASHBOARD)}
        >
          SupaReel
        </h4>
      </div>
      <div className="flex justify-end  gap-4 items-center">
        <ModeToggle />

        {/* Switch Channels */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="lg">
              <Avatar className="h-5 w-5 rounded-full mr-3">
                <AvatarImage
                  src={selectedChannel?.yt_channel_thumbnails ?? ""}
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {selectedChannel?.yt_channel_title?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h4 className="text-gray-500 leading-5 capitalize">
                {selectedChannel?.yt_channel_title}
              </h4>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="min-w-fit">
            <DropdownMenuLabel>My Youtube Channels</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuRadioGroup
              value={selectedChannel?.yt_channel_title ?? ""}
              onValueChange={async (event) => {
                const newChannelDataList = ytChannelList?.channels.filter(
                  (data) => data.yt_channel_title == event
                );
                if (newChannelDataList) {
                  const newChannelData = newChannelDataList[0];
                  setSelectedChannel(newChannelData);
                  await handleYTVideosList();
                }
              }}
            >
              {ytChannelList?.channels.map((chan) => (
                <DropdownMenuRadioItem value={chan.yt_channel_title ?? ""}>
                  <div className="gap-2 flex justify-between items-center">
                    <Avatar className="items-center h-8 w-8 rounded-full">
                      <AvatarImage src={chan.yt_channel_thumbnails ?? ""} />
                      <AvatarFallback>NA</AvatarFallback>
                    </Avatar>
                    <span>{chan.yt_channel_title}</span>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <YoutubeLogin />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <GearIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-60">
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedChannel?.yt_channel_title ?? ""}
              onValueChange={(event) => {
                const newChannelDataList = ytChannelList?.channels.filter(
                  (data) => data.yt_channel_title == event
                );
                if (newChannelDataList) {
                  const newChannelData = newChannelDataList[0];
                  setSelectedChannel(newChannelData);
                }
              }}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="focus:bg-transparent">
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  ) : (
    "Loading..."
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
