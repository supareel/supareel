"use client";
import { PlusSquareIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

function YoutubeLogin() {
  const router = useRouter();
  const session = useSession();
  return (
    <Button
      disabled={
        session.status == "unauthenticated" || session.status == "loading"
      }
      onClick={() =>
        router.push(`/api/youtube?state=${session.data?.user.email}`)
      }
      variant="outline"
    >
      <PlusSquareIcon className="h-4 w-4 mr-2" />
      Add Youtube Channel
    </Button>
  );
}

export default YoutubeLogin;
