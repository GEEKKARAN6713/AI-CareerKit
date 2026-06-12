"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { ResumeWithRelations } from "@/types/resume";
import { upsertResumeProject, deleteResumeProject } from "@/lib/actions/resumes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  techText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const emptyValues: FormValues = { name: "", description: "", url: "", techText: "" };

export function ProjectsSection({ resume }: { resume: ResumeWithRelations }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: emptyValues });

  function startEdit(id: string) {
    const project = resume.projects.find((p) => p.id === id);
    if (!project) return;
    setEditingId(id);
    reset({
      name: project.name,
      description: project.description ?? "",
      url: project.url ?? "",
      techText: project.tech.join(", "),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(emptyValues);
  }

  async function onSubmit(values: FormValues) {
    const tech = (values.techText ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await upsertResumeProject(resume.id, {
        id: editingId ?? undefined,
        name: values.name,
        description: values.description ?? "",
        url: values.url ?? "",
        tech,
      });
      toast.success(editingId ? "Project updated" : "Project added");
      cancelEdit();
      router.refresh();
    } catch {
      toast.error("Could not save project.");
    }
  }

  function onDelete(id: string) {
    startDelete(async () => {
      await deleteResumeProject(resume.id, id);
      if (editingId === id) cancelEdit();
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {resume.projects.length > 0 && (
        <ul className="space-y-2">
          {resume.projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-xs text-muted-foreground">
                  {project.tech.join(" · ") || "No tech listed"}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(project.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  onClick={() => onDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-4" noValidate>
        <p className="text-sm font-medium">{editingId ? "Edit project" : "Add project"}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="AI CareerKit" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" placeholder="https://github.com/..." {...register("url")} />
            {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="techText">Tech stack (comma separated)</Label>
          <Input id="techText" placeholder="Next.js, Prisma, PostgreSQL" {...register("techText")} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {editingId ? "Update project" : "Add project"}
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
