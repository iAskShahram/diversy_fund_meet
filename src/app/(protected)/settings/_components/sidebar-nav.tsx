"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signoutAction } from "../_action/signout.action";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start font-semibold",
          )}
        >
          {item.title}
        </Link>
      ))}
      <form action={signoutAction}>
        <Button
          variant="ghost"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start font-semibold text-destructive hover:bg-transparent hover:text-destructive hover:underline",
          )}
        >
          Sign Out
        </Button>
      </form>
    </nav>
  );
}
