"use client";

/** Small fetch helper for the AI generation endpoint. */
export async function aiGenerate<T = string>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "AI generation failed. Please try again.");
  }

  return data.output as T;
}
