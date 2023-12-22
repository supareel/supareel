import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { type IYtAuthorizeUrlResponse } from "~/app/_types/youtube";
import { google } from "googleapis";
import { env } from "~/env";
import { oauth2Client } from "~/server/api/youtube/utils";

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<IYtAuthorizeUrlResponse>
) {
  try {
    // generate a url that asks permissions for Blogger and Google Calendar scopes
    const scopes = [
      "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube",
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      // If you only need one scope you can pass it as a string
      scope: scopes,
      include_granted_scopes: true,
    });

    return NextResponse.redirect(authorizationUrl, 301);
  } catch (err) {
    console.error(err);
  }
}
