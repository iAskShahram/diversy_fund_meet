"use client";

import { SubmitButton } from "@/app/_components/submit-button";
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
import { MultiSelect, type Option } from "@/components/ui/multi-select";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

const groupOptions: Option[] = Array.from({ length: 20 }, (_, index) => ({
  label: `Group ${index + 1}`,
  value: `cuid${index + 1}`,
}));
export const CreateMeeting = () => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [groups, setGroups] = useState<string[]>([]);

  // new Date(datetime).toISOString() this will give utc time
  const [datetime, setDateTime] = useState<Date | undefined>(undefined);

  return (
    <AlertDialog>
      <AlertDialogTrigger className="ml-auto" asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Meeting
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px]">
        <form>
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
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="groups">Groups</Label>
                <MultiSelect
                  options={groupOptions}
                  onValueChange={setGroups}
                  defaultValue={groups}
                  placeholder="Select options"
                  variant="inverted"
                  modalPopover={true}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="groups">Date & Time</Label>
                <DateTimePicker
                  hourCycle={12}
                  value={datetime}
                  onChange={setDateTime}
                  modalPopover={true}
                />
              </div>
            </div>
            {/* errors can be destructured from useForm  */}
            {/* <p
              role="status"
              className={cn(!!state?.errors && "text-sm text-red-500")}
            >
              {!state?.success && state?.errors.split(".")[0]}
            </p> */}
          </div>
          <AlertDialogFooter className="mt-6 flex !justify-between">
            <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
            <SubmitButton txt="Save" className="w-auto" />
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
