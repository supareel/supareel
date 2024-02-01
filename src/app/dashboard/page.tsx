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
import { Input } from "~/components/ui/input";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useSelectedYoutubeChannel } from "../context/youtubeChannel";
import { useSession } from "next-auth/react";
import { LOGIN } from "~/utils/route_names";
import { redirect, useRouter } from "next/navigation";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });
  const [youtubeUrl, setYoutubeUrl] = React.useState<string>("");

  const selectedChannel = useSelectedYoutubeChannel();

  const ytVideosList = api.video.getUserUploadedVideos.useQuery({
    userId: session?.user.id ?? "",
    ytChannelId: selectedChannel.selectedChannel?.yt_channel_id ?? "",
  });

  function grabVideoId(): string {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

    const match = youtubeUrl.match(regExp);
    if (match && match[7]?.length == 11) {
      return match[7] ?? "";
    } else {
      alert("Url incorrect");
      return "";
    }
  }

  // TODO: remove with a loader component
  if (status === "loading") {
    return "Loading...";
  }
  if (status == "authenticated" && selectedChannel.ytChannelList?.channels)
    return (
      <div>
        <div className="grid w-full my-8 items-center justify-center gap-4">
          <Label htmlFor="email" className="text-center text-lg">
            Youtube Video URL
          </Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              onChange={(data) => setYoutubeUrl(data.target.value)}
              type="url"
              className="w-64"
              placeholder="Paste your youtube video url"
            />
            <Button
              type="submit"
              onClick={() => router.push(`/dashboard/${grabVideoId()}`)}
            >
              Go
            </Button>
          </div>
        </div>
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
                          )?.yt_channel_thumbnails ?? ""
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
