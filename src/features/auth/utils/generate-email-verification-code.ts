import { prisma } from "@/lib/prisma";
import { generateRandomCode } from "@/utils/crypto";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string
) => {
  await prisma.emailVerificationToken.deleteMany({
    where: {
      userId,
    },
  });

  const code = generateRandomCode();

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      email,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  return code;
};
