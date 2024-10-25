"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema } from "@/lib/validators/auth.validator";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UpdatePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const defaultValues: UpdatePasswordForm = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const updatePasswordSchema = changePasswordSchema
  .extend({
    confirm_password: z.string().min(6),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "New password and confirm password must match",
    path: ["confirm_password"],
  });

export const ChangePasswordView = () => {
  const formData = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues,
    mode: "onChange",
  });

  const { mutate: changePassword, isPending } =
    api.auth.changePassword.useMutation({
      onSuccess: () => {
        toast.success("Password updated successfully");
        formData.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSubmit = async (data: UpdatePasswordForm) => {
    changePassword({
      current_password: data.current_password,
      new_password: data.new_password,
    });
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <Form {...formData}>
        <form onSubmit={formData.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-2">
            <FormField
              control={formData.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="current_password" className="font-semibold">
                    Current Password
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Current Password"
                      type="password"
                      value={field.value}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormField
              control={formData.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="new_password" className="font-semibold">
                    New Password
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="New Password"
                      type="password"
                      value={field.value}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormField
              control={formData.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirm_password" className="font-semibold">
                    Confirm New Password
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Confirm Password"
                      type="password"
                      value={field.value}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              Update Password
            </Button>
            <Button type="button" variant="outline" disabled={isPending}>
              Forgot Password?
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
