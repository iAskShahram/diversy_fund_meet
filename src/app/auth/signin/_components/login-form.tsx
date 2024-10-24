"use client";

import { SubmitButton } from "@/app/_components/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInAction } from "../actions/singin";

const initialState = {
  errors: "",
  success: false,
};

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormSchema = z.infer<typeof formSchema>;

export function LoginForm() {
  const [state, formAction] = useFormState(signInAction, initialState);
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      router.push("/", { scroll: false });
    }
  }, [state, router]);
  function onSubmit(values: FormSchema) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formAction(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <SubmitButton txt="Login" />
        </div>
        <p
          role="status"
          className={cn(!!state.errors && "text-sm text-red-500")}
        >
          {!state.success && state.errors.split(".")[0]}
        </p>
      </form>
    </Form>
  );
}
