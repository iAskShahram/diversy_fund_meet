"use server";

import { signInSchema } from "@/lib/validators/auth";
import { signIn } from "@/server/auth";
import { type ZodError } from "zod";

type State = {
  errors: string;
  success: boolean;
};

export async function signInAction(prevState: State, formData: FormData) {
  try {
    const validatedFields = await signInSchema.safeParseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!validatedFields.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedFields.error),
      };
    }

    const { email, password } = validatedFields.data;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return {
      success: true,
      errors: "",
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        errors: err.message,
      };
    }
    // Handle ZodError or other structured errors
    if (err && typeof err === "object" && "errors" in err) {
      const errors = err.errors as { message: string }[];
      const passwordErrors = errors.filter((e) =>
        e.message.toLowerCase().includes("password"),
      );
      const otherErrors = errors.filter(
        (e) => !e.message.toLowerCase().includes("password"),
      );

      let errorMessage = otherErrors.map((e) => e.message).join(", ");
      if (passwordErrors.length > 0) {
        errorMessage += (errorMessage ? " " : "") + "Password is incorrect.";
      }

      return {
        success: false,
        errors: errorMessage,
      };
    }
    // Fallback for unexpected error types
    return {
      success: false,
      errors: "An unexpected error occurred. Please try again.",
    };
  }
}

function formatZodErrors(zodError: ZodError): string {
  if (zodError.errors.length > 0) {
    const firstError = zodError.errors[0];
    if (firstError) {
      return `${firstError?.path[0]} - ${firstError?.message}`;
    }
  }
  return "";
}
