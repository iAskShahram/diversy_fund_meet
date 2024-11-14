import { env } from "@/env";
import {
  createEventSchema,
  deleteEventSchema,
  EventStatus,
  getAllEventsSchema,
} from "@/lib/validators/event.validator";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { isAdmin } from "@/utils/auth.util";
import { type Prisma, Role, RsvpStatus } from "@prisma/client";
import { google } from "googleapis";
import createHttpError from "http-errors";

const G_CLIENT_ID = env.G_CLIENT_ID;
const G_CLIENT_SECRET = env.G_CLIENT_SECRET;
const G_REDIRECT_URI = env.G_REDIRECT_URI;
const G_REFRESH_TOKEN = env.G_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  G_CLIENT_ID,
  G_CLIENT_SECRET,
  G_REDIRECT_URI,
);
oAuth2Client.setCredentials({
  refresh_token: G_REFRESH_TOKEN,
});
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

export const eventRouter = createTRPCRouter({
  create: adminProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, dateTime, groups } = input;

      const attendeeEmails = await ctx.db.user.findMany({
        where: {
          role: Role.USER,
          groups: {
            some: {
              id: {
                in: groups.map((id) => id),
              },
            },
          },
        },
        select: {
          email: true,
          id: true,
        },
      });
      if (!attendeeEmails.length) {
        throw createHttpError.BadRequest(
          "No attendees found in selected groups",
        );
      }

      const { success, meetLink } = await createGoogleMeet({
        startDateTimeUTC: dateTime,
        title,
        attendeeEmails: attendeeEmails.map((user) => user.email),
      });
      if (!success) {
        throw createHttpError.InternalServerError(
          "Failed to create Google Meet",
        );
      }

      const event = await ctx.db.event.create({
        data: {
          title,
          dateTime,
          googleMeetLink: meetLink,
          groups: {
            connect: groups.map((id) => ({ id })),
          },
          rsvps: {
            createMany: {
              skipDuplicates: true,
              data: attendeeEmails.map((user) => ({
                userId: user.id,
                rsvp: RsvpStatus.NO,
              })),
            },
          },
        },
      });

      return event;
    }),

  getAll: protectedProcedure
    .input(getAllEventsSchema)
    .query(async ({ ctx, input }) => {
      const { perPage, page, status } = input;

      const queryObj: {
        dateTime?: {
          gte?: Date;
          lte?: Date;
        };
        groups?: {
          some: {
            users: {
              some: {
                id: string;
              };
            };
          };
        };
      } = {};

      if (!isAdmin(ctx.session)) {
        queryObj.groups = {
          some: {
            users: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
        };
      }

      if (status === EventStatus.UPCOMING) {
        queryObj.dateTime = {
          gte: new Date(),
        };
      } else if (status === EventStatus.PAST) {
        queryObj.dateTime = {
          lte: new Date(),
        };
      }

      const selectObj: Prisma.EventSelect = {
        id: true,
        title: true,
        googleMeetLink: true,
        dateTime: true,
        description: true,
        createdAt: true,
        rsvps: {
          select: {
            id: true,
            rsvp: true,
            userId: true,
          },
        },
        groups: {
          select: {
            name: true,
          },
        },
      };

      if (!isAdmin(ctx.session)) {
        selectObj.rsvps = {
          ...(selectObj.rsvps as object),
          where: {
            userId: ctx.session.user.id,
          },
        };
      }

      if (isAdmin(ctx.session)) {
        selectObj.rsvps = {
          ...(selectObj.rsvps as object),
          select: {
            ...(typeof selectObj.rsvps === "object" && selectObj.rsvps.select
              ? selectObj.rsvps.select
              : {}),
            user: {
              select: {
                image: true,
                name: true,
              },
            },
          },
        };
      }

      const events = await ctx.db.event.findMany({
        where: queryObj,
        select: selectObj,
        skip: (page - 1) * perPage,
        take: perPage,
      });

      const _events: {
        groups: string;
        rsvp: RsvpStatus;
        id: string;
        title: string;
        googleMeetLink: string;
        dateTime: Date;
        rsvps: {
          id: string;
          rsvp: RsvpStatus;
          eventId: string;
          createdAt: Date;
          updatedAt: Date;
          userId: string;
          user?: {
            image: string;
            name: string;
          };
        }[];
        description: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
          rsvps: number;
        };
      }[] = events.map((event) => ({
        ...event,
        groups: event.groups.map((group) => group.name).join(", "),
        rsvp: event.rsvps[0]?.rsvp ?? RsvpStatus.NO,
      }));

      const totalCount = await ctx.db.event.count({
        where: queryObj,
      });
      return { events: _events, totalCount };
    }),

  getLastFour: protectedProcedure.query(async ({ ctx }) => {
    const _isAdmin = isAdmin(ctx.session);
    const events = await ctx.db.event.findMany({
      orderBy: {
        dateTime: "desc",
      },
      take: 4,
      select: {
        id: true,
        title: true,
        dateTime: true,
        ...(!_isAdmin && {
          googleMeetLink: true,
          rsvps: {
            select: {
              id: true,
              rsvp: true,
              userId: true,
            },
            where: {
              userId: ctx.session.user.id,
            },
          },
        }),
        groups: {
          select: {
            name: true,
          },
        },
      },
      where: {
        dateTime: {
          gte: new Date(),
        },
        ...(!_isAdmin && {
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
    });
    return events;
  }),

  delete: adminProcedure
    .input(deleteEventSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const event = await ctx.db.event.findUnique({ where: { id } });
      if (!event) {
        throw createHttpError.BadRequest("Invalid event");
      }

      if (event.dateTime < new Date()) {
        throw createHttpError.BadRequest("Event already happened");
      }

      await ctx.db.event.delete({ where: { id } });
      return { success: true };
    }),
});

export async function createGoogleMeet({
  startDateTimeUTC,
  title,
  attendeeEmails,
}: {
  startDateTimeUTC: Date;
  title: string;
  attendeeEmails: string[];
}): Promise<
  { success: true; meetLink: string } | { success: false; meetLink: null }
> {
  const event = {
    summary: title,
    start: {
      dateTime: startDateTimeUTC.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: new Date(
        startDateTimeUTC.getTime() + 60 * 60 * 1000,
      ).toISOString(),
      timeZone: "UTC",
    },
    attendees: attendeeEmails.map((email) => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: `meet_${new Date().getTime()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    if (response.data.hangoutLink) {
      return {
        success: true,
        meetLink: response.data.hangoutLink,
      };
    } else {
      return {
        success: false,
        meetLink: null,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      meetLink: null,
    };
  }
}
