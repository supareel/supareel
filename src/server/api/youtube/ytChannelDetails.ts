import qs from "querystring";
import { env } from "~/env";
import { createYoutubeUrl } from "./utils";

export const getYTChannelDetailsApi = (id: string): string => {
  const endpoint = "videos";
  const queryString = qs.stringify({
    part: "snippet,contentDetails,statistics",
    id: id,
    key: env.YT_API_KEY,
  });

  return createYoutubeUrl(endpoint, queryString);
};
