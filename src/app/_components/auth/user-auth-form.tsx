"use client";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Icons } from "~/app/_components/icons";
import { Button } from "~/components/ui/button";
import { type LiteralUnion, signIn } from "next-auth/react";
import { type BuiltInProviderType } from "next-auth/providers/index";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  test?: string;
}

export function UserAuthLoginForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] =
    React.useState<LiteralUnion<BuiltInProviderType>>("");

  async function onSubmit(
    event: React.SyntheticEvent,
    provider: LiteralUnion<BuiltInProviderType>
  ) {
    event.preventDefault();
    setIsLoading(true);
    setSelectedProvider(provider);

    await signIn(provider);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    setSelectedProvider("");
  }

  return (
    <div className={cn("grid gap-y-3", className)} {...props}>
      <Button
        variant="outline"
        className="hover:border-red-300 hover:text-red-500"
        type="button"
        size="lg"
        disabled={isLoading}
        onClick={async (event) => {
          await onSubmit(event, "google");
        }}
      >
        {selectedProvider == "google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with Google
      </Button>
    </div>
  );
}
