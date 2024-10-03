"use client";

import { createPostAction } from "@/app/(protected)/admin/_actions/create-post.action";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
  errors: "",
  success: false,
};

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

export const CreatePostButton = () => {
  const [state, formAction] = useFormState(createPostAction, initialState);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      cancelRef.current?.click();
    }
  }, [state?.success, router]);

  if (!isClient) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Create Post +</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px]">
        <form action={formAction}>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new post</AlertDialogTitle>
            <AlertDialogDescription>
              Create new post in one click
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
                <Label htmlFor="url">Url</Label>
                <Input id="url" name="url" type="text" required />
              </div>
              {/* <SubmitButton txt="Publish" /> */}
            </div>
            <p
              role="status"
              className={cn(!!state?.errors && "text-sm text-red-500")}
            >
              {!state?.success && state?.errors.split(".")[0]}
            </p>
          </div>
          <AlertDialogFooter className="mt-6 flex !justify-between">
            <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
            {/* <AlertDialogAction> */}
            <SubmitButton txt="Publish" className="w-auto" />
            {/* </AlertDialogAction> */}
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
