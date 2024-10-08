import { auth } from "@/server/auth";
import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { env } from "./env";
import { signOut } from "next-auth/react";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth?.user;
  const path = req.nextUrl.pathname;
  const url = req.nextUrl.clone();

  const currentHost = req.headers.get("host");
  const trustedHost = new URL(env.NEXTAUTH_URL).host;
  if (currentHost !== trustedHost) {
    console.error(`Untrusted host: ${currentHost}`);
    await signOut();
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Allow access to images in the public folder
  if (path.startsWith("/static/")) {
    return NextResponse.next();
  }

  // Fetch the token (which includes the user's role)
  const token = await getToken({ req, secret: env.AUTH_SECRET });

  if (!token) {
    // Redirect to signin if not logged in and not on signin page
    if (!isLoggedIn && path !== "/auth/signin") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.next();
  }

  const role = token.role; // Assuming role is stored in token (e.g. SUPER_ADMIN, ADMIN, USER)

  // Redirect if admin to /admin* routes
  if (isLoggedIn && (role === Role.SUPER_ADMIN || role === Role.ADMIN)) {
    if (!path.startsWith("/admin")) {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  // Redirect if user is USER to root /
  if (isLoggedIn && role === Role.USER) {
    if (path.startsWith("/admin")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Handle redirect to root if trying to access signin while logged in
  if (isLoggedIn && path === "/auth/signin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|static).*)"],
};
