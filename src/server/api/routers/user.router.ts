import { paginationQuerySchema } from "@/lib/validators/common.validator";
import {
  createUserSchema,
  updateUserSchema,
} from "@/lib/validators/user.validator";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { hashPassword } from "@/utils/auth.util";
import { sendSignUpEmail } from "@/utils/mailer";
import createHttpError from "http-errors";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }),

  getAll: adminProcedure
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
      const users = await ctx.db.user.findMany(queryObj);
      return { users, totalCount: await totalCount };
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
});
