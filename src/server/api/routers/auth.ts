import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { compare } from "bcrypt";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRouter = createTRPCRouter({
  signin: publicProcedure
    .input(signinSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.db.user.findUnique({ where: { email } });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      const passwordMatch = await compare(password, user.email!);
      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }
      return { success: true };
    }),
});
