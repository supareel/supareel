import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import SocialLinksList from "../social/socialLink";

function Footer() {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 grid grid-cols-3 p-4 items-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <SocialLinksList className="my-5" />
    </div>
  );
}

export default Footer;
