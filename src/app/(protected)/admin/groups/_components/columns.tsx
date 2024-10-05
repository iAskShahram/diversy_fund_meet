"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { FilePen, UserRound, Users } from "lucide-react";
import { z } from "zod";
import { DataTableColumnHeader } from "../../meetings/_components/dataTable/data-table-column-header";
import { EditGroup } from "./edit-group";

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  usersCount: z.number(),
});

export type Meeting = z.infer<typeof groupSchema>;

export const columns: ColumnDef<Meeting>[] = [
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
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => {
      const group = row.original;

      return (
        <div className="flex items-center gap-2">
          <EditGroup groupId={group.id} />
        </div>
      );
    },
  },
];
