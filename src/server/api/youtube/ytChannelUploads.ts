import qs from "querystring";
import { env } from "~/env";
import { createYoutubeUrl } from "./utils";

export const getYTChannelUploadApi = (
  ytChannelIds: string[],
  access_token: string,
  part: string[]
): string => {
  const endpoint = "playlists";
  const queryString = qs.stringify({
    part: part.toString(),
    id: ytChannelIds.toString(),
    key: env.YT_API_KEY,
    mine: true,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};
