"use client";

import { SubmitButton } from "@/app/_components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { signInAction } from "../actions/singin";

const initialState = {
  errors: "",
  success: false,
};

export function LoginForm() {
  const [state, formAction] = useFormState(signInAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/", { scroll: false });
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <SubmitButton txt="Login" />
      </div>
      <p role="status" className={cn(!!state.errors && "text-sm text-red-500")}>
        {!state.success && state.errors.split(".")[0]}
      </p>
    </form>
  );
}
