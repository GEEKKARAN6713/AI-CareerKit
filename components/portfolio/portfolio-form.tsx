"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Portfolio } from "@prisma/client";
import { upsertPortfolio } from "@/lib/actions/portfolio";
import { portfolioThemes } from "@/lib/validations/portfolio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  displayName: z.string().min(1, "Display name is required").max(80),
  tagline: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  skillsText: z.string().optional(),
  github: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  websiteUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const themeLabels: Record<(typeof portfolioThemes)[number], string> = {
  minimal: "Minimal",
  gradient: "Gradient",
  midnight: "Midnight",
};

const themeSwatches: Record<(typeof portfolioThemes)[number], string> = {
  minimal: "bg-white border",
  gradient: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
  midnight: "bg-zinc-900",
};

export function PortfolioForm({
  portfolio,
  defaultName,
}: {
  portfolio: Portfolio | null;
  defaultName: string;
}) {
  const router = useRouter();
  const [theme, setTheme] = useState<(typeof portfolioThemes)[number]>(
    (portfolio?.theme as (typeof portfolioThemes)[number]) ?? "minimal"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: portfolio?.slug ?? "",
      displayName: portfolio?.displayName ?? defaultName,
      tagline: portfolio?.tagline ?? "",
      bio: portfolio?.bio ?? "",
      skillsText: portfolio?.skills.join(", ") ?? "",
      github: portfolio?.github ?? "",
      linkedin: portfolio?.linkedin ?? "",
      twitter: portfolio?.twitter ?? "",
      websiteUrl: portfolio?.websiteUrl ?? "",
      published: portfolio?.published ?? true,
    },
  });

  async function onSubmit(values: FormValues) {
    const skills = (values.skillsText ?? "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const result = await upsertPortfolio({
      slug: values.slug,
      displayName: values.displayName,
      tagline: values.tagline ?? "",
      bio: values.bio ?? "",
      skills,
      github: values.github ?? "",
      linkedin: values.linkedin ?? "",
      twitter: values.twitter ?? "",
      websiteUrl: values.websiteUrl ?? "",
      theme,
      published: values.published,
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Portfolio saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input id="displayName" {...register("displayName")} />
          {errors.displayName && (
            <p className="text-xs text-destructive">{errors.displayName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL slug</Label>
          <Input id="slug" placeholder="jane-doe" {...register("slug")} />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          placeholder="Full Stack Developer · React & Node.js"
          {...register("tagline")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={4} placeholder="Tell visitors about yourself" {...register("bio")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skillsText">Skills (comma separated)</Label>
        <Input id="skillsText" placeholder="TypeScript, Next.js, PostgreSQL" {...register("skillsText")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input id="github" placeholder="https://github.com/..." {...register("github")} />
          {errors.github && <p className="text-xs text-destructive">{errors.github.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
          {errors.linkedin && (
            <p className="text-xs text-destructive">{errors.linkedin.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">X / Twitter</Label>
          <Input id="twitter" placeholder="https://x.com/..." {...register("twitter")} />
          {errors.twitter && (
            <p className="text-xs text-destructive">{errors.twitter.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website</Label>
          <Input id="websiteUrl" placeholder="https://..." {...register("websiteUrl")} />
          {errors.websiteUrl && (
            <p className="text-xs text-destructive">{errors.websiteUrl.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Theme</Label>
        <div className="flex gap-3">
          {portfolioThemes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border p-2 text-xs font-medium transition-colors",
                theme === option ? "border-primary ring-1 ring-primary" : "hover:border-foreground/30"
              )}
            >
              <span className={cn("h-10 w-16 rounded-md", themeSwatches[option])} />
              {themeLabels[option]}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("published")} />
        Publish my portfolio publicly
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Save portfolio
      </Button>
    </form>
  );
}
