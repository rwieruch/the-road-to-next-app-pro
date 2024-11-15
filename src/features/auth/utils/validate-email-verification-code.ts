import { prisma } from "@/lib/prisma";

export const validateEmailVerificationCode = async (
  userId: string,
  email: string,
  code: string
) => {
  const emailVerificationToken = await prisma.emailVerificationToken.findFirst({
    where: {
      userId,
    },
  });

  if (!emailVerificationToken || emailVerificationToken.code !== code) {
    return false;
  }

  await prisma.emailVerificationToken.delete({
    where: {
      id: emailVerificationToken.id,
    },
  });

  const isExpired = Date.now() > emailVerificationToken.expiresAt.getTime();
  if (isExpired) {
    return false;
  }

  if (emailVerificationToken.email !== email) {
    return false;
  }

  return true;
};
