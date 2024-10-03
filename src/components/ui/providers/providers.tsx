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
            <Toaster
              position="bottom-right"
              duration={2300}
              closeButton
              pauseWhenPageIsHidden
              richColors
              visibleToasts={3}
            />
          </ThemeProvider>
        </HydrateClient>
      </TRPCReactProvider>
    </>
  );
};
