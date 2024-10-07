"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoogleMeet } from "@/components/ui/icons/google-meet.icon";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { DataTableColumnHeader } from "./dataTable/data-table-column-header";
import { format } from "date-fns";

export const MeetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  googleMeetLink: z.string(),
  dateTime: z.date(),
});

export type Meeting = z.infer<typeof MeetingSchema>;

export const columns: ColumnDef<Meeting>[] = [
  {
    accessorKey: "dateTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const dateTime = row.getValue("dateTime");
      return <div>{format(dateTime as Date, "PPpp")}</div>;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Meeting Name" />
    ),
  },
  {
    accessorKey: "googleMeetLink",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Google Meet Link" />
    ),
    cell: ({ row }) => {
      const meet_link = row.getValue("googleMeetLink");
      return (
        <Button
          className="border p-2"
          variant={"outline"}
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(meet_link as string);
            toast.success("Link copied to clipboard");
          }}
        >
          <GoogleMeet className="mr-2 h-7 w-7" />
          Copy Link
        </Button>
      );
    },
  },

  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
