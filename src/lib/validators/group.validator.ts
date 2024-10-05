import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1),
  userIDs: z.array(z.string()).optional(),
});

export const paginationQuerySchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(10),
});
