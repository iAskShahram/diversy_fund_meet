import { paginationQuerySchema } from "@/lib/validators/common.validator";
import {
  createGroupSchema,
  getGroupUsersSchema,
  updateGroupSchema,
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

  getUsers: adminProcedure
    .input(getGroupUsersSchema)
    .query(async ({ ctx, input }) => {
      const { groupId } = input;
      const groupUsers = await ctx.db.group.findUnique({
        where: { id: groupId },
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      const userIds = groupUsers?.users.map((user) => user.id) ?? [];
      const notGroupUsers = await ctx.db.user.findMany({
        where: {
          id: {
            notIn: userIds,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      return {
        groupUsers,
        notGroupUsers,
      };
    }),

  update: adminProcedure
    .input(updateGroupSchema)
    .mutation(async ({ ctx, input }) => {
      const { groupId, name, userIDs } = input;
      const group = await ctx.db.group.update({
        where: { id: groupId },
        data: {
          name,
          users: {
            set: userIDs?.map((id) => ({ id })) ?? [],
          },
        },
      });
      return group;
    }),
});
