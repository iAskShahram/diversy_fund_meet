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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect, type Option } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { FilePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const EditGroup = ({ groupId }: { groupId: string }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userIDs, setUserIDs] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const utils = api.useUtils();

  const { data, isPending, refetch } = api.group.getUsers.useQuery(
    { groupId },
    {
      enabled: isDialogOpen,
    },
  );
  const { groupUsers, notGroupUsers } = data ?? {};

  const { mutate: updateGroup, isPending: isUpdating } =
    api.group.update.useMutation({
      onSuccess: async () => {
        await utils.group.getAll.invalidate();
        toast.success("Group updated successfully");
        setIsDialogOpen(false);
        cancelRef.current?.click();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateGroup({ groupId, name, userIDs });
  };

  useEffect(() => {
    if (!isPending) {
      if (!!data?.groupUsers?.users.length) {
        const _userIDs = data.groupUsers.users.map((user) => user.id);
        setUserIDs(_userIDs);
      }

      if (data?.groupUsers) {
        setName(data.groupUsers.name);
      }
    }
  }, [data?.groupUsers, isPending]);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      void refetch();
    } else {
      cancelRef.current?.click();
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>
          <FilePen className="mr-2 h-4 w-4" />
          Edit Group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px]">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new Group</AlertDialogTitle>
            <AlertDialogDescription>
              Create new group in one click
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Group Name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  disabled={isPending || isUpdating}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="groups">Add Users</Label>
                {isPending ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <MultiSelect
                    options={
                      // first render all the users that are not in the group, then all the users that are in the group
                      [
                        ...(notGroupUsers ?? []),
                        ...(groupUsers?.users ?? []),
                      ]?.map(
                        (user) =>
                          ({
                            label: user.name ?? "",
                            value: user.id,
                          }) satisfies Option,
                      ) ?? []
                    }
                    onValueChange={setUserIDs}
                    defaultValue={userIDs}
                    placeholder="Select users"
                    variant="inverted"
                    modalPopover={true}
                    disabled={isPending || isUpdating}
                  />
                )}
              </div>
            </div>
          </div>
          <AlertDialogFooter className="mt-6 flex !justify-between">
            <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
            <Button className="w-auto" disabled={isPending || isUpdating}>
              Save
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
