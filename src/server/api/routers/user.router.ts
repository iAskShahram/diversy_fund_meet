import { updateUserSchema } from "@/lib/validators/user.validator";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

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

  getAll: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users;
  }),
});
