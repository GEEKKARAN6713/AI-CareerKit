import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ResumeEditor } from "@/components/resume/resume-editor";

export const metadata: Metadata = { title: "Resume editor" };

export default async function ResumeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const resume = await db.resume.findFirst({
    where: { id, userId: user.id },
    include: {
      experiences: { orderBy: { createdAt: "asc" } },
      educations: true,
      skills: true,
      projects: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!resume) notFound();

  return <ResumeEditor resume={resume} />;
}
