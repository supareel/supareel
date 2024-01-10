import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import qs from "querystring";
import { oauth2Client } from "~/server/api/youtube/utils";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const state = params.get("state") ?? "";
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
      state: encodeURIComponent(state),
    });

    console.log(authorizationUrl);

    return NextResponse.redirect(authorizationUrl, 301);
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(
      env.CLIENT_BASE_URL +
        "/error=?error=failed+to+redirect+to+auth+url+for+login",
      301
    );
  }
}
