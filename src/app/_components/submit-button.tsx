"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export const SubmitButton = ({
  txt,
  className
}: {
  txt: string;
  className?: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className={cn("w-full", className)}
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Loading..." : txt}
    </Button>
  );
};
