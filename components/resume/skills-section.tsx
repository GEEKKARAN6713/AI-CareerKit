"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import type { ResumeWithRelations } from "@/types/resume";
import { addSkill, deleteSkill } from "@/lib/actions/resumes";
import { skillSchema, type SkillValues } from "@/lib/validations/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SkillsSection({ resume }: { resume: ResumeWithRelations }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillValues>({ resolver: zodResolver(skillSchema) });

  async function onSubmit(values: SkillValues) {
    try {
      await addSkill(resume.id, values);
      reset({ name: "" });
      router.refresh();
    } catch {
      toast.error("Could not add skill.");
    }
  }

  function onDelete(id: string) {
    startTransition(async () => {
      await deleteSkill(resume.id, id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {resume.skills.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No skills yet. Add the technologies and strengths you want recruiters to see.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="gap-1 pr-1">
              {skill.name}
              <button
                onClick={() => onDelete(skill.id)}
                disabled={isPending}
                aria-label={`Remove ${skill.name}`}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2" noValidate>
        <div className="flex-1">
          <Input placeholder="e.g. TypeScript" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          Add skill
        </Button>
      </form>
    </div>
  );
}
