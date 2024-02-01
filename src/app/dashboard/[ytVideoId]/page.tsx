"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LOGIN } from "~/utils/route_names";
import { redirect } from "next/navigation";
import { api } from "~/trpc/react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

import { Separator } from "~/components/ui/separator";
import { CommentTable } from "~/app/_components/dashboard/commentTable";
import { Button } from "~/components/ui/button";
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

  const [chartData, setChartData] = useState<
    { name: string; value: number; color: string }[]
  >([
    {
      name: "Neutral",
      value: 33.33,
      color: "#EAEAEA",
    },
    {
      name: "Positive",
      value: 33.33,
      color: "#EAEAEA",
    },
    {
      name: "Negative",
      value: 33.33,
      color: "#EAEAEA",
    },
  ]);

  const ytVideosDetail = api.video.ytVideoDetailsByVideoId.useQuery({
    videoId: params.ytVideoId ?? "",
  });

  const ytCommentDetail = api.video.ytVideoComments.useQuery({
    videoId: params.ytVideoId ?? "",
  });

  const findPercent = (array: string[], match: string): number => {
    const total = array.length;
    const count = array.filter((curr) => curr === match).length;
    return Math.round((count / total) * 10000) / 100;
  };

  useEffect(() => {
    if (ytCommentDetail?.data && ytCommentDetail.data.length > 0) {
      setChartData([
        {
          name: "Neutral",
          value: findPercent(
            ytCommentDetail?.data?.map((dat) => dat.sentiment) ?? [],
            "neutral"
          ),
          color: "#eaeaea",
        },
        {
          name: "Positive",
          value: findPercent(
            ytCommentDetail?.data?.map((dat) => dat.sentiment) ?? [],
            "positive"
          ),
          color: "#00C49F",
        },
        {
          name: "Negative",
          value: findPercent(
            ytCommentDetail?.data?.map((dat) => dat.sentiment) ?? [],
            "negative"
          ),
          color: "#F94449",
        },
      ]);
    }
  }, [ytCommentDetail?.data]);

  if (status === "loading") {
    return "Loading...";
  }
  if (status == "authenticated")
    return (
      <div>
        <div className="grid grid-cols-12 gap-10 m-4 mx-12">
          <div className="col-span-5">
            <div className="hover:blur-10 ring-4 ring-gray-300 ring-offset-2 ring-offset-transparent relative group rounded-lg overflow-hidden bg-gray-300 hover:opacity-75 transition-opacity">
              <Image
                width={400}
                height={400}
                className="rounded-lg w-full h-64 bg-center  hover:opacity-1
                  object-cover filter blur-0"
                src={`https://img.youtube.com/vi/${ytVideosDetail.data?.video_id}/0.jpg`}
                alt="Your Image"
              />
              <Link
                className="absolute inset-0 flex items-center justify-center 
              opacity-50 transition-opacity group-hover:opacity-100"
                href={`https://www.youtube.com/watch?v=${ytVideosDetail.data?.video_id}`}
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
            <div className="flex justify-evenly my-6">
              <p className="capitalize font-bold text-sm">
                Views: {ytVideosDetail.data?.view_count}
              </p>
              <p className="capitalize font-bold text-sm">
                Likes: {ytVideosDetail.data?.like_count}
              </p>
              <p className="capitalize font-bold text-sm">
                Comments: {ytVideosDetail.data?.comment_count}
              </p>
            </div>
          </div>
          <div className="col-span-7 gap-2 flex flex-col">
            <p className="text-xl font-bold">{ytVideosDetail.data?.title}</p>

            <div className="flex">
              <PieChart width={400} height={300}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={74}
                  fill="#8884d8"
                  dataKey="value"
                  legendType="circle"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      name={entry.name}
                    />
                  ))}
                  <Tooltip />
                </Pie>
              </PieChart>
              <div className="flex flex-col justify-center items-start">
                <div className="flex justify-center items-center gap-4">
                  <div
                    className="h-4 w-4 border-zinc-300 border-2"
                    style={{ backgroundColor: "#00C49F" }}
                  ></div>
                  Positive mood
                </div>
                <div className="flex justify-center items-center gap-4">
                  <div
                    className="h-4 w-4 border-zinc-300 border-2"
                    style={{ backgroundColor: "#eaeaea" }}
                  ></div>
                  Neutral mood
                </div>
                <div className="flex justify-center items-center gap-4">
                  <div
                    className="h-4 w-4 border-zinc-300 border-2"
                    style={{ backgroundColor: "#F94449" }}
                  ></div>
                  Negative mood
                </div>
              </div>
            </div>
            {/* <Button
              variant="outline"
              className="gap-2"
              size="lg"
              disabled={ytVideosDetail.isRefetching}
              onClick={handleYTVideosCommentList}
            >
              {ytVideosDetail.isRefetching ? (
                <BorderDottedIcon />
              ) : (
                <SymbolIcon />
              )}
              Sync video comments
            </Button> */}
          </div>
        </div>
        <Separator className="my-8" />

        {ytVideosDetail.data?.description ? (
          <p className="p-8">{ytVideosDetail.data?.description}</p>
        ) : (
          <></>
        )}

        <CommentTable
          comments={ytCommentDetail?.data?.map((dt) => ({
            id: dt.id,
            comment: dt.yt_comment,
            sentiment: dt.sentiment,
          }))}
        />
      </div>
    );
}
