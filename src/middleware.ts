import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";
import { env } from "./env";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth?.user;
  const path = req.nextUrl.pathname;
  const url = req.nextUrl.clone();

  // Fetch the token (which includes the user's role)
  const token = await getToken({ req, secret: env.AUTH_SECRET });
  
  if (!token) {
    // Redirect to signin if not logged in and not on signin page
    if (!isLoggedIn && path !== "/auth/signin") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.next();
  }

  const role = token.role;  // Assuming role is stored in token (e.g. SUPER_ADMIN, ADMIN, USER)

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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
