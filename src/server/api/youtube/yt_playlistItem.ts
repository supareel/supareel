import qs from "querystring";
import { env } from "~/env";
import { createYoutubeUrl } from "./utils";

export const getYTPlaylistVideosApi = (
  ytPlaylistId: string,
  access_token: string,
  part: string[]
): string => {
  const endpoint = "playlistItems";
  const queryString = qs.stringify({
    part: part.toString(),
    playlistId: ytPlaylistId,
    key: env.YT_API_KEY,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};

export const getMyYTChannelVideosApi = (
  access_token: string,
  part: string[]
): string => {
  const endpoint = "playlistItems";
  const queryString = qs.stringify({
    part: part.toString(),
    key: env.YT_API_KEY,
    mine: true,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};
