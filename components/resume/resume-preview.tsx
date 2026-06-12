import type { ResumeWithRelations } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";

export function ResumePreview({ resume }: { resume: ResumeWithRelations }) {
  const contactItems = [resume.email, resume.phone, resume.location, resume.website].filter(
    Boolean
  );

  return (
    <Card className="sticky top-6">
      <CardContent className="space-y-5 p-8 text-sm">
        {/* Header */}
        <div className="border-b pb-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {resume.fullName || "Your Name"}
          </h2>
          {contactItems.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">{contactItems.join("  ·  ")}</p>
          )}
        </div>

        {resume.summary && (
          <section>
            <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
              Summary
            </h3>
            <p className="leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {resume.experiences.length > 0 && (
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Experience
            </h3>
            <div className="space-y-3">
              {resume.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <p className="font-semibold">
                      {exp.role} · <span className="font-normal">{exp.company}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate || "—"}
                    </p>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="mt-1 list-disc space-y-0.5 pl-5">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.educations.length > 0 && (
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Education
            </h3>
            <div className="space-y-2">
              {resume.educations.map((edu) => (
                <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-1">
                  <p>
                    <span className="font-semibold">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </span>{" "}
                    · {edu.school}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {edu.startYear || ""}{edu.startYear || edu.endYear ? " – " : ""}{edu.endYear || ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.skills.length > 0 && (
          <section>
            <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
              Skills
            </h3>
            <p>{resume.skills.map((skill) => skill.name).join("  ·  ")}</p>
          </section>
        )}

        {resume.projects.length > 0 && (
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Projects
            </h3>
            <div className="space-y-2">
              {resume.projects.map((project) => (
                <div key={project.id}>
                  <p className="font-semibold">
                    {project.name}
                    {project.tech.length > 0 && (
                      <span className="font-normal text-muted-foreground">
                        {" "}— {project.tech.join(", ")}
                      </span>
                    )}
                  </p>
                  {project.description && <p className="text-xs">{project.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
