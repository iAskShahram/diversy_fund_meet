"use client";

import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

export function useIsAdmin(): boolean {
  const { data: session } = useSession();
  return session?.user?.role !== Role.USER;
}
