import {
  createGroupSchema,
  paginationQuerySchema,
} from "@/lib/validators/group.validator";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

export const groupRouter = createTRPCRouter({
  create: adminProcedure
    .input(createGroupSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, userIDs } = input;
      const group = await ctx.db.group.create({
        data: {
          name,
          users: {
            connect: userIDs?.map((id) => ({ id })) ?? [],
          },
        },
      });
      return group;
    }),

  getAll: adminProcedure
    .input(paginationQuerySchema)
    .query(async ({ ctx, input }) => {
      const { perPage, page } = input;
      const totalCount = ctx.db.group.count();
      const groups = await ctx.db.group.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          users: {
            select: {
              id: true,
            },
          },
        },
      });

      const groupsWithCount = groups.map((group) => {
        return {
          ...group,
          usersCount: group.users.length,
        };
      });

      return {
        groups: groupsWithCount,
        totalCount: await totalCount,
      };
    }),
});
