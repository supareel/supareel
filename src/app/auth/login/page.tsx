"use client";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";

import { UserAuthLoginForm } from "~/app/_components/auth/user-auth-form";
import { useSession } from "next-auth/react";
import { AUTHERROR, DASHBOARD } from "~/utils/route_names";
import { TopNavigation } from "~/app/_components/landing/navbar";

// export const metadata: Metadata = {
//   title: "Authentication",
//   description: "Authentication forms built using the components.",
// }

export default function AuthenticationPage() {
  const { status } = useSession();
  const searchParams = useSearchParams();

  if (status == "authenticated") redirect(DASHBOARD);
  if (searchParams.get("error"))
    redirect(
      AUTHERROR +
        "?error=" +
        encodeURIComponent(
          "please switch to better internet connection, server timeout request timed out after 3500ms"
        )
    );

  return (
    <>
      <TopNavigation />
      <div className="container h-screen flex-col items-center justify-center grid max-w-none">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login into your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Use any one of the following to authenticate
            </p>
          </div>
          <UserAuthLoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
