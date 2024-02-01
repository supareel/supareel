import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { NextAuthProvider } from "~/providers/auth";
import { getServerAuthSession } from "~/server/auth";
import { ThemeProvider } from "~/providers/theme";

export const metadata = {
  title: "Supareel - Super App for Youtubers",
  description: "SuperApp for youtube content creators",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider cookies={cookies().toString()}>
            <NextAuthProvider session={session}>{children}</NextAuthProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
