import { z } from "zod";

const optionalUrl = z.string().url("Enter a valid URL").optional().or(z.literal(""));

export const portfolioThemes = ["minimal", "gradient", "midnight"] as const;

export const portfolioSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  displayName: z.string().min(1, "Display name is required").max(80),
  tagline: z.string().max(120).optional().or(z.literal("")),
  bio: z.string().max(2000).optional().or(z.literal("")),
  skills: z.array(z.string().max(40)).max(20).default([]),
  github: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  websiteUrl: optionalUrl,
  theme: z.enum(portfolioThemes),
  published: z.boolean().default(true),
});

export const portfolioProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required").max(120),
  description: z.string().max(1000).optional().or(z.literal("")),
  url: optionalUrl,
  tech: z.array(z.string().max(40)).max(15).default([]),
});

export type PortfolioValues = z.infer<typeof portfolioSchema>;
export type PortfolioProjectValues = z.infer<typeof portfolioProjectSchema>;
