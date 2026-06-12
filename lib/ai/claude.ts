import Anthropic from "@anthropic-ai/sdk";

// The SDK reads ANTHROPIC_API_KEY from the environment by default.
const anthropic = new Anthropic();

export const AI_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

export type GenerationResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
};

export async function generateText({
  system,
  prompt,
  maxTokens = 1024,
}: {
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<GenerationResult> {
  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  return {
    text,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  };
}
