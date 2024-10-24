import { env } from "@/env";
import { signInSchema } from "@/lib/validators/auth.validator";
import { verifyPassword } from "@/utils/auth.util";
import { AccessDenied } from "@auth/core/errors";
import type { Role } from "@prisma/client";
import NextAuth, { type DefaultSession, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      name: string;
      email: string;
      image: string;
      affiliateLink: string;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: Role;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    affiliateLink: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

declare module "@auth/core/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    role: Role;
    name: string;
    email: string;
    image: string;
    affiliateLink: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

const invalidCredentialsError = "Invalid email or password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
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
          throw new AccessDenied(invalidCredentialsError);
        }
        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new AccessDenied(invalidCredentialsError);
        }
        const isPasswordValid = await verifyPassword(
          values.data.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new AccessDenied(invalidCredentialsError);
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          image: user.image,
          affiliateLink: user.affiliateLink,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        } satisfies User;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, session, trigger }) => {
      if (trigger === "update" && session?.name) {
        /**
         * const { update } = useSession();
         * update({ name: 'Updated' })
         *
         * when calling update function from the client side, the session object is updated with the new name.
         * and user object is returned as undefined.
         */
        token.name = session.name;
      }
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name ?? "";
        token.email = user.email!;
        token.image = user.image ?? "";
        token.affiliateLink = user.affiliateLink;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.affiliateLink = token.affiliateLink;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
      }
      return session;
    },
  },
});
