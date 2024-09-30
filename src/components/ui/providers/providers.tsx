import { TRPCReactProvider } from "@/trpc/react";
import React from "react";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TRPCReactProvider>{children}</TRPCReactProvider>
      <Toaster />
    </>
  );
};
