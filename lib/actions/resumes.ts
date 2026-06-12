"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  resumeDetailsSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  projectSchema,
  type ResumeDetailsValues,
  type ExperienceValues,
  type EducationValues,
  type SkillValues,
  type ProjectValues,
} from "@/lib/validations/resume";

async function getOwnedResume(resumeId: string, userId: string) {
  const resume = await db.resume.findFirst({ where: { id: resumeId, userId } });
  if (!resume) throw new Error("Resume not found");
  return resume;
}

function revalidateEditor(resumeId: string) {
  revalidatePath(`/dashboard/resumes/${resumeId}`);
  revalidatePath("/dashboard/resumes");
}

export async function createResume() {
  const user = await requireUser();
  const resume = await db.resume.create({
    data: {
      title: "Untitled resume",
      fullName: user.name ?? "",
      email: user.email ?? "",
      userId: user.id,
    },
  });
  redirect(`/dashboard/resumes/${resume.id}`);
}

export async function deleteResume(resumeId: string) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  await db.resume.delete({ where: { id: resumeId } });
  revalidatePath("/dashboard/resumes");
}

export async function updateResumeDetails(resumeId: string, values: ResumeDetailsValues) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  const data = resumeDetailsSchema.parse(values);
  await db.resume.update({ where: { id: resumeId }, data });
  revalidateEditor(resumeId);
  return { success: true as const };
}

export async function upsertExperience(resumeId: string, values: ExperienceValues) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  const { id, ...data } = experienceSchema.parse(values);

  if (id) {
    await db.workExperience.update({ where: { id, resumeId }, data });
  } else {
    await db.workExperience.create({ data: { ...data, resumeId } });
  }
  revalidateEditor(resumeId);
  return { success: true as const };
}

export async function deleteExperience(resumeId: string, experienceId: string) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  await db.workExperience.delete({ where: { id: experienceId, resumeId } });
  revalidateEditor(resumeId);
}

export async function upsertEducation(resumeId: string, values: EducationValues) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  const { id, ...data } = educationSchema.parse(values);

  if (id) {
    await db.education.update({ where: { id, resumeId }, data });
  } else {
    await db.education.create({ data: { ...data, resumeId } });
  }
  revalidateEditor(resumeId);
  return { success: true as const };
}

export async function deleteEducation(resumeId: string, educationId: string) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  await db.education.delete({ where: { id: educationId, resumeId } });
  revalidateEditor(resumeId);
}

export async function addSkill(resumeId: string, values: SkillValues) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  const data = skillSchema.parse(values);
  await db.skill.create({ data: { ...data, resumeId } });
  revalidateEditor(resumeId);
  return { success: true as const };
}

export async function deleteSkill(resumeId: string, skillId: string) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  await db.skill.delete({ where: { id: skillId, resumeId } });
  revalidateEditor(resumeId);
}

export async function upsertResumeProject(resumeId: string, values: ProjectValues) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  const { id, ...data } = projectSchema.parse(values);

  if (id) {
    await db.project.update({ where: { id, resumeId }, data });
  } else {
    await db.project.create({ data: { ...data, resumeId } });
  }
  revalidateEditor(resumeId);
  return { success: true as const };
}

export async function deleteResumeProject(resumeId: string, projectId: string) {
  const user = await requireUser();
  await getOwnedResume(resumeId, user.id);
  await db.project.delete({ where: { id: projectId, resumeId } });
  revalidateEditor(resumeId);
}
