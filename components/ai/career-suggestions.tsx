"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Compass, Loader2 } from "lucide-react";
import { aiGenerate } from "@/lib/ai/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ai/copy-button";

export function CareerSuggestions() {
  const [background, setBackground] = useState("");
  const [interests, setInterests] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (background.trim().length < 20) {
      toast.error("Describe your background in a bit more detail (20+ characters).");
      return;
    }
    setLoading(true);
    try {
      const output = await aiGenerate<string>({
        type: "career_suggestions",
        background,
        interests,
        targetRole: targetRole || undefined,
      });
      setResult(output);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tell us about yourself</CardTitle>
          <CardDescription>
            The more context you give, the better the suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cs-background">Your background</Label>
            <Textarea
              id="cs-background"
              rows={6}
              placeholder="e.g. 2026 CS graduate, internship in web development, built full-stack projects with Next.js and PostgreSQL..."
              value={background}
              onChange={(event) => setBackground(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cs-interests">Interests</Label>
            <Input
              id="cs-interests"
              placeholder="AI products, developer tools, fintech"
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cs-target">Target role (optional)</Label>
            <Input
              id="cs-target"
              placeholder="Full Stack Developer"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
            />
          </div>
          <Button onClick={run} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Compass />}
            Get career suggestions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your growth plan</CardTitle>
          <CardDescription>Next roles, skills to develop, and project ideas.</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-2">
              <div className="flex justify-end">
                <CopyButton text={result} />
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed">{result}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Compass className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Your personalized plan will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
