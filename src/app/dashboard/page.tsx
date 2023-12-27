"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { LOGIN } from "~/utils/route_names";

export default function Dashboard() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  // TODO: remove this line
  if (status === "loading") {
    return "Loading...";
  }
  if (status == "authenticated") return <div></div>;
}
