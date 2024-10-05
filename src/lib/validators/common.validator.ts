import { z } from "zod";

export const paginationQuerySchema = z.object({
  perPage: z.number().optional(),
  pageNo: z.number().optional(),
});
