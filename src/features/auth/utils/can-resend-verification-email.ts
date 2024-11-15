import { differenceInSeconds } from "date-fns";
import { prisma } from "@/lib/prisma";

export const canResendVerificationEmail = async (userId: string) => {
  const databaseCode = await prisma.emailVerificationToken.findFirst({
    where: {
      userId,
    },
  });

  if (!databaseCode) {
    return true;
  }

  console.log(databaseCode);

  const diff = differenceInSeconds(
    new Date(),
    new Date(databaseCode.createdAt)
  );

  console.log(diff);

  return diff > 60;
};
