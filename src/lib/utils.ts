import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZodErrors(zodError: ZodError): string {
  if (zodError.errors.length > 0) {
    const firstError = zodError.errors[0];
    if (firstError) {
      return `${firstError?.path[0]} - ${firstError?.message}`;
    }
  }
  return "";
}
