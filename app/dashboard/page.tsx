import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Globe, Sparkles, Linkedin, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

const stats = [
  { label: "Resumes", value: 0, icon: FileText, hint: "No resumes yet" },
  { label: "Portfolio", value: "Not published", icon: Globe, hint: "Create your public page" },
  { label: "AI generations", value: 0, icon: Sparkles, hint: "Across all tools" },
  { label: "LinkedIn drafts", value: 0, icon: Linkedin, hint: "Headlines & About sections" },
];

const quickActions = [
  { href: "/dashboard/resumes", label: "Create a resume", icon: FileText },
  { href: "/dashboard/portfolio", label: "Build your portfolio", icon: Globe },
  { href: "/dashboard/linkedin", label: "Generate LinkedIn content", icon: Linkedin },
];

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName} 👋</h1>
        <p className="text-muted-foreground">
          Here’s an overview of your career materials.
        </p>
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
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Your latest edits and AI generations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No activity yet. Create your first resume to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
