import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { createResume, deleteResume } from "@/lib/actions/resumes";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Resumes" };

export default async function ResumesPage() {
  const user = await requireUser();
  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { experiences: true, skills: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resumes</h1>
          <p className="text-muted-foreground">Create, edit and export your resumes.</p>
        </div>
        <form action={createResume}>
          <Button type="submit">
            <Plus /> New resume
          </Button>
        </form>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium">No resumes yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Create your first resume and let AI help you write recruiter-ready bullet
              points.
            </p>
            <form action={createResume}>
              <Button type="submit">
                <Plus /> Create your first resume
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">{resume.title}</CardTitle>
                <CardDescription>
                  {resume._count.experiences} experiences · {resume._count.skills} skills
                  <br />
                  Updated {formatDate(resume.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/dashboard/resumes/${resume.id}`}>Edit</Link>
                </Button>
                <form action={deleteResume.bind(null, resume.id)}>
                  <Button variant="ghost" size="icon" type="submit" aria-label="Delete resume">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
