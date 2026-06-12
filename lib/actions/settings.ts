"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  headline: z.string().max(120).optional().or(z.literal("")),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export async function updateProfile(values: ProfileValues) {
  const user = await requireUser();
  const data = profileSchema.parse(values);
  await db.user.update({ where: { id: user.id }, data });
  revalidatePath("/dashboard/settings");
  return { success: true as const };
}
