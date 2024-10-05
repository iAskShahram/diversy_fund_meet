import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
});
