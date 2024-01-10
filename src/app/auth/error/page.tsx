"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { LOGIN } from "~/utils/route_names";

function Error() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen text-center justify-center items-center">
      <div className="max-w-[500px]">
        <div className="text-xl font-semibold text-red-400 p-6 bg-gray-100 rounded-md">
          {searchParams.get("error")}
        </div>
        <div className="p-2"></div>
        <Button
          variant="secondary"
          onClick={() => {
            console.log("rediring");
            router.replace(LOGIN);
          }}
        >
          Try Login again
        </Button>
      </div>
    </div>
  );
}

export default Error;
