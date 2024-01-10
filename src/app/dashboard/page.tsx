"use client";
import React from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useSelectedYoutubeChannel } from "../context/youtubeChannel";
import { useSession } from "next-auth/react";
import { LOGIN } from "~/utils/route_names";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });
  const selectedChannel = useSelectedYoutubeChannel();

  const ytChannelList = api.channel.ytChannelDetails.useQuery({
    userId: session?.user.id ?? "",
  });

  const ytVideosList = api.playlistItem.getUserUploadedVideos.useQuery({
    userId: session?.user.id ?? "",
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
          {ytVideosList.data?.map((videoMeta) => {
            return videoMeta.yt_channel_id ==
              selectedChannel.selectedChannel?.yt_channel_id ? (
              <Card key={videoMeta.id}>
                <CardHeader className="relative h-44">
                  <Image
                    alt={"image for yt video"}
                    className="rounded-t-xl"
                    src={videoMeta.yt_video_thumbnail}
                    fill
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="my-5">
                    {videoMeta.yt_video_title.length < 60
                      ? videoMeta.yt_video_title
                      : `${videoMeta.yt_video_title.substring(0, 60)} ...`}
                  </CardTitle>
                </CardContent>

                <CardFooter>
                  <span className="flex gap-3 justify-center items-center">
                    <Avatar>
                      <AvatarImage
                        src={
                          ytChannelList.data?.channels.find(
                            (chan) =>
                              chan.yt_channel_id == videoMeta.yt_channel_id
                          )?.yt_channel_thumbnails
                        }
                        alt="@shadcn"
                      />
                      <AvatarFallback>C.N</AvatarFallback>
                    </Avatar>
                    <p>
                      {
                        ytChannelList.data?.channels.find(
                          (chan) =>
                            chan.yt_channel_id == videoMeta.yt_channel_id
                        )?.yt_channel_title
                      }
                    </p>
                  </span>
                </CardFooter>
              </Card>
            ) : (
              <></>
            );
          })}
        </div>
      </div>
    );
}
