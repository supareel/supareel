"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";
import { LOGIN } from "~/utils/route_names";

function Dashboard() {
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
  return (
    <div>
      Dashboard <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
}

export default Dashboard;
