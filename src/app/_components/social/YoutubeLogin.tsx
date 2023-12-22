import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

function YoutubeLogin() {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/api/youtube")}>Youtube Login</Button>
  );
}

export default YoutubeLogin;
