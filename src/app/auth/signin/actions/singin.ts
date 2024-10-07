"use server";

import { formatZodErrors } from "@/lib/utils";
import { signInSchema } from "@/lib/validators/auth.validator";
import { signIn } from "@/server/auth";

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

    // Fallback for unexpected error types
    return {
      success: false,
      errors: "An unexpected error occurred. Please try again.",
    };
  }
}
