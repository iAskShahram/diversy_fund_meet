import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1),
});

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  affiliateLink: z.string(),
  groupIDs: z.array(z.string()).optional(),
});
