import { type YtIdToken } from "~/app/_types/youtube";
import qs from "querystring";
import { env } from "~/env";
import { oauth2Client } from "~/server/api/youtube/utils";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";
import jwt from "jsonwebtoken";
import { error } from "console";

export async function GET(req: NextRequest, _: NextResponse) {
  try {
    const redirectUrl = new URL("/api/youtube/callback?", env.CLIENT_BASE_URL);
    const params = req.url?.replace(redirectUrl.toString(), "");
    const data = qs.decode(params ?? "");
    const code = data?.code ?? "";

    const { tokens } = await oauth2Client.getToken(code.toString());
    // save tokens to user db
    const id_decoded: YtIdToken = jwt.decode(
      tokens.id_token ?? ""
    ) as YtIdToken;

    if (!tokens) throw error("tokens not found");

    // getYTChannelDetailsApi(id_decoded.);

    if (tokens != null && tokens != undefined) {
      const data = await db.youTubeChannelDetails.upsert({
        create: {
          access_token: tokens.access_token ?? "",
          expiry_date: tokens.expiry_date ?? 0,
          id_token: tokens.id_token ?? "",
          refresh_token: tokens.refresh_token ?? "",
          user: {
            connect: {
              email: id_decoded.email,
            },
          },
        },
        update: {
          access_token: tokens.access_token ?? "",
          expiry_date: tokens.expiry_date ?? 0,
          id_token: tokens.id_token ?? "",
          refresh_token: tokens.refresh_token ?? "",
        },
        where: {
          id_token: tokens.id_token ?? "",
        },
      });
      console.log(data);
      return NextResponse.redirect(`${env.CLIENT_BASE_URL}/dashboard`, 301);
    }
  } catch (err) {
    console.error(err);
    const errString: string = err.toString() as string;

    return NextResponse.redirect(
      `${env.CLIENT_BASE_URL}/error?error=${encodeURIComponent(errString)}`,
      301
    );
    // return res.json({ serverError: err });
  }
}
