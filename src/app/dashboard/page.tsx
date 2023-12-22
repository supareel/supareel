"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { LOGIN } from "~/utils/route_names";
import YoutubeLogin from "../_components/social/YoutubeLogin";

export default function Dashboard() {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  // TODO: remove this line
  console.log(`session : ${JSON.stringify(data)}`);
  if (status === "loading") {
    return "Loading...";
  }
  if (status == "authenticated")
    return (
      <div>
        Dashboard <YoutubeLogin />
      </div>
    );
}
