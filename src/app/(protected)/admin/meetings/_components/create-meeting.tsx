"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picket";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { enUS } from "date-fns/locale";

export const CreateMeeting = () => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [datetime, setDateTime] = useState<Date | undefined>(undefined);
  const [title, setTitle] = useState<string>("");

  const utils = api.useUtils();
  const { data: groups, isPending } = api.group.getAll.useQuery(
    {
      page: 1,
      perPage: 100,
    },
    {
      enabled: isDialogOpen,
    },
  );
  const { mutate: createEvent, isPending: isCreating } =
    api.event.create.useMutation({
      onSuccess: async () => {
        await utils.event.getAll.invalidate();
        toast.success("Meeting created successfully");
        cancelRef.current?.click();
        setIsDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!datetime) {
      toast.error("Please select a date and time");
      return;
    }
    createEvent({
      title,
      groups: selectedGroups,
      dateTime: datetime,
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      cancelRef.current?.click();
      setSelectedGroups([]);
      setTitle("");
      setDateTime(undefined);
    }
    setIsDialogOpen(open);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <AlertDialogTrigger className="ml-auto" asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Meeting
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px]">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new meeting</AlertDialogTitle>
            <AlertDialogDescription>
              Create new meeting in one click
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isPending || isCreating}
                  minLength={1}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="groups">Groups</Label>
                <MultiSelect
                  options={
                    groups?.groups.map((group) => ({
                      label: group.name,
                      value: group.id,
                    })) ?? []
                  }
                  onValueChange={setSelectedGroups}
                  defaultValue={selectedGroups}
                  placeholder="Select options"
                  variant="inverted"
                  disabled={isPending || isCreating}
                  modalPopover={true}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="groups">Date & Time</Label>
                <DateTimePicker
                  hourCycle={12}
                  value={datetime}
                  onChange={setDateTime}
                  disabled={isPending || isCreating}
                  modalPopover={true}

                  locale={enUS}
                  weekStartsOn={0}
                  showWeekNumber={false}
                  showOutsideDays={true}
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter className="mt-6 flex !justify-between">
            <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
            <Button disabled={isPending || isCreating}>Save</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
