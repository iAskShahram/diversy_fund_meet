"use client";

import { DataTableColumnHeader } from "@/app/(protected)/admin/meetings/_components/dataTable/data-table-column-header";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Trash2, UserRound, Users } from "lucide-react";
import { z } from "zod";
import { EditGroup } from "./edit-group";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  usersCount: z.number(),
});

export type Group = z.infer<typeof groupSchema>;

const actionColumn: ColumnDef<Group>[] = [
  {
    id: "edit_group",
    header: () => <div>Edit Group</div>,
    cell: ({ row }: { row: Row<Group> }) => {
      const group = row.original;

      return <EditGroup groupId={group.id} />;
    },
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      const group = row.original;

      const utils = api.useUtils();
      const { mutate: deletegroup, isPending } = api.group.delete.useMutation({
        onSuccess: async () => {
          await utils.group.getAll.invalidate();
        },
        onError: (error) => {
          toast.error(`Error deleting group: ${error.message}`);
        },
      });

      const handleDelete = () => {
        if (
          window.confirm(
            "This will also delete any events associated with the group.\nNOTE: This action cannot be undone.\n\nAre you sure?",
          )
        ) {
          deletegroup({ id: group.id });
        }
      };

      return (
        <div className="flex items-center">
          <Button
            variant={"outline"}
            className="border border-destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
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
  // {
  //   id: "actions",
  //   header: () => <div>Action</div>,
  //   cell: ({ row }: { row: Row<Group> }) => {
  //     const group = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <EditGroup groupId={group.id} />
  //       </div>
  //     );
  //   },
  // },
];

export const userColumns: ColumnDef<Group>[] = [
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
];

export const adminColumns: ColumnDef<Group>[] = [
  ...userColumns,
  ...actionColumn,
];
