import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/settings/profile-form";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Settings" };

const typeLabels: Record<string, string> = {
  BULLETS: "Resume bullets",
  SUMMARY: "Summaries",
  ATS_SCORE: "ATS scores",
  LINKEDIN_HEADLINE: "LinkedIn headlines",
  LINKEDIN_ABOUT: "LinkedIn About",
  CAREER_SUGGESTIONS: "Career suggestions",
};

export default async function SettingsPage() {
  const sessionUser = await requireUser();

  const [user, totals, byType] = await Promise.all([
    db.user.findUnique({ where: { id: sessionUser.id } }),
    db.aiGeneration.aggregate({
      where: { userId: sessionUser.id },
      _count: { _all: true },
      _sum: { inputTokens: true, outputTokens: true },
    }),
    db.aiGeneration.groupBy({
      by: ["type"],
      where: { userId: sessionUser.id },
      _count: { _all: true },
    }),
  ]);

  if (!user) notFound();

  const totalTokens = (totals._sum.inputTokens ?? 0) + (totals._sum.outputTokens ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, theme and AI usage.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              name={user.name}
              headline={user.headline ?? ""}
              email={user.email}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> AI usage
              </CardTitle>
              <CardDescription>Your generation history at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{totals._count._all}</p>
                  <p className="text-xs text-muted-foreground">Total generations</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTokens.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Tokens used</p>
                </div>
              </div>
              {byType.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {byType.map((entry) => (
                    <Badge key={entry.type} variant="secondary">
                      {typeLabels[entry.type] ?? entry.type}: {entry._count._all}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No AI generations yet. Try the resume bullet generator!
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Switch between light and dark mode.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Toggle theme</p>
              <ThemeToggle />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
