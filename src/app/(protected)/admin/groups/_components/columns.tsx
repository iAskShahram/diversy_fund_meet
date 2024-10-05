"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { FilePen, UserRound } from "lucide-react";
import { z } from "zod";
import { DataTableColumnHeader } from "../../meetings/_components/dataTable/data-table-column-header";

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
          <Button variant={"outline"}>
            <FilePen className="mr-2 h-4 w-4" />
            Edit Group
          </Button>
        </div>
      );
    },
  },
];
