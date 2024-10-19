"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { isAdmin } from "@/utils/auth.util";
import { usePathname } from "next/navigation";
import type { Session } from "@auth/core/types";

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

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  session: Session;
}

export function Nav({ session, className, ...props }: NavProps) {
  const pathname = usePathname();
  const _isAdmin = isAdmin(session);
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.label}
          href={`${_isAdmin ? "/admin" : ""}${link.href}`}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            link.isHome
              ? pathname === (_isAdmin ? "/admin" : "/")
                ? ""
                : "text-muted-foreground"
              : pathname.startsWith(_isAdmin ? `/admin${link.href}` : link.href)
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
