"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Home",
    href: "/",
    isHome: true,
  },
  {
    label: "Meetings",
    href: "/meetings",
  },
  {
    label: "Users",
    href: "/users",
  },
  {
    label: "Groups",
    href: "/groups",
  },
];

export function Nav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const session = useSession();
  const isAdmin = session.data?.user.role !== Role.USER;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.label}
          href={`${isAdmin ? "/admin" : ""}${link.href}`}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            link.isHome
              ? pathname === (isAdmin ? "/admin" : "/")
                ? ""
                : "text-muted-foreground"
              : pathname.startsWith(isAdmin ? `/admin${link.href}` : link.href)
                ? ""
                : "text-muted-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
