"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema } from "@/lib/validators/auth.validator";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

const intitialState = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

export const ChangePasswordView = () => {
  const { mutate: changePassword, isPending } =
    api.auth.changePassword.useMutation({
      onSuccess: () => {
        toast.success("Password updated successfully");
        setForm(intitialState);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const [form, setForm] = useState(intitialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const isValid = await changePasswordSchema.safeParseAsync(form);
    if (!isValid.success) {
      toast.error(isValid.error.errors[0]?.message ?? "Something went wrong");
      return;
    }
    if (form.new_password !== form.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    changePassword(form);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="font-semibold">
          Current Password
        </Label>
        <Input
          id="current_password"
          name="current_password"
          placeholder="Current Password"
          type="password"
          value={form.current_password}
          onChange={handleChange}
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="new_password" className="font-semibold">
          New Password
        </Label>
        <Input
          id="new_password"
          name="new_password"
          placeholder="New Password"
          type="password"
          value={form.new_password}
          onChange={handleChange}
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm_password" className="font-semibold">
          Confirm New Password
        </Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          placeholder="Confirm Password"
          type="password"
          value={form.confirm_password}
          onChange={handleChange}
          disabled={isPending}
        />
      </div>
      <div className="flex gap-4">
        <Button type="button" onClick={handleSubmit} disabled={isPending}>
          Update Password
        </Button>
        <Button type="button" variant="outline" disabled={isPending}>
          Forgot Password?
        </Button>
      </div>
    </div>
  );
};
