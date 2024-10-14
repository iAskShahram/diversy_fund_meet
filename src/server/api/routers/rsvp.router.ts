import { updateRsvpSchema } from "@/lib/validators/rsvp.validator";
import { createTRPCRouter, userProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const rsvpRouter = createTRPCRouter({
  update: userProcedure
    .input(updateRsvpSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, rsvp, eventId } = input;

      // check if event is valid and user is in the group of the event
      const event = await ctx.db.event.findUnique({
        where: { id: eventId },
        select: {
          groups: {
            select: {
              users: {
                where: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        },
      });
      if (
        !event ||
        event.groups.length === 0 ||
        event.groups[0]!.users.length === 0
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User is not in the group associated with this event",
        });
      }

      // by default there is no rsvp in the model agaisnt the user and user has RSVP of NO by default.
      // if the user has RSVPed to the event, we update the rsvp status or else we create a new rsvp record.
      const _rsvp = await ctx.db.rsvp.upsert({
        where: { id: id ?? 'undefined' },
        update: { rsvp },
        create: { userId: ctx.session.user.id, rsvp, eventId },
      });

      return _rsvp;
    }),
});
