"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Home",
    href: "/admin",
    isHome: true,
  },
  {
    label: "Meetings",
    href: "/admin/meetings",
  },
  {
    label: "Directory",
    href: "/admin/directory",
  },
  {
    label: "Groups",
    href: "/admin/groups",
  },
];

export function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            link.isHome
              ? pathname === link.href
                ? ""
                : "text-muted-foreground"
              : pathname.startsWith(link.href)
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
