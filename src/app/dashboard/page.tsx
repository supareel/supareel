"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { api } from "~/trpc/react";
import { LOGIN } from "~/utils/route_names";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";

export default function Dashboard() {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  const ytVideosList = api.playlistItem.getUserUploadedVideos.useQuery({
    userId: data?.user.id ?? "",
  });

  // TODO: remove this line
  if (status === "loading") {
    return "Loading...";
  }
  if (status == "authenticated")
    return (
      <div>
        <div className="grid grid-cols-4 gap-4 m-4">
          {ytVideosList.data?.items.map((videoMeta) => (
            <Card key={videoMeta.id}>
              <CardHeader>
                <Image
                  alt={"image for yt video"}
                  src={videoMeta.snippet.thumbnails.medium.url}
                  height={200}
                  width={280}
                />
                <CardTitle className="my-5">
                  {videoMeta.snippet.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardContent></CardContent>
                <CardDescription>
                  {videoMeta.snippet.description.slice(0, 100)}...
                </CardDescription>
              </CardContent>
              {/* <CardFooter>
                <p>Card Footer</p>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      </div>
    );
}
