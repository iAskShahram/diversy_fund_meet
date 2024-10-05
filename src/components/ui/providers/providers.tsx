import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import React from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <TRPCReactProvider>
          <HydrateClient>
            <ThemeProvider attribute="class" defaultTheme="light">
              {children}
              <Toaster
                position="bottom-right"
                duration={5000}
                closeButton
                pauseWhenPageIsHidden
                richColors
                visibleToasts={3}
              />
            </ThemeProvider>
          </HydrateClient>
        </TRPCReactProvider>
      </SessionProvider>
    </>
  );
};
