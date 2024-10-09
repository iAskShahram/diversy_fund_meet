import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().nullish(),
    avatar: z.string().nullish(),
  })
  .refine((data) => !data.name && !data.avatar, {
    message: "At least one of 'name' or 'avatar' must be provided",
  });

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  affiliateLink: z.string(),
  groupIDs: z.array(z.string()).optional(),
});
