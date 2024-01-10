"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { LOGIN } from "~/utils/route_names";
import { redirect } from "next/navigation";
import { api } from "~/trpc/react";
import Image from "next/image";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { CommentTable } from "~/app/_components/dashboard/commentTable";

export default function VideoDetails({
  params,
}: {
  params: { ytVideoId: string };
}) {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });

  const ytVideosDetail = api.video.ytVideoDetails.useQuery({
    videoId: params.ytVideoId,
  });

  // TODO: remove with a loader component
  if (status === "loading") {
    return "Loading...";
  }
  if (status == "authenticated")
    return (
      <div>
        <div className="grid grid-cols-3 gap-4 m-4">
          <div className="col-span-1">
            <Image
              src={ytVideosDetail.data?.yt_video_thumbnail ?? ""}
              alt="youtube video thumbnail"
              height={400}
              width={400}
              className="rounded-lg ring-4 ring-gray-300"
            />
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

            <p className="capitalize">Rating: 4.5/5</p>
            <p className="capitalize">User Emotion average: 4.5/5</p>
            <p className="capitalize">Story Telling points: 4.5/5</p>
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
