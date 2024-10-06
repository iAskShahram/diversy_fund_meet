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
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const AddUser = () => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [groupIDs, setGroupIDs] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    affiliateLink: "",
  });

  const utils = api.useUtils();
  const { data: groups, isPending } = api.group.getAll.useQuery(
    {
      perPage: 100,
      page: 1,
    },
    {
      enabled: isDialogOpen,
    },
  );
  const { mutate, isPending: isCreating } = api.user.create.useMutation({
    onSuccess: async () => {
      await utils.user.getAll.invalidate();
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      name: formData.name,
      email: formData.email,
      groupIDs,
      affiliateLink: formData.affiliateLink,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={(open) => setIsDialogOpen(open)}
    >
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
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
                  placeholder="Name"
                  required
                  onChange={handleChange}
                  value={formData.name}
                  disabled={isPending || isCreating}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  value={formData.email}
                  disabled={isPending || isCreating}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="affiliateLink">Affiliate Link</Label>
                <Input
                  id="affiliateLink"
                  name="affiliateLink"
                  type="text"
                  placeholder="Affiliate Link"
                  required
                  onChange={handleChange}
                  value={formData.affiliateLink}
                  disabled={isPending || isCreating}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="groups">Add Groups</Label>
                {isPending ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <MultiSelect
                    id="groups"
                    options={
                      groups?.groups.map(
                        (group) =>
                          ({
                            label: group.name ?? "",
                            value: group.id,
                          }) satisfies Option,
                      ) ?? []
                    }
                    onValueChange={setGroupIDs}
                    defaultValue={groupIDs}
                    placeholder="Select groups"
                    variant="inverted"
                    modalPopover={true}
                    disabled={isPending || isCreating}
                  />
                )}
              </div>
            </div>
          </div>
          <AlertDialogFooter className="mt-6 flex !justify-between">
            <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
            <Button className="w-auto" disabled={isPending || isCreating}>
              Save
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
