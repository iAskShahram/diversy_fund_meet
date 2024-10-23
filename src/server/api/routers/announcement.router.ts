import {
  createAnnouncementSchema,
  deleteAnnouncementSchema,
} from "@/lib/validators/announcement.validator";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const announcementRouter = createTRPCRouter({
  create: adminProcedure
    .input(createAnnouncementSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, url, type } = input;
      const announcement = await ctx.db.announcement.create({
        data: {
          title,
          url,
          type,
          createdById: ctx.session.user.id,
        },
      });
      return announcement;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const announcements = await ctx.db.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return announcements;
  }),

  deleteOne: adminProcedure
    .input(deleteAnnouncementSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.db.announcement.delete({
        where: {
          id,
        },
      });
    }),
});
