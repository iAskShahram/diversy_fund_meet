import { env } from "@/env";
import { createEventSchema } from "@/lib/validators/event.validator";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { Role } from "@prisma/client";
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
        },
      });

      return event;
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
}): Promise<{ success: boolean; meetLink: string | null }> {
  const event = {
    summary: title,
    start: {
      dateTime: startDateTimeUTC.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: new Date(startDateTimeUTC.getTime() + 60 * 60 * 1000).toISOString(),
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
