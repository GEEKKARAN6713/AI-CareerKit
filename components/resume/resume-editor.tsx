"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { ResumeWithRelations } from "@/types/resume";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetailsForm } from "@/components/resume/details-form";
import { ExperienceSection } from "@/components/resume/experience-section";
import { EducationSection } from "@/components/resume/education-section";
import { SkillsSection } from "@/components/resume/skills-section";
import { ProjectsSection } from "@/components/resume/projects-section";
import { ResumePreview } from "@/components/resume/resume-preview";

const sections = [
  { key: "details", label: "Details" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

export function ResumeEditor({ resume }: { resume: ResumeWithRelations }) {
  const [active, setActive] = useState<SectionKey>("details");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{resume.title}</h1>
          <p className="text-muted-foreground">Edit sections and preview in real time.</p>
        </div>
        <Button asChild>
          <a href={`/api/resumes/${resume.id}/pdf`}>
            <Download /> Export PDF
          </a>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActive(section.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active === section.key
                    ? "bg-background shadow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {section.label}
              </button>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              {active === "details" && <DetailsForm resume={resume} />}
              {active === "experience" && <ExperienceSection resume={resume} />}
              {active === "education" && <EducationSection resume={resume} />}
              {active === "skills" && <SkillsSection resume={resume} />}
              {active === "projects" && <ProjectsSection resume={resume} />}
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0">
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}
