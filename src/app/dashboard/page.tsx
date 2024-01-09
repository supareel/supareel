"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { api } from "~/trpc/react";
import { LOGIN } from "~/utils/route_names";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";

export default function Dashboard() {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  const ytChannelList = api.channel.ytChannelDetails.useQuery({
    userId: data?.user.id ?? "",
  });

  const ytVideosList = api.playlistItem.saveUserUploadedVideos.useQuery({
    userId: data?.user.id ?? "",
    ytChannelId: ytChannelList.data?.channels[0]?.yt_channel_id ?? "",
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
              <CardHeader className="relative h-44">
                <Image
                  alt={"image for yt video"}
                  className="rounded-t-xl"
                  src={videoMeta.snippet.thumbnails.medium.url}
                  fill
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="my-5">
                  {videoMeta.snippet.title}
                </CardTitle>
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
