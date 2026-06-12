"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Gauge, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { aiGenerate } from "@/lib/ai/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AtsResult = {
  score: number;
  strengths: string[];
  improvements: string[];
};

export function AtsScorePanel({ resumeId }: { resumeId: string }) {
  const [result, setResult] = useState<AtsResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function score() {
    setLoading(true);
    try {
      const output = await aiGenerate<AtsResult>({ type: "ats_score", resumeId });
      setResult(output);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Scoring failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" /> ATS Score
        </CardTitle>
        <CardDescription>
          Check how well this resume performs against applicant tracking systems.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-4xl font-bold",
                  result.score >= 75
                    ? "text-green-600"
                    : result.score >= 50
                      ? "text-amber-500"
                      : "text-destructive"
                )}
              >
                {result.score}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Strengths</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {result.strengths.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Improvements</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {result.improvements.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <Button onClick={score} disabled={loading} variant={result ? "outline" : "default"}>
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {result ? "Re-score resume" : "Score my resume"}
        </Button>
      </CardContent>
    </Card>
  );
}
