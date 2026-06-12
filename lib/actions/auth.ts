"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth";

type ActionResult = { success: true } | { success: false; error: string };

export async function registerUser(values: SignUpValues): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.toLowerCase();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await db.user.create({
    data: { name: parsed.data.name, email, password: hashedPassword },
  });

  return { success: true };
}
