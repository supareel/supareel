import { env } from "~/env";
import { oauth2Client } from "~/server/api/youtube/utils";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";
import {
  type YoutubeChannelDetailsOuput,
  getMyYTChannelDetailsApi,
} from "~/server/api/youtube/yt_channel";
import axios from "axios";
import url from "url";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, _: NextResponse) {
  try {
    const parsedUrl = url.parse(req.nextUrl.href, true);
    const state = parsedUrl.query.state?.toString();
    const code = parsedUrl.query.code?.toString();
    const userEmail = decodeURIComponent(state?.toString() ?? "");

    if (!code) {
      throw new Error("Authorization code not found");
    }

    if (!state) {
      throw new Error("state not found");
    }

    const { tokens } = await oauth2Client.getToken(code.toString());
    // save tokens to user db

    if (!tokens) throw Error("tokens not found");

    if (tokens != null && tokens != undefined) {
      const __url = getMyYTChannelDetailsApi(tokens.access_token ?? "", [
        "snippet",
        "contentDetails",
      ]);

      const response = await axios.get<YoutubeChannelDetailsOuput>(__url, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      const ytChannelDetails = response.data.items[0];

      await db.youTubeChannelDetails.upsert({
        create: {
          yt_channel_id: ytChannelDetails?.id ?? "",
          yt_channel_title: ytChannelDetails?.snippet.title ?? "",
          yt_channel_customurl: ytChannelDetails?.snippet.customUrl,
          yt_channel_thumbnails:
            ytChannelDetails?.snippet.thumbnails.default.url,
          yt_channel_published_at: new Date(
            ytChannelDetails?.snippet.publishedAt ?? ""
          ),
          user: {
            connect: {
              email: userEmail,
            },
          },
        },
        update: {
          yt_channel_id: ytChannelDetails?.id ?? "",
          yt_channel_title: ytChannelDetails?.snippet.title ?? "",
          yt_channel_customurl: ytChannelDetails?.snippet.customUrl,
          yt_channel_thumbnails:
            ytChannelDetails?.snippet.thumbnails.default.url,
          yt_channel_published_at: new Date(
            ytChannelDetails?.snippet.publishedAt ?? ""
          ),
        },
        where: {
          yt_channel_id: ytChannelDetails?.id,
        },
      });

      return NextResponse.redirect(`${env.CLIENT_BASE_URL}/dashboard`, 301);
    }
  } catch (err) {
    console.error(JSON.stringify(err.response.data, null, 2));
    return NextResponse.redirect(
      `${env.CLIENT_BASE_URL}/error?error=${encodeURIComponent(
        "failed to link youtube channel"
      )}`,
      301
    );
    // return res.json({ serverError: err });
  }
}
