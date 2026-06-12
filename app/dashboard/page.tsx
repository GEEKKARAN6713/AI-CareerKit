import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Globe, Sparkles, Linkedin, ArrowRight, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

const typeLabels: Record<string, string> = {
  BULLETS: "Generated resume bullets",
  SUMMARY: "Generated a professional summary",
  ATS_SCORE: "Scored a resume for ATS",
  LINKEDIN_HEADLINE: "Generated LinkedIn headlines",
  LINKEDIN_ABOUT: "Generated a LinkedIn About section",
  CAREER_SUGGESTIONS: "Generated career suggestions",
};

const quickActions = [
  { href: "/dashboard/resumes", label: "Create a resume", icon: FileText },
  { href: "/dashboard/portfolio", label: "Build your portfolio", icon: Globe },
  { href: "/dashboard/linkedin", label: "Generate LinkedIn content", icon: Linkedin },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] ?? "there";

  const [resumeCount, portfolio, aiCount, linkedinCount, recentGenerations, recentResumes] =
    await Promise.all([
      db.resume.count({ where: { userId: user.id } }),
      db.portfolio.findUnique({ where: { userId: user.id } }),
      db.aiGeneration.count({ where: { userId: user.id } }),
      db.aiGeneration.count({
        where: { userId: user.id, type: { in: ["LINKEDIN_HEADLINE", "LINKEDIN_ABOUT"] } },
      }),
      db.aiGeneration.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.resume.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 3,
        select: { id: true, title: true, updatedAt: true },
      }),
    ]);

  const stats = [
    { label: "Resumes", value: String(resumeCount), icon: FileText, hint: "Total resumes" },
    {
      label: "Portfolio",
      value: portfolio ? (portfolio.published ? "Live" : "Draft") : "Not created",
      icon: Globe,
      hint: portfolio ? `/p/${portfolio.slug}` : "Create your public page",
    },
    { label: "AI generations", value: String(aiCount), icon: Sparkles, hint: "Across all tools" },
    {
      label: "LinkedIn drafts",
      value: String(linkedinCount),
      icon: Linkedin,
      hint: "Headlines & About sections",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName} 👋</h1>
        <p className="text-muted-foreground">Here’s an overview of your career materials.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="truncate text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump straight into building.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.href}
                variant="outline"
                className="w-full justify-between"
                asChild
              >
                <Link href={action.href}>
                  <span className="flex items-center gap-2">
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ))}
            {recentResumes.length > 0 && (
              <div className="pt-2">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Recently edited
                </p>
                <ul className="space-y-1">
                  {recentResumes.map((resume) => (
                    <li key={resume.id}>
                      <Link
                        href={`/dashboard/resumes/${resume.id}`}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                      >
                        <span className="truncate">{resume.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(resume.updatedAt)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Your latest AI generations.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentGenerations.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No activity yet. Try generating resume bullets with AI.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {recentGenerations.map((generation) => (
                  <li key={generation.id} className="flex items-start gap-3 text-sm">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p>{typeLabels[generation.type] ?? generation.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(generation.createdAt)} ·{" "}
                        {generation.inputTokens + generation.outputTokens} tokens
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
