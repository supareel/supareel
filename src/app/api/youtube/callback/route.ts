import type { NextApiRequest, NextApiResponse } from "next";
import {
  type IYtAuthorizationCodeResponse,
  type IYtAuthorizeUrlResponse,
} from "~/app/_types/youtube";
import qs from "querystring";
import { env } from "~/env";
import { oauth2Client } from "~/server/api/youtube/utils";

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<IYtAuthorizeUrlResponse>
) {
  try {
    const redirectUrl = new URL("/api/youtube/callback?", env.CLIENT_BASE_URL);
    const params = req.url?.replace(redirectUrl.toString(), "");
    const data = qs.decode(params ?? "");
    const code = data?.code ?? "";

    const { tokens } = await oauth2Client.getToken(code.toString());
    // save tokens to user db
    
    return res.json({ url: "data" });
  } catch (err) {
    console.error(err);
  }
}
