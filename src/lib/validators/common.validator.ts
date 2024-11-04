import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(200).default(10),
});
