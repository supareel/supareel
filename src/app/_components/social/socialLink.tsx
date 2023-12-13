import React from 'react'
import GitHub from "./Github";
import LinkedIn from "./LinkedIn";
import Twitter from "./Twitter";
import Youtube from "./Youtube";

export function SocialLinksList({ className }: { className?: string }) {
  return (
    <div className={"flex items-center gap-2 justify-center" + " " + className}>
      <Youtube />
      <Twitter />
      <LinkedIn />
      <GitHub />
    </div>
  );
}

export default SocialLinksList;