import type { PrismaClient, Role } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type { User } from "next-auth";

export type Context = {
  headers: Headers;
  db: PrismaClient<
    {
      log: ("query" | "warn" | "error")[];
    },
    never,
    DefaultArgs
  >;
  session: {
    user: {
      id: string;
      role: Role;
      email: string;
      image: string;
      affiliateLink: string;
      createdAt: Date;
      updatedAt: Date;
    } & User;
    expires: string;
  };
};
