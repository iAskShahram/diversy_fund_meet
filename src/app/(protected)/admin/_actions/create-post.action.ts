"use server";

import { formatZodErrors } from "@/lib/utils";
import { createPostSchema } from "@/lib/validators/news-and-announcement";

type State = {
  errors: string;
  success: boolean;
};

export async function createPostAction(prevState: State, formData: FormData) {
  const title = formData.get("title");
  const url = formData.get("url");

  const values = await createPostSchema.safeParseAsync({
    title,
    url,
  });

  if (!values.success) {
    return {
      success: false,
      errors: formatZodErrors(values.error),
    };
  }

  return {
    success: true,
    errors: "",
  };
}
