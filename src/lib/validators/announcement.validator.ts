import { AnnouncementType } from "@prisma/client";
import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  type: z.nativeEnum(AnnouncementType),
});

export const deleteAnnouncementSchema = z.object({
  id: z.string(),
});
