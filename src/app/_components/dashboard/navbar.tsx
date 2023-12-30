"use client";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ModeToggle } from "~/app/_components/themeToggle";
import { redirect } from "next/navigation";
import { LOGIN } from "~/utils/route_names";
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
import { GearIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import YoutubeLogin from "../social/YoutubeLogin";

export function DashboardTopNavigation() {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  const ytChannelList = api.channel.ytChannelDetails.useQuery({
    userId: data?.user.id ?? "",
  });
  const [position, setPosition] = React.useState(
    ytChannelList.data?.channels[0]?.yt_channel_title ?? ""
  );

  if (status == "authenticated")
    return (
      <div className="flex py-3 px-6 justify-between items-center sticky top-0 z-50 dark:bg-gray-950 bg-white border-b border-gray-100 dark:border-gray-900">
        <div>
          <h4 className="text-xl font-bold italic text-orange-500">Supareel</h4>
        </div>
        <div className="flex justify-end  gap-4 items-center">
          <ModeToggle />

          {/* Switch Channels */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="lg">
                <Avatar className="h-7 w-7 rounded-full mr-2">
                  <AvatarImage src={data?.user.image ?? ""} alt="@shadcn" />
                  <AvatarFallback>
                    {data?.user.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-gray-500 leading-5 capitalize">
                  {data?.user.name}
                </h4>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-fit">
              <DropdownMenuLabel>My Youtube Channels</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                {ytChannelList.data?.channels.map((chan) => (
                  <DropdownMenuRadioItem
                    value={
                      chan.yt_channel_title
                        ? chan.yt_channel_title
                        : chan.yt_channel_customurl
                        ? chan.yt_channel_customurl
                        : ""
                    }
                  >
                    <div className="gap-2 flex justify-between items-center">
                      <Avatar className="items-center h-8 w-8 rounded-full">
                        <AvatarImage src={chan.yt_channel_thumbnails} />
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
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">
                  Bottom
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">
                  Right
                </DropdownMenuRadioItem>
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
    );
  else return "Loading...";
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
