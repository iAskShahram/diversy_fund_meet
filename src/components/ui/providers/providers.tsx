import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import React from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TRPCReactProvider>
        <HydrateClient>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </HydrateClient>
      </TRPCReactProvider>
      <Toaster />
    </>
  );
};
