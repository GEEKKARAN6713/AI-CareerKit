"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { ResumeWithRelations } from "@/types/resume";
import { updateResumeDetails } from "@/lib/actions/resumes";
import { resumeDetailsSchema, type ResumeDetailsValues } from "@/lib/validations/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function DetailsForm({ resume }: { resume: ResumeWithRelations }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResumeDetailsValues>({
    resolver: zodResolver(resumeDetailsSchema),
    defaultValues: {
      title: resume.title,
      fullName: resume.fullName ?? "",
      email: resume.email ?? "",
      phone: resume.phone ?? "",
      location: resume.location ?? "",
      website: resume.website ?? "",
      summary: resume.summary ?? "",
    },
  });

  async function onSubmit(values: ResumeDetailsValues) {
    try {
      await updateResumeDetails(resume.id, values);
      toast.success("Details saved");
      router.refresh();
    } catch {
      toast.error("Could not save details. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="title">Resume title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" {...register("fullName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="City, Country" {...register("location")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website / GitHub</Label>
        <Input id="website" placeholder="https://..." {...register("website")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="summary">Professional summary</Label>
        <Textarea
          id="summary"
          rows={4}
          placeholder="A short paragraph highlighting your experience and strengths"
          {...register("summary")}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Save details
      </Button>
    </form>
  );
}
