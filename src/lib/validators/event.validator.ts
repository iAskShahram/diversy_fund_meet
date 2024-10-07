import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1),
  dateTime: z.date(),
  groups: z.array(z.string()).min(1),
});
