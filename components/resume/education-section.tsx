"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { ResumeWithRelations } from "@/types/resume";
import { upsertEducation, deleteEducation } from "@/lib/actions/resumes";
import { educationSchema, type EducationValues } from "@/lib/validations/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyValues: EducationValues = {
  school: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
};

export function EducationSection({ resume }: { resume: ResumeWithRelations }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: emptyValues,
  });

  function startEdit(id: string) {
    const edu = resume.educations.find((e) => e.id === id);
    if (!edu) return;
    setEditingId(id);
    reset({
      school: edu.school,
      degree: edu.degree,
      field: edu.field ?? "",
      startYear: edu.startYear ?? "",
      endYear: edu.endYear ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(emptyValues);
  }

  async function onSubmit(values: EducationValues) {
    try {
      await upsertEducation(resume.id, { ...values, id: editingId ?? undefined });
      toast.success(editingId ? "Education updated" : "Education added");
      cancelEdit();
      router.refresh();
    } catch {
      toast.error("Could not save education.");
    }
  }

  function onDelete(id: string) {
    startDelete(async () => {
      await deleteEducation(resume.id, id);
      if (editingId === id) cancelEdit();
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {resume.educations.length > 0 && (
        <ul className="space-y-2">
          {resume.educations.map((edu) => (
            <li
              key={edu.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {edu.school} · {edu.startYear || "—"} – {edu.endYear || "—"}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(edu.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  onClick={() => onDelete(edu.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-4" noValidate>
        <p className="text-sm font-medium">{editingId ? "Edit education" : "Add education"}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="school">School</Label>
            <Input id="school" placeholder="University of..." {...register("school")} />
            {errors.school && (
              <p className="text-xs text-destructive">{errors.school.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="degree">Degree</Label>
            <Input id="degree" placeholder="B.Sc." {...register("degree")} />
            {errors.degree && (
              <p className="text-xs text-destructive">{errors.degree.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="field">Field of study</Label>
            <Input id="field" placeholder="Computer Science" {...register("field")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startYear">Start year</Label>
            <Input id="startYear" placeholder="2022" {...register("startYear")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endYear">End year</Label>
            <Input id="endYear" placeholder="2026" {...register("endYear")} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {editingId ? "Update education" : "Add education"}
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
