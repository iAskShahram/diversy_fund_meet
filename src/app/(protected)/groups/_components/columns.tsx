"use client";

import { DataTableColumnHeader } from "@/app/(protected)/admin/meetings/_components/dataTable/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { UserRound, Users } from "lucide-react";
import Image from "next/image";
import { z } from "zod";

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  usersCount: z.number(),
  users: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
    }),
  ),
});

export type Group = z.infer<typeof groupSchema>;

export const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group Name" />
    ),
    cell: ({ row }) => {
      const group = row.original;
      return (
        <div className="flex flex-row items-center gap-2 px-4">
          <Users className="h-5 w-5 text-primary" /> {group.name}
        </div>
      );
    },
  },
  {
    accessorKey: "usersCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Members" />
    ),
    cell: ({ row }) => {
      const group = row.original;

      return (
        <div className="flex flex-row items-center gap-2 px-4">
          <UserRound className="h-4 w-4 text-primary" />
          {group.usersCount}
        </div>
      );
    },
  },
  {
    accessorKey: "users",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Members" />
    ),
    cell: ({ row }) => {
      const { users } = row.original;

      return (
        <div className="flex flex-row items-center gap-2 px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"default"} className="cursor-pointer">
                View Members
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`max-h-96 overflow-x-hidden overflow-y-scroll`}
            >
              <DropdownMenuGroup>
                {users.map((user) => (
                  <DropdownMenuItem key={user.id} className="cursor-pointer">
                    <div className="flex items-center gap-1">
                      <Avatar className="!h-5 !w-5">
                        <AvatarImage
                          src={user.image}
                          alt="avatar"
                          width={100}
                          height={100}
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
                      <div>{user.name}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
