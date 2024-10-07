import { z } from "zod";
import { paginationQuerySchema } from "./common.validator";

export enum EventStatus {
  UPCOMING = "upcoming",
  PAST = "past",
};

export const createEventSchema = z.object({
  title: z.string().min(1),
  dateTime: z.date(),
  groups: z.array(z.string()).min(1),
});

export const getAllEventsSchema = z.object({
  status: z
    .enum(Object.values(EventStatus) as [string, ...string[]])
    .nullish()
    .default(EventStatus.UPCOMING),
  ...paginationQuerySchema.shape,
});
