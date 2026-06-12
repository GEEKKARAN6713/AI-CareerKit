"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@prisma/client";
import { upsertPortfolioProject, deletePortfolioProject } from "@/lib/actions/portfolio";
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

export function PortfolioProjects({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: emptyValues });

  function startEdit(project: Project) {
    setEditingId(project.id);
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

    const result = await upsertPortfolioProject({
      id: editingId ?? undefined,
      name: values.name,
      description: values.description ?? "",
      url: values.url ?? "",
      tech,
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(editingId ? "Project updated" : "Project added");
    cancelEdit();
    router.refresh();
  }

  function onDelete(id: string) {
    startDelete(async () => {
      await deletePortfolioProject(id);
      if (editingId === id) cancelEdit();
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects yet. Add your first one below.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
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
                <Button variant="ghost" size="icon" onClick={() => startEdit(project)}>
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
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-url">URL</Label>
            <Input id="p-url" placeholder="https://..." {...register("url")} />
            {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-description">Description</Label>
          <Textarea id="p-description" rows={3} {...register("description")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-tech">Tech stack (comma separated)</Label>
          <Input id="p-tech" {...register("techText")} />
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
