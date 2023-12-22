"use client";
import * as React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ModeToggle } from "~/app/_components/themeToggle";
import { redirect, useRouter } from "next/navigation";
import { LOGIN } from "~/utils/route_names";
import { cn } from "~/lib/utils";
import { Icons } from "~/app/_components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { signOut, useSession } from "next-auth/react";

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
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  if (status == "authenticated")
    return (
      <div className="flex py-3 px-6 justify-between items-center sticky top-0 z-50 dark:bg-gray-950 bg-white border-b">
        <div className="">
          <h4 className="text-gray-500 font-bold text-lg leading-5">
            {data?.user.name}
          </h4>
          <h5 className="text-gray-400 text-xs uppercase">ADMIN</h5>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <ModeToggle />
          {status == "authenticated" ? (
            <Button variant="destructive" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <Button variant="default" onClick={() => router.push(LOGIN)}>
              Login
            </Button>
          )}
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
