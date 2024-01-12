"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { LOGIN } from "~/utils/route_names";
import { redirect, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { api as serverapi } from "~/trpc/server";

import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { CommentTable } from "~/app/_components/dashboard/commentTable";
import { Button } from "~/components/ui/button";
import { BorderDottedIcon, SymbolIcon } from "@radix-ui/react-icons";
import { useSelectedYoutubeChannel } from "~/app/context/youtubeChannel";
import Image from "next/image";
import { Youtube } from "lucide-react";
import Link from "next/link";

export default function VideoDetails({
  params,
}: {
  params: { ytVideoId: string };
}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  const router = useRouter();

  const ytChannel = useSelectedYoutubeChannel();

  const ytVideosDetail = api.video.ytVideoDetails.useQuery({
    videoId: params.ytVideoId,
  });

  const ytVideosCommentList = api.video.syncVideoComments.useQuery(
    {
      videoId: params.ytVideoId ?? "",
      accessToken: ytChannel.selectedChannel?.access_token ?? "",
    },
    {
      enabled: false,
      refetchOnMount: false,
    }
  );

  const handleYTVideosCommentList = async () => {
    // manually refetch
    await ytVideosCommentList.refetch();
  };
  // TODO: remove with a loader component
  if (status === "loading") {
    return "Loading...";
  }
  if (status == "authenticated")
    return (
      <div>
        <div className="grid grid-cols-3 gap-4 m-4">
          <div className="col-span-1">
            <div className="hover:blur-10 ring-4 ring-gray-300 ring-offset-2 ring-offset-transparent relative group rounded-lg overflow-hidden bg-gray-300 hover:opacity-75 transition-opacity">
              <Image
                width={400}
                height={400}
                className="rounded-lg w-full h-64 bg-center  hover:opacity-1
                  object-cover filter blur-0"
                src={ytVideosDetail.data?.yt_video_thumbnail ?? ""}
                alt="Your Image"
              />
              <Link
                className="absolute inset-0 flex items-center justify-center 
              opacity-50 transition-opacity group-hover:opacity-100"
                href={`https://youtu.be/${ytVideosDetail.data?.yt_video_id}`}
                target="_blank"
              >
                <div className="text-white text-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-500 z-10"
                  >
                    <Youtube />
                  </Button>
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-2 gap-2 flex flex-col">
            <p className="text-xl font-bold">
              {ytVideosDetail.data?.yt_video_title}
            </p>

            <div className="flex gap-2">
              <Badge className="py-1 px-1.5 rounded-full">
                <Avatar className="h-5 w-5 rounded-full mr-3">
                  <AvatarImage
                    src={ytVideosDetail.data?.yt_channel.thumbnail}
                  />
                  <AvatarFallback>
                    {ytVideosDetail.data?.yt_channel.title
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {ytVideosDetail.data?.yt_channel.title}
              </Badge>
            </div>
            <p className="capitalize">Views: 4.5/5</p>
            <p className="capitalize">Likes: 4.5/5</p>
            <p className="capitalize">Comments: 4.5/5</p>

            <p className="capitalize">Rating: 4.5/5</p>
            <p className="capitalize">User Emotion average: 4.5/5</p>
            <p className="capitalize">Story Telling points: 4.5/5</p>
            <Button
              variant="outline"
              className="gap-2"
              size="lg"
              disabled={ytVideosCommentList.isRefetching}
              onClick={handleYTVideosCommentList}
            >
              {ytVideosCommentList.isRefetching ? (
                <BorderDottedIcon />
              ) : (
                <SymbolIcon />
              )}
              Sync video comments
            </Button>
          </div>
        </div>
        <Separator className="my-8" />

        {ytVideosDetail.data?.yt_video_description ? (
          <p className="p-8">{ytVideosDetail.data?.yt_video_description}</p>
        ) : (
          <></>
        )}

        <CommentTable comments={ytVideosDetail.data?.yt_video_comments} />
      </div>
    );
}
