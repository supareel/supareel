import { format } from "url";
import { google } from "googleapis";
import { env } from "~/env";

const redirectUrl: URL = new URL("/api/youtube/callback", env.CLIENT_BASE_URL);
export const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  redirectUrl.toString()
);

export const createYoutubeUrl = (
  endpoint: string,
  queryString: string
): string => {
  return format({
    protocol: "https",
    hostname: "youtube.googleapis.com",
    pathname: `/youtube/v3/${endpoint}`,
    search: queryString.toString(),
  });
};
