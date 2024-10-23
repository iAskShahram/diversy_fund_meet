import { paginationQuerySchema } from "@/lib/validators/common.validator";
import {
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
} from "@/lib/validators/user.validator";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import type { Context } from "@/server/types";
import { hashPassword } from "@/utils/auth.util";
import { sendSignUpEmail } from "@/utils/mailer";
import { Role } from "@prisma/client";
import createHttpError from "http-errors";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, avatar } = input;

      const dataObject: { name?: string; image?: string } = {};
      if (name) dataObject.name = name;
      if (avatar) dataObject.image = avatar;

      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: dataObject,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }),

  getAll: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ ctx, input }) => {
      const { page, perPage } = input;
      const queryObj: { skip?: number; take?: number } = {};
      if (page) {
        queryObj.skip = (page - 1) * perPage;
      }
      if (perPage) {
        queryObj.take = perPage;
      }

      const totalCount = ctx.db.user.count();
      const users = await ctx.db.user.findMany({
        ...queryObj,
        select: {
          id: true,
          name: true,
          email: true,
          affiliateLink: true,
          image: true,
          groups: {
            select: {
              name: true,
            },
          },
        },
      });
      const _users = users.map((user) => ({
        ...user,
        groups: user.groups.map((group) => group.name).join(", "),
      }));
      return { users: _users, totalCount: await totalCount };
    }),

  create: adminProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, email, groupIDs, affiliateLink } = input;
        const randomString = crypto.randomUUID();
        const { hashedPassword } = await hashPassword(randomString);

        const user = await ctx.db.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            affiliateLink,
            groups: {
              connect: groupIDs?.map((id) => ({ id })) ?? [],
            },
          },
        });

        const result = await sendSignUpEmail({
          email,
          password: randomString,
          name,
        });
        if (!result.success) {
          throw createHttpError.InternalServerError(
            "User registered but failed to send email",
          );
        }

        return user;
      } catch (error) {
        console.log(error);
        throw createHttpError.InternalServerError("Failed to create user");
      }
    }),

  delete: adminProcedure
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      await authorizeDeleteUser(ctx, input.id);
      const { id } = input;
      const user = await ctx.db.user.delete({ where: { id } });
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }),
});

async function authorizeDeleteUser(ctx: Context, id: string) {
  if (ctx.session.user.id === id) {
    throw createHttpError.Forbidden("Cannot delete yourself");
  }

  const userToDelete = await ctx.db.user.findUnique({ where: { id } });
  if (!userToDelete) {
    throw createHttpError.NotFound("User not found");
  }

  if (ctx.session.user.role === Role.SUPER_ADMIN) {
    return; // Super admin can delete anyone
  }

  if (userToDelete.role === Role.USER) {
    return; // Admin can delete regular users
  } else {
    throw createHttpError.Forbidden(
      "Admins cannot delete other admins or super admins",
    );
  }
}
