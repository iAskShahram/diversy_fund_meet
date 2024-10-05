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
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const CreateGroup = () => {
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [userIDs, setUserIDs] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const { data: users } = api.user.getAll.useQuery();

  const { mutate: createGroup, isPending } = api.group.create.useMutation({
    onSuccess: () => {
      toast.success("Group created successfully");
      setName("");
      setUserIDs([]);
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createGroup({ name, userIDs });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
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
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="groups">Add Users</Label>
                <MultiSelect
                  options={
                    users?.map(
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
                  disabled={isPending}
                />
              </div>
            </div>
            {/* errors can be destructured from useForm  */}
            <p role="status" className={"text-sm text-red-500"}>
              {error}
            </p>
          </div>
          <AlertDialogFooter className="mt-6 flex !justify-between">
            <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
            <Button className="w-auto" disabled={isPending}>
              Save
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
