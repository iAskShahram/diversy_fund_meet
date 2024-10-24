"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import { updateUserSchema } from "@/lib/validators/user.validator";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, FilePen } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type UpdateUserForm = z.infer<typeof updateUserSchema>;

const defaultValues: UpdateUserForm = {
  name: "",
};

export const ProfileView = () => {
  const router = useRouter();
  const session = useSession();
  const [file, setFile] = useState<File | null>(null);
  const formData = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (session.data?.user.name) {
      formData.reset({ name: session.data.user.name });
    }
  }, [session.data?.user.name, formData]);

  const { mutate: updateUser, isPending } = api.user.update.useMutation({
    onSuccess: async () => {
      toast.success("Profile updated");
      await session.update({
        name: formData.getValues("name"),
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: getAvatarPresignedUrl,
    isPending: isPendingGetAvatarPresignedUrl,
  } = api.aws.getAvatarPresignedUrl.useMutation({
    onSuccess: async ({ key, presignedUrl }) => {
      await uploadImage(key, presignedUrl);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: UpdateUserForm) => {
    if (isPending) return;

    updateUser(data);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      getAvatarPresignedUrl({
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
      });
    }
  };

  const uploadImage = async (key: string, presignedUrl: string) => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    toast.promise(
      (async () => {
        const response = await fetch(presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        if (!response.ok) {
          throw new Error("Failed to upload image");
        }
        const imgUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
        updateUser({ avatar: imgUrl });

        await session.update({
          image: imgUrl,
        });
        router.refresh();
        return response;
      })(),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully",
        error: "Failed to upload image",
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex justify-between">
        <Avatar className="h-24 w-24">
          <AvatarImage src={session.data?.user.image ?? ""} />
          <AvatarFallback className="h-full w-full">
            <Image
              src="https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg"
              alt="avatar"
              width={100}
              height={100}
            />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-center">
          <Input
            disabled={isPendingGetAvatarPresignedUrl || isPending}
            type="file"
            accept="image/*"
            className="hidden"
            id="imageUpload"
            onChange={onFileChange}
            multiple={false}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("imageUpload")?.click()}
          >
            <FilePen className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        </div>
      </div>
      <Form {...formData}>
        <form onSubmit={formData.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-2">
            <FormField
              control={formData.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={session.data?.user.name ?? "John Doe"}
                      {...field}
                      value={field.value ?? ""}
                      defaultValue={session.data?.user.name ?? ""}
                      disabled={isPending || isPendingGetAvatarPresignedUrl}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="font-semibold">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="johndoe@diversyfund.com"
              value={session.data?.user.email}
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="affiliateLink" className="font-semibold">
              Affiliate Link
            </Label>
            <Input
              id="affiliateLink"
              name="affiliateLink"
              placeholder={session.data?.user.affiliateLink}
              value={session.data?.user.affiliateLink}
              disabled
            />
            <div>
              <Button
                type="button"
                variant="outline"
                className="mt-1"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    session.data?.user.affiliateLink ?? "",
                  );
                  toast.success("Link copied to clipboard");
                }}
              >
                Copy Link
                <Copy className="ml-2 h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isPending || isPendingGetAvatarPresignedUrl}
          >
            {isPending ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
