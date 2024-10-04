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
import { ChevronsUpDown, LogOut, Settings2 } from "lucide-react";
import Link from "next/link";

type Group = {
  items: { label: string; icon: React.ElementType; href: string }[];
};

const groups: Group[] = [
  {
    items: [
      { label: "Settings", icon: Settings2, href: "/admin/settings/profile" },
    ],
  },
];

export const AdminSettings = ({ className }: { className?: string }) => {
  return (
    <div className="w-40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex w-full cursor-pointer items-center justify-between gap-6 rounded-lg border p-2 text-sm shadow-sm hover:bg-gray-100">
            <div className="flex items-center space-x-1">
              <Avatar className="flex h-6 w-6 items-center justify-center">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="h-full w-full"
                />
                <div className="h-4 w-4">
                  <AvatarFallback className="h-full w-full">CN</AvatarFallback>
                </div>
              </Avatar>
              <div>John Doe</div>
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-60" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn(`w-40 rounded-xl`, className)}>
          {groups.map((group, index) => (
            <DropdownMenuGroup key={index}>
              {group.items.map((item) => (
                <Link href={item.href} key={item.label}>
                  <DropdownMenuItem className="cursor-pointer">
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
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
