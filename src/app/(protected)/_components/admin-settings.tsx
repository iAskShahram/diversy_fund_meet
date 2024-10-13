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
import { LogOut, Settings, User } from "lucide-react";

type Group = {
  items: { label: string; icon: React.ElementType; href: string }[];
};

const groups: Group[] = [
  // {
  //   items: [{ label: "Profile", icon: User, href: "/profile" }],
  // },
];

export const AdminSettings = ({ className }: { className?: string }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer rounded-full border-none px-4 py-2 shadow-sm hover:bg-gray-100">
            <Settings className="opacity-60" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn(`w-56`, className)}>
          {groups.map((group, index) => (
            <DropdownMenuGroup key={index}>
              {group.items.map((item) => (
                <DropdownMenuItem key={item.label} className="cursor-pointer">
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </DropdownMenuItem>
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
