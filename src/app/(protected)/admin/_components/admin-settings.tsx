import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { signOut } from "@/server/auth";
import { isAdmin } from "@/utils/auth.util";
import type { Session } from "@auth/core/types";
import { ChevronsUpDown, LifeBuoy, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Group = {
  items: Array<{
    label: string;
    icon: React.ElementType;
    href: string;
    isExternal?: boolean;
  }>;
};

const groups: Group[] = [
  {
    items: [
      { label: "Profile", icon: User, href: "/settings/profile" },
      {
        label: "Support",
        icon: LifeBuoy,
        href: "mailto:nico.valdez@diversyfund.com",
        isExternal: true,
      },
    ],
  },
];

export const AdminSettings = async ({
  className,
  session,
}: {
  className?: string;
  session: Session;
}) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex w-full cursor-pointer items-center justify-between gap-6 rounded-lg border p-2 text-sm shadow-sm hover:bg-gray-100">
            <div className="flex items-center space-x-1">
              <Avatar className="flex h-6 w-6 items-center justify-center">
                <AvatarImage
                  src={session.user.image ?? ""}
                  alt={`${session.user.name}'s avatar`}
                  width={24}
                  height={24}
                  className="h-full w-full rounded-full"
                />
                <AvatarFallback className="flex h-full w-full items-center justify-center">
                  <Image
                    src="https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg"
                    alt="avatar"
                    width={100}
                    height={100}
                  />
                </AvatarFallback>
              </Avatar>
              <div>{session?.user.name}</div>
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-60" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn(`w-40 rounded-xl`, className)}>
          {groups.map((group, index) => (
            <DropdownMenuGroup key={index}>
              {group.items.map((item) => (
                <Link
                  href={
                    item.isExternal
                      ? item.href
                      : isAdmin(session)
                        ? "/admin" + item.href
                        : item.href
                  }
                  target={item.isExternal ? "_blank" : "_self"}
                  key={item.label}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    {item.icon && (
                      <item.icon className="mr-2 h-4 w-4 text-primary" />
                    )}
                    {item.label}
                  </DropdownMenuItem>
                </Link>
              ))}
              {group.items.length > 0 && <DropdownMenuSeparator />}
            </DropdownMenuGroup>
          ))}
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="m-0 w-full cursor-pointer p-0">
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
