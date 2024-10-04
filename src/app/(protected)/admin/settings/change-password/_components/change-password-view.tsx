"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const ChangePasswordView = () => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log({ form });
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
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="font-semibold">
          Full name
        </Label>
        <Input
          id="new_password"
          name="new_password"
          placeholder="New Password"
          type="password"
          value={form.new_password}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="font-semibold">
          Full name
        </Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          placeholder="Confirm Password"
          type="password"
          value={form.confirm_password}
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-4">
        <Button type="button" onClick={handleSubmit}>
          Update Password
        </Button>
        <Button type="button" variant="outline">
          Forgot Password?
        </Button>
      </div>
    </div>
  );
};
