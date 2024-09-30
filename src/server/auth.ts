import { env } from "@/env";
import NextAuth, { type User, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: string;
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
      async authorize(credentials, req) {
        // This function is already present and necessary
        // You should implement your actual authentication logic here
        // For example:
        // const user = await db.user.findUnique({
        //   where: {
        //     email: credentials.username,
        //   },
        // });
        // if (user && await comparePasswords(credentials.password, user.password)) {
        //   return user;
        // }
        // return null;

        // Placeholder return for demonstration:
        const tmpuser: User = {
          id: "1",
          name: "J Smith",
          email: "jsmith@example.com",
          role: "admin",
        };
        return tmpuser;
      },
    }),
  ],
  callbacks: {
    // The signIn callback is already present and correctly implemented
    signIn: async ({ user, account, profile, email, credentials }) => {
      // log and check which one is executed in which order
      console.log("signIn :: ", user, account, profile, email, credentials);
      return true;
    },
    jwt: async ({ token, user, account, profile, session, trigger }) => {
      console.log("jwt :: ", token, user, account, profile, session, trigger);
      if (user) {
        token.id = user.id;
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
