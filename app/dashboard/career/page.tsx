import type { Metadata } from "next";
import { CareerSuggestions } from "@/components/ai/career-suggestions";

export const metadata: Metadata = { title: "Career AI" };

export default function CareerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career Suggestions</h1>
        <p className="text-muted-foreground">
          AI-powered guidance on roles, skills and portfolio projects.
        </p>
      </div>
      <CareerSuggestions />
    </div>
  );
}
