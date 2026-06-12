import { z } from "zod";

const tone = z.enum(["professional", "friendly", "bold"]);

export const aiRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("bullets"),
    role: z.string().min(1).max(120),
    company: z.string().max(120).optional(),
    description: z.string().min(10, "Add some rough notes first").max(2000),
  }),
  z.object({
    type: z.literal("summary"),
    role: z.string().min(1).max(120),
    experience: z.string().max(3000),
    skills: z.string().max(500),
  }),
  z.object({
    type: z.literal("ats_score"),
    resumeId: z.string().min(1),
  }),
  z.object({
    type: z.literal("linkedin_headline"),
    role: z.string().min(1).max(120),
    skills: z.string().max(500),
    tone,
  }),
  z.object({
    type: z.literal("linkedin_about"),
    role: z.string().min(1).max(120),
    experience: z.string().max(3000),
    skills: z.string().max(500),
    tone,
  }),
  z.object({
    type: z.literal("career_suggestions"),
    background: z.string().min(20, "Tell us a bit more about your background").max(3000),
    interests: z.string().max(500),
    targetRole: z.string().max(120).optional(),
  }),
]);

export type AiRequest = z.infer<typeof aiRequestSchema>;
