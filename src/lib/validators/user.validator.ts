import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().min(1).nullish(),
    avatar: z.string().min(1).nullish(),
  })
  .refine((data) => data.name !== null || data.avatar !== null, {
    message: "At least one of 'name' or 'avatar' must be provided",
  });

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  affiliateLink: z.string(),
  groupIDs: z.array(z.string()).optional(),
});

export const deleteUserSchema = z.object({
  id: z.string(),
});
