import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const path = req.nextUrl.pathname;

  console.log(`Path: ${path}, IsLoggedIn: ${isLoggedIn}`);

  if (isLoggedIn && path === "/auth/signin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isLoggedIn && path !== "/auth/signin") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
