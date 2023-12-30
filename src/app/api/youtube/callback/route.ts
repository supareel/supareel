import { type YtIdToken } from "~/app/_types/youtube";
import qs from "querystring";
import { env } from "~/env";
import { oauth2Client } from "~/server/api/youtube/utils";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";
import { error } from "console";
import { getMyYTChannelDetailsApi } from "~/server/api/youtube/yt_channel";
import axios from "axios";
import type { YoutubeChannelDetailsOuput } from "~/schema/youtube_api";

export async function GET(req: NextRequest, _: NextResponse) {
  try {
    const redirectUrl = new URL("/api/youtube/callback?", env.CLIENT_BASE_URL);
    const params = req.url?.replace(redirectUrl.toString(), "");
    const data = qs.decode(params ?? "");
    const code = data?.code ?? "";
    const userEmail = decodeURIComponent(data?.state?.toString() ?? "");

    const { tokens } = await oauth2Client.getToken(code.toString());
    // save tokens to user db

    if (!tokens) throw error("tokens not found");

    if (tokens != null && tokens != undefined) {
      const __url = getMyYTChannelDetailsApi(tokens.access_token ?? "", [
        "snippet",
      ]);

      const response = await axios.get<YoutubeChannelDetailsOuput>(__url, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const data = await db.youTubeChannelDetails.upsert({
        create: {
          yt_channel_id: response.data.items[0]?.id ?? "",
          yt_channel_title: response.data.items[0]?.snippet.title ?? "",
          yt_channel_customurl: response.data.items[0]?.snippet.customUrl,
          yt_channel_thumbnails:
            response.data.items[0]?.snippet.thumbnails.default.url,
          yt_channel_published_at: new Date(
            response.data.items[0]?.snippet.publishedAt ?? ""
          ),
          access_token: tokens.access_token ?? "",
          expiry_date: tokens.expiry_date ?? 0,
          id_token: tokens.id_token ?? "",
          refresh_token: tokens.refresh_token ?? "",
          user: {
            connect: {
              email: userEmail,
            },
          },
        },
        update: {
          yt_channel_id: response.data.items[0]?.id ?? "",
          yt_channel_title: response.data.items[0]?.snippet.title ?? "",
          yt_channel_customurl: response.data.items[0]?.snippet.customUrl,
          yt_channel_thumbnails:
            response.data.items[0]?.snippet.thumbnails.default.url,
          yt_channel_published_at: new Date(
            response.data.items[0]?.snippet.publishedAt ?? ""
          ),
          access_token: tokens.access_token ?? "",
          expiry_date: tokens.expiry_date ?? 0,
          id_token: tokens.id_token ?? "",
          refresh_token: tokens.refresh_token ?? "",
        },
        where: {
          yt_channel_id: response.data.items[0]?.id,
        },
      });
      return NextResponse.redirect(`${env.CLIENT_BASE_URL}/dashboard`, 301);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(
      `${env.CLIENT_BASE_URL}/error?error=${encodeURIComponent(
        "failed to link youtube channel"
      )}`,
      301
    );
    // return res.json({ serverError: err });
  }
}
