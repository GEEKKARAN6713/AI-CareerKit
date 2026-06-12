import type { Metadata } from "next";
import { LinkedinGenerator } from "@/components/ai/linkedin-generator";

export const metadata: Metadata = { title: "LinkedIn AI" };

export default function LinkedinPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">LinkedIn Generator</h1>
        <p className="text-muted-foreground">
          Generate headlines and About sections tailored to your story.
        </p>
      </div>
      <LinkedinGenerator />
    </div>
  );
}
