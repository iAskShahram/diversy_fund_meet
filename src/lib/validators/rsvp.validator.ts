import { RsvpStatus } from "@prisma/client";
import { z } from "zod";

export const updateRsvpSchema = z.object({
  id: z.string().cuid({ message: "Invalid RSVP" }).nullable(),
  eventId: z.string().cuid({ message: "Invalid event" }),
  rsvp: z.nativeEnum(RsvpStatus),
});
