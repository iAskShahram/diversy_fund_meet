import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import React from "react";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TRPCReactProvider>
        <HydrateClient>{children}</HydrateClient>
      </TRPCReactProvider>
      <Toaster />
    </>
  );
};
