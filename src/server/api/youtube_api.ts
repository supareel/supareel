import { format } from "url";
import qs from "querystring";
import { env } from "~/env";
const _createUrl = (endpoint: string, queryString: string): string => {
  return format({
    protocol: "https",
    hostname: "youtube.googleapis.com",
    pathname: `/youtube/v3/${endpoint}`,
    search: queryString.toString(),
  });
};

export const getYTChannelDetailsApi = (id: string): string => {
  const endpoint = "videos";
  const queryString = qs.stringify({
    part: "snippet,contentDetails,statistics",
    id: id,
    key: env.YT_API_KEY,
  });

  return _createUrl(endpoint, queryString);
};
