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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAnnouncementSchema } from "@/lib/validators/announcement.validator";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type CreatePostForm = z.infer<typeof createAnnouncementSchema>;

const defaultValues: CreatePostForm = {
  title: "",
  url: "",
};

export const CreatePostButton = () => {
  const router = useRouter();
  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues,
    mode: "onChange",
  });
  const { mutate: createAnnouncement, isPending } =
    api.announcement.create.useMutation({
      onSuccess: () => {
        form.reset(defaultValues);
        toast.success("Announcement created successfully");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSubmit = async (data: CreatePostForm) => {
    createAnnouncement(data);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Create Post +</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create new post</AlertDialogTitle>
              <AlertDialogDescription>
                Create new post in one click
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Title"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Url</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Url"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <AlertDialogFooter className="mt-6 flex !justify-between">
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Publishing..." : "Publish"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
