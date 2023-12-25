"use client";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ModeToggle } from "~/app/_components/themeToggle";
import { redirect } from "next/navigation";
import { LOGIN } from "~/utils/route_names";
import { cn } from "~/lib/utils";
import { NavigationMenuLink } from "~/components/ui/navigation-menu";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import YoutubeLogin from "~/app/_components/social/YoutubeLogin";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function DashboardTopNavigation() {
  const { setTheme, theme } = useTheme();

  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  if (status == "authenticated")
    return (
      <div className="flex py-3 px-6 justify-end items-center gap-4 sticky top-0 z-50 dark:bg-gray-950 bg-white border-b border-gray-100 dark:border-gray-900">
        <YoutubeLogin />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="hover:cursor-pointer flex gap-4 items-center justify-center border rounded-md px-4 py-1">
              <Avatar>
                <AvatarImage src={data?.user.image ?? ""} alt="@shadcn" />
                <AvatarFallback>{data?.user.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="">
                <h4 className="text-gray-500 font-bold text-lg leading-5">
                  {data?.user.name}
                </h4>
                <h5 className="text-gray-400 text-xs uppercase">ADMIN</h5>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-60">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Account</DropdownMenuItem>

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
