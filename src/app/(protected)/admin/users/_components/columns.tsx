"use client";

import { Button } from "@/components/ui/button";
import { GoogleMeet } from "@/components/ui/icons/google-meet.icon";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";
import { DataTableColumnHeader } from "../../meetings/_components/dataTable/data-table-column-header";
// import { EditGroup } from "./edit-group";

export const usersSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  affiliateLink: z.string(),
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
        <div className="flex flex-row items-center gap-2 px-4">{user.name}</div>
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
            <GoogleMeet className="mr-2 h-7 w-7" />
            Copy Link
          </Button>
        </div>
      );
    },
  },
];
