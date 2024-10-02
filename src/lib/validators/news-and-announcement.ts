import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  url: z.string().min(3, { message: "URL must be at least 3 characters" }),
});
