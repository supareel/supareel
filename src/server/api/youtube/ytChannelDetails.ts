import qs from "querystring";
import { env } from "~/env";
import { createYoutubeUrl } from "./utils";

export const getYTChannelDetailsApi = (
  ytChannelId: string,
  access_token: string,
  part: string[]
): string => {
  const endpoint = "channels";
  const queryString = qs.stringify({
    part: part.toString(),
    id: ytChannelId,
    key: env.YT_API_KEY,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};

export const getMyYTChannelDetailsApi = (
  access_token: string,
  part: string[]
): string => {
  const endpoint = "channels";
  const queryString = qs.stringify({
    part: part.toString(),
    key: env.YT_API_KEY,
    mine: true,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};
