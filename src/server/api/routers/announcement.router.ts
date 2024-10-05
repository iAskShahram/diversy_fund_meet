import { createAnnouncementSchema } from "@/lib/validators/announcement.validator";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

export const announcementRouter = createTRPCRouter({
  create: adminProcedure
    .input(createAnnouncementSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, url } = input;
      const announcement = await ctx.db.announcement.create({
        data: {
          title,
          url,
          createdById: ctx.session.user.id,
        },
      });
      return announcement;
    }),
});
