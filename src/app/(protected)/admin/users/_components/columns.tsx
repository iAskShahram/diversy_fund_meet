"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Files, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { z } from "zod";
import { DataTableColumnHeader } from "../../meetings/_components/dataTable/data-table-column-header";

export const usersSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  affiliateLink: z.string(),
  image: z.string(),
  groups: z.string(),
});

export type Meeting = z.infer<typeof usersSchema>;

export const columns: ColumnDef<Meeting>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex">
          <div>
            <Avatar>
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback className="h-full w-full">
                <Image
                  src="https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg"
                  alt="avatar"
                  width={100}
                  height={100}
                />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-row items-center gap-2 px-4">
            {user.name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-row items-center gap-2 px-4">
          {user.email}
        </div>
      );
    },
  },
  {
    accessorKey: "groups",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Groups" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="max-w-[500px] truncate" title={user.groups}>
          {user.groups}
        </div>
      );
    },
  },
  {
    id: "affiliateLink",
    header: () => <div>Personal Affiliate Link</div>,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            className="border p-2"
            variant={"outline"}
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(user.affiliateLink);
              toast.success("Link copied to clipboard");
            }}
          >
            Copy Link
            <Files className="ml-2 h-4 w-4 text-primary" />
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const utils = api.useUtils();
      const { mutate: deleteUser } = api.user.delete.useMutation({
        onSuccess: () => {
          toast.success("User deleted");
          void utils.user.getAll.invalidate();
        },
        onError: () => {
          toast.error("Failed to delete user");
        },
      });

      return (
        <div className="flex items-center gap-2">
          <Button
            className="border border-destructive p-2"
            variant={"outline"}
            type="button"
            onClick={async () => {
              const confirmed = confirm(
                "Are you sure you want to delete this user?",
              );
              if (confirmed) {
                deleteUser({ id: user.id });
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
