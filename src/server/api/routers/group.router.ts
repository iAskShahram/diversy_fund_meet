import { paginationQuerySchema } from "@/lib/validators/common.validator";
import {
  createGroupSchema,
  deleteGroupSchema,
  getGroupUsersSchema,
  updateGroupSchema,
} from "@/lib/validators/group.validator";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { isAdmin } from "@/utils/auth.util";

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

  getAll: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ ctx, input }) => {
      const { perPage, page } = input;
      const where = !isAdmin(ctx.session)
        ? {
            users: {
              some: {
                id: ctx.session.user.id,
              },
            },
          }
        : {};

      const totalCount = ctx.db.group.count({ where });

      const groups = await ctx.db.group.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          _count: {
            select: { users: true },
          },
          users: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        where,
      });

      const groupsWithCount = groups.map((group) => {
        return {
          ...group,
          usersCount: group._count.users,
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

  delete: adminProcedure
    .input(deleteGroupSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.db.$transaction(async (tx) => {
        await tx.event.deleteMany({
          where: {
            groups: {
              some: {
                id,
              },
            },
          },
        });
        await tx.group.delete({
          where: { id },
        });
      });

      return true;
    }),
});
