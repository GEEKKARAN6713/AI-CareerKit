import { z } from "zod";

const optionalString = z.string().max(200).optional().or(z.literal(""));

export const resumeDetailsSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  fullName: optionalString,
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: optionalString,
  location: optionalString,
  website: optionalString,
  summary: z.string().max(2000).optional().or(z.literal("")),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().min(1, "Role is required").max(120),
  company: z.string().min(1, "Company is required").max(120),
  startDate: z.string().min(1, "Start date is required").max(30),
  endDate: z.string().max(30).optional().or(z.literal("")),
  current: z.boolean().default(false),
  bullets: z.array(z.string().max(500)).max(10).default([]),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  school: z.string().min(1, "School is required").max(120),
  degree: z.string().min(1, "Degree is required").max(120),
  field: z.string().max(120).optional().or(z.literal("")),
  startYear: z.string().max(10).optional().or(z.literal("")),
  endYear: z.string().max(10).optional().or(z.literal("")),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(40),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required").max(120),
  description: z.string().max(1000).optional().or(z.literal("")),
  url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  tech: z.array(z.string().max(40)).max(15).default([]),
});

export type ResumeDetailsValues = z.infer<typeof resumeDetailsSchema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;
export type EducationValues = z.infer<typeof educationSchema>;
export type SkillValues = z.infer<typeof skillSchema>;
export type ProjectValues = z.infer<typeof projectSchema>;
