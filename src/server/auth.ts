import { env } from "@/env";
import { signInSchema } from "@/lib/validators/auth";
import { verifyPassword } from "@/utils/auth.util";
import type { Role } from "@prisma/client";
import createHttpError from "http-errors";
import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      role: Role;
      email: string;
      image: string;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }
}

declare module "@auth/core/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: number;
    role: Role;
    email: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  secret: env.AUTH_SECRET,

  pages: {
    signIn: "/auth/signin", // Point to custom sign-in page
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // validate email and password through schema
        const values = await signInSchema.safeParseAsync({
          email: credentials.email,
          password: credentials.password,
        });
        if (!values.success) {
          throw createHttpError.BadRequest(
            values.error.errors[0]?.message ?? "Invalid email or password",
          );
        }
        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw createHttpError.NotFound("User not found");
        }
        const isPasswordValid = await verifyPassword(
          values.data.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw createHttpError.Unauthorized("Invalid email or password");
        }

        // return user;

        return {
          id: user.id.toString(),
          role: user.role,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    }),
  ],
  callbacks: {
    // The signIn callback is already present and correctly implemented
    signIn: async ({ user, account, profile, email, credentials }) => {
      // log and check which one is executed in which order
      console.log("signIn :: ", user, account, profile, email, credentials);
      // user ha values returned from authorzie
      return true;
    },
    jwt: async ({ token, user, account, profile, session, trigger }) => {
      console.log("jwt :: ", token, user, account, profile, session, trigger);
      // user ahs values returned from singin
      if (user.id) {
        token.id = parseInt(user.id);
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token, newSession, trigger, user }) => {
      console.log("session :: ", session, token, newSession, trigger, user);
      if (token.id) {
        // session.user.id = token.id;
      }
      return session;
    },
  },
});
