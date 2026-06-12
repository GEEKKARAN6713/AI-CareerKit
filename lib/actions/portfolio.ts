"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  portfolioSchema,
  portfolioProjectSchema,
  type PortfolioValues,
  type PortfolioProjectValues,
} from "@/lib/validations/portfolio";

type ActionResult = { success: true } | { success: false; error: string };

function revalidatePortfolio(slug?: string) {
  revalidatePath("/dashboard/portfolio");
  if (slug) revalidatePath(`/p/${slug}`);
}

export async function upsertPortfolio(values: PortfolioValues): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = portfolioSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  // Slug must be globally unique (it is the public URL)
  const slugTaken = await db.portfolio.findFirst({
    where: { slug: parsed.data.slug, userId: { not: user.id } },
    select: { id: true },
  });
  if (slugTaken) {
    return { success: false, error: "That slug is already taken. Try another one." };
  }

  await db.portfolio.upsert({
    where: { userId: user.id },
    create: { ...parsed.data, userId: user.id },
    update: parsed.data,
  });

  revalidatePortfolio(parsed.data.slug);
  return { success: true };
}

async function getOwnedPortfolio(userId: string) {
  const portfolio = await db.portfolio.findUnique({ where: { userId } });
  if (!portfolio) throw new Error("Portfolio not found");
  return portfolio;
}

export async function upsertPortfolioProject(
  values: PortfolioProjectValues
): Promise<ActionResult> {
  const user = await requireUser();
  const portfolio = await getOwnedPortfolio(user.id);
  const { id, ...data } = portfolioProjectSchema.parse(values);

  if (id) {
    await db.project.update({ where: { id, portfolioId: portfolio.id }, data });
  } else {
    await db.project.create({ data: { ...data, portfolioId: portfolio.id } });
  }

  revalidatePortfolio(portfolio.slug);
  return { success: true };
}

export async function deletePortfolioProject(projectId: string) {
  const user = await requireUser();
  const portfolio = await getOwnedPortfolio(user.id);
  await db.project.delete({ where: { id: projectId, portfolioId: portfolio.id } });
  revalidatePortfolio(portfolio.slug);
}
