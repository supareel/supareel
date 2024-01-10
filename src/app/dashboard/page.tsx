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
import { redirect, useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });
  const selectedChannel = useSelectedYoutubeChannel();

  const ytVideosList = api.video.getUserUploadedVideos.useQuery({
    userId: session?.user.id ?? "",
    ytChannelId: selectedChannel.selectedChannel?.yt_channel_id ?? "",
  });

  // TODO: remove with a loader component
  if (status === "loading") {
    return "Loading...";
  }
  if (status == "authenticated" && selectedChannel.ytChannelList?.channels)
    return (
      <div>
        <div className="grid grid-cols-4 gap-4 m-4">
          {ytVideosList.data?.map((videoMeta) => {
            return videoMeta.yt_channel_id ==
              selectedChannel.selectedChannel?.yt_channel_id ? (
              <Card
                key={videoMeta.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/${videoMeta.yt_video_id}`)
                }
              >
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
                          selectedChannel.ytChannelList!.channels.find(
                            (chan) =>
                              chan.yt_channel_id == videoMeta.yt_channel_id
                          )?.yt_channel_thumbnails
                        }
                        alt="@shadcn"
                      />
                      <AvatarFallback>C.N</AvatarFallback>
                    </Avatar>
                    <p className="text-slate-400">
                      {
                        selectedChannel.ytChannelList!.channels.find(
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
