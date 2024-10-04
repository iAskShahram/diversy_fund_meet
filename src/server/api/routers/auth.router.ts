import {
  changePasswordSchema,
  signInSchema,
} from "@/lib/validators/auth.validator";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { hashPassword, verifyPassword } from "@/utils/auth.util";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  signin: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.db.user.findUnique({ where: { email } });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      const passwordMatch = await verifyPassword(password, user.email);
      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }
      return { success: true };
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { current_password, new_password } = input;
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          password: true,
        },
      });

      const passwordMatch = await verifyPassword(
        current_password,
        user!.password,
      );
      console.log({ passwordMatch });
      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const { hashedPassword } = await hashPassword(new_password);
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { password: hashedPassword },
      });

      return { success: true };
    }),
});
