"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { aiGenerate } from "@/lib/ai/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ai/copy-button";

const tones = ["professional", "friendly", "bold"] as const;

function ToneSelect({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  id: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {tones.map((tone) => (
        <option key={tone} value={tone}>
          {tone[0].toUpperCase() + tone.slice(1)}
        </option>
      ))}
    </select>
  );
}

function ResultBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="space-y-1 rounded-md border bg-muted/40 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <CopyButton text={text} />
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed">{text}</p>
    </div>
  );
}

export function LinkedinGenerator() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [tone, setTone] = useState<string>("professional");

  const [headlines, setHeadlines] = useState<string | null>(null);
  const [about, setAbout] = useState<string | null>(null);
  const [loading, setLoading] = useState<"headline" | "about" | null>(null);

  async function run(kind: "headline" | "about") {
    if (!role.trim()) {
      toast.error("Enter your target role first.");
      return;
    }
    setLoading(kind);
    try {
      if (kind === "headline") {
        const output = await aiGenerate<string>({
          type: "linkedin_headline",
          role,
          skills,
          tone,
        });
        setHeadlines(output);
      } else {
        const output = await aiGenerate<string>({
          type: "linkedin_about",
          role,
          experience,
          skills,
          tone,
        });
        setAbout(output);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your profile inputs</CardTitle>
          <CardDescription>Used by both generators below.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="li-role">Target role</Label>
            <Input
              id="li-role"
              placeholder="Full Stack Developer"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="li-tone">Tone</Label>
            <ToneSelect id="li-tone" value={tone} onChange={setTone} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="li-skills">Key skills (comma separated)</Label>
            <Input
              id="li-skills"
              placeholder="React, Node.js, PostgreSQL, AWS"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="li-exp">Experience summary (for the About section)</Label>
            <Textarea
              id="li-exp"
              rows={4}
              placeholder="2026 CS graduate. Built 3 full-stack apps with Next.js... Internship at..."
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Headline</CardTitle>
            <CardDescription>Three options, each under 220 characters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {headlines && <ResultBlock label="Generated headlines" text={headlines} />}
            <Button onClick={() => run("headline")} disabled={loading !== null}>
              {loading === "headline" ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate headlines
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About section</CardTitle>
            <CardDescription>Three short paragraphs in the first person.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {about && <ResultBlock label="Generated About" text={about} />}
            <Button onClick={() => run("about")} disabled={loading !== null}>
              {loading === "about" ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate About
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
