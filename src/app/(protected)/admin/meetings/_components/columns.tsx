"use client";

import { Button } from "@/components/ui/button";
import { GoogleMeet } from "@/components/ui/icons/google-meet.icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { RsvpStatus } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDownNarrowWide,
  CircleCheck,
  CircleX,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { DataTableColumnHeader } from "./dataTable/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const MeetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  googleMeetLink: z.string(),
  dateTime: z.date(),
  groups: z.string(),
  rsvp: z.nativeEnum(RsvpStatus),
  rsvps: z.array(
    z.object({
      id: z.string(),
      rsvp: z.nativeEnum(RsvpStatus),
      eventId: z.string(),
      user: z
        .object({
          name: z.string(),
          image: z.string(),
        })
        .optional(),
    }),
  ),
});

export type Meeting = z.infer<typeof MeetingSchema>;

const actionColumn: ColumnDef<Meeting> = {
  id: "actions",
  header: () => <div>Actions</div>,
  cell: ({ row }) => {
    const event = row.original;

    const utils = api.useUtils();
    const { mutate: deleteEvent, isPending } = api.event.delete.useMutation({
      onSuccess: async () => {
        await utils.event.getAll.invalidate();
      },
      onError: (error) => {
        toast.error(`Error deleting event: ${error.message}`);
      },
    });

    const handleDelete = () => {
      if (
        window.confirm(
          "This will delete event history for everyone.\nNOTE: This action cannot be undone.\n\nAre you sure?",
        )
      ) {
        deleteEvent({ id: event.id });
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
};

const rsvpColumn: ColumnDef<Meeting> = {
  accessorKey: "rsvp",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="RSVP" />
  ),
  cell: ({ row }) => {
    const rsvp = row.getValue("rsvp");
    const _row = row.original;
    const utils = api.useUtils();
    const { mutate: updateRsvp, isPending } = api.rsvp.update.useMutation({
      onSuccess: async () => {
        await utils.event.getAll.invalidate();
        toast.success(`RSVP updated!`);
      },
      onError: (error) => {
        toast.error(`Error updating RSVP: ${error.message}`);
      },
    });

    const handleRSVPChange = async (value: string) => {
      updateRsvp({
        id: _row.rsvps[0]?.id ?? null,
        rsvp: value as RsvpStatus,
        eventId: _row.id,
      });
    };

    return (
      <Select
        defaultValue={rsvp as RsvpStatus}
        onValueChange={handleRSVPChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              {rsvp === RsvpStatus.YES ? (
                <CircleCheck className="h-4 w-4 text-primary" />
              ) : (
                <CircleX className="h-4 w-4" />
              )}{" "}
              <div
                className={`text-sm ${
                  rsvp === RsvpStatus.YES ? "text-primary" : ""
                }`}
              >
                {rsvp as RsvpStatus}
              </div>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={RsvpStatus.YES}>{RsvpStatus.YES}</SelectItem>
          <SelectItem value={RsvpStatus.NO}>{RsvpStatus.NO}</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

const meetColumn: ColumnDef<Meeting> = {
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
};

const baseColumns: ColumnDef<Meeting>[] = [
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
    accessorKey: "groups",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Groups" />
    ),
    cell: ({ row }) => {
      const groups = row.getValue("groups");
      return <div className="max-w-[500px] truncate">{groups as string}</div>;
    },
  },
];

const listRsvpColumn: ColumnDef<Meeting> = {
  accessorKey: "rsvps",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="RSVP Status" />
  ),
  cell: ({ row }) => {
    const { rsvps } = row.original;

    return (
      <div className="flex flex-row items-center gap-2 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"default"}
              className="cursor-pointer rounded-full bg-primary/90 hover:shadow-2xl"
            >
              <ArrowDownNarrowWide className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {rsvps.map((rsvp) => (
                <DropdownMenuItem key={rsvp.id} className="cursor-pointer">
                  <div className="flex w-full items-center gap-1">
                    <Avatar className="!h-5 !w-5">
                      <AvatarImage
                        src={rsvp.user?.image}
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
                    <div className="flex w-full justify-between gap-1">
                      {rsvp.user?.name}
                      <Badge
                        className={`rounded-full ${rsvp.rsvp === RsvpStatus.YES ? "border border-green-700 bg-green-100 text-green-700" : "border border-destructive bg-red-100 text-destructive"}`}
                        variant={"outline"}
                      >
                        {rsvp.rsvp}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};

export const userColumns: ColumnDef<Meeting>[] = [
  ...baseColumns,
  rsvpColumn,
  meetColumn,
];

export const adminColumns: ColumnDef<Meeting>[] = [
  ...baseColumns,
  meetColumn,
  listRsvpColumn,
  actionColumn,
];
