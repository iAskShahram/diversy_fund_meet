import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { isAdmin } from "@/utils/auth.util";
import { RsvpStatus, type Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";

export const genralRouter = createTRPCRouter({
  indexMeta: protectedProcedure.query(async ({ ctx }) => {
    const isUser = !isAdmin(ctx.session);

    // Get the start and end of the current month
    const _now = new Date();
    const _startOfMonth = startOfMonth(new Date());
    const _endOfMonth = endOfMonth(new Date());

    // Following are this thing that we neec to return:
    /**
     * - Proposed events this month
     * - Upcomming events this month
     * - RSVP Pending of events this month
     * - count of total users
     */

    const proposedEventsQuery: Prisma.EventCountArgs = {
      where: {
        dateTime: {
          gte: _startOfMonth,
          lte: _endOfMonth,
        },
        // Filter by user groups if necessary
        ...(isUser && {
          groups: {
            some: {
              users: {
                some: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        }),
      },
    };
    const proposedEvents = ctx.db.event.count(proposedEventsQuery);

    const upcomingEventsQuery: Prisma.EventCountArgs = {
      ...proposedEventsQuery,
      where: {
        ...proposedEventsQuery.where,
        dateTime: {
          gte: _now,
          lte: _endOfMonth,
        },
      },
    };
    const upcomingEvents = ctx.db.event.count(upcomingEventsQuery);

    const rsvpPending = ctx.db.event.count({
      where: {
        dateTime: {
          gte: _now,
          lte: _endOfMonth,
        },
        rsvps: {
          some: {
            userId: ctx.session.user.id,
            rsvp: RsvpStatus.NO,
          },
        },
      },
    });

    const totalUsers = ctx.db.user.count();
    return {
      proposedEvents: await proposedEvents,
      upcomingEvents: await upcomingEvents,
      rsvpPending: await rsvpPending,
      totalUsers: await totalUsers,
    };
  }),
});
