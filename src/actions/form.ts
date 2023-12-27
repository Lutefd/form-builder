"use server";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  const session = await getServerAuthSession();
  if (!session) throw new UserNotFoundErr();
  const user = session.user;
  const stats = await db.form.aggregate({
    where: { createdById: user.id },
    _sum: {
      submissions: true,
      visits: true,
    },
  });

  const visits = stats._sum.visits ?? 0;
  const submissions = stats._sum.submissions ?? 0;

  const submissionRate = visits ? (submissions / visits) * 100 : 0;

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}
