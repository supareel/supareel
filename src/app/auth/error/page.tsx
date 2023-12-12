"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

function Error() {
  const searchParams = useSearchParams();

  return (
    <div className="flex h-screen justify-center items-center">
      <span className="text-xl font-semibold text-red-400 p-6 bg-gray-100 rounded-md">
        {searchParams.get("error")}
      </span>
    </div>
  );
}

export default Error;
