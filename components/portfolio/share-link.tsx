"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ShareLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/p/${slug}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">Your portfolio is live</p>
          <p className="truncate text-sm text-muted-foreground">{url}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="text-green-600" /> : <Copy />}
            {copied ? "Copied" : "Copy link"}
          </Button>
          <Button size="sm" asChild>
            <a href={`/p/${slug}`} target="_blank" rel="noreferrer">
              <ExternalLink /> View
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
