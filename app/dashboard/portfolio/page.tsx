import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PortfolioForm } from "@/components/portfolio/portfolio-form";
import { PortfolioProjects } from "@/components/portfolio/portfolio-projects";
import { ShareLink } from "@/components/portfolio/share-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const user = await requireUser();
  const portfolio = await db.portfolio.findUnique({
    where: { userId: user.id },
    include: { projects: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Build a public page to showcase your work.
          </p>
        </div>
        {portfolio && (
          <Badge variant={portfolio.published ? "default" : "secondary"}>
            {portfolio.published ? "Published" : "Draft"}
          </Badge>
        )}
      </div>

      {portfolio?.published && <ShareLink slug={portfolio.slug} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your public bio, skills, links and theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioForm portfolio={portfolio} defaultName={user.name ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              {portfolio
                ? "Showcase your best work on your public page."
                : "Save your profile first to start adding projects."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {portfolio ? (
              <PortfolioProjects projects={portfolio.projects} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Your projects will appear here once your portfolio profile is saved.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
