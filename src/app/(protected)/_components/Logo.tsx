import Link from "next/link";
import { AppLogo } from "./app-logo";
import { auth } from "@/server/auth";
import { isAdmin } from "@/utils/auth.util";

export const Logo = async () => {
  const session = await auth();
  return (
    <Link href={isAdmin(session!) ? "/admin" : "/"}>
      <AppLogo />
    </Link>
  );
};
