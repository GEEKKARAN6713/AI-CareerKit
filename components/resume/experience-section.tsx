"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Pencil, Sparkles, Trash2 } from "lucide-react";
import type { ResumeWithRelations } from "@/types/resume";
import { aiGenerate } from "@/lib/ai/client";
import { upsertExperience, deleteExperience } from "@/lib/actions/resumes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Form-level schema: bullets are edited as one-per-line text
const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  bulletsText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const emptyValues: FormValues = {
  role: "",
  company: "",
  startDate: "",
  endDate: "",
  current: false,
  bulletsText: "",
};

export function ExperienceSection({ resume }: { resume: ResumeWithRelations }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const [aiLoading, setAiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: emptyValues });

  async function generateBullets() {
    const role = getValues("role");
    const company = getValues("company");
    const description = getValues("bulletsText") ?? "";

    if (!role || description.trim().length < 10) {
      toast.error("Fill in the role and add some rough notes in the bullets field first.");
      return;
    }

    setAiLoading(true);
    try {
      const output = await aiGenerate<string>({
        type: "bullets",
        role,
        company: company || undefined,
        description,
      });
      setValue("bulletsText", output);
      toast.success("Bullets generated — review and edit before saving.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI generation failed.");
    } finally {
      setAiLoading(false);
    }
  }

  function startEdit(id: string) {
    const exp = resume.experiences.find((e) => e.id === id);
    if (!exp) return;
    setEditingId(id);
    reset({
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate ?? "",
      current: exp.current,
      bulletsText: exp.bullets.join("\n"),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(emptyValues);
  }

  async function onSubmit(values: FormValues) {
    const bullets = (values.bulletsText ?? "")
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

    try {
      await upsertExperience(resume.id, {
        id: editingId ?? undefined,
        role: values.role,
        company: values.company,
        startDate: values.startDate,
        endDate: values.endDate ?? "",
        current: values.current,
        bullets,
      });
      toast.success(editingId ? "Experience updated" : "Experience added");
      cancelEdit();
      router.refresh();
    } catch {
      toast.error("Could not save experience.");
    }
  }

  function onDelete(id: string) {
    startDelete(async () => {
      try {
        await deleteExperience(resume.id, id);
        if (editingId === id) cancelEdit();
        toast.success("Experience removed");
        router.refresh();
      } catch {
        toast.error("Could not delete experience.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {resume.experiences.length > 0 && (
        <ul className="space-y-2">
          {resume.experiences.map((exp) => (
            <li
              key={exp.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {exp.role} · {exp.company}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate || "—"} ·{" "}
                  {exp.bullets.length} bullets
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(exp.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  onClick={() => onDelete(exp.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-4" noValidate>
        <p className="text-sm font-medium">
          {editingId ? "Edit experience" : "Add experience"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="Software Engineer" {...register("role")} />
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Acme Inc." {...register("company")} />
            {errors.company && (
              <p className="text-xs text-destructive">{errors.company.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input id="startDate" placeholder="Jan 2024" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-xs text-destructive">{errors.startDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End date</Label>
            <Input id="endDate" placeholder="Present" {...register("endDate")} />
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" {...register("current")} /> I currently work here
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bulletsText">Bullet points (one per line)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={aiLoading}
              onClick={generateBullets}
            >
              {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate with AI
            </Button>
          </div>
          <Textarea
            id="bulletsText"
            rows={5}
            placeholder={"Shipped feature X that...\nReduced load time by..."}
            {...register("bulletsText")}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {editingId ? "Update experience" : "Add experience"}
          </Button>
          {editingId && (
            <Button type="button" variant="ghost" onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
