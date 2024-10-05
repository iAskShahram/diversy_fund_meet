import { env } from "@/env";
import { hashPassword } from "@/utils/auth.util";
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: env.SUPER_ADMIN_EMAIL },
    update: {},
    create: {
      email: env.SUPER_ADMIN_EMAIL,
      name: "Diversy Fund",
      password: (await hashPassword(env.SUPER_ADMIN_DEFAULT_PASSWORD))
        .hashedPassword,
        affiliateLink: "https://diversyfund.com/signup?affiliate=123456",
      role: Role.SUPER_ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@diversyfund.com" },
    update: {},
    create: {
      email: "user@diversyfund.com",
      name: "Diversy Fund User",
      password: (await hashPassword("123123")).hashedPassword,
      role: Role.USER,
      affiliateLink: "https://diversyfund.com/signup?affiliate=123457",
    },
  });
  console.log("Super admin created");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
