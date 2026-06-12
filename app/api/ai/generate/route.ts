import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateText } from "@/lib/ai/claude";
import { aiRequestSchema } from "@/lib/validations/ai";
import {
  bulletsPrompt,
  summaryPrompt,
  atsScorePrompt,
  linkedinHeadlinePrompt,
  linkedinAboutPrompt,
  careerSuggestionsPrompt,
} from "@/lib/ai/prompts";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await request.json().catch(() => null);
  const parsed = aiRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    let promptPair: { system: string; prompt: string };

    switch (input.type) {
      case "bullets":
        promptPair = bulletsPrompt(input.role, input.company, input.description);
        break;
      case "summary":
        promptPair = summaryPrompt(input.role, input.experience, input.skills);
        break;
      case "ats_score": {
        const resume = await db.resume.findFirst({
          where: { id: input.resumeId, userId },
          include: { experiences: true, educations: true, skills: true, projects: true },
        });
        if (!resume) {
          return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }
        const resumeText = [
          `Name: ${resume.fullName ?? ""}`,
          `Summary: ${resume.summary ?? ""}`,
          "Experience:",
          ...resume.experiences.map(
            (exp) =>
              `- ${exp.role} at ${exp.company} (${exp.startDate} - ${
                exp.current ? "Present" : exp.endDate ?? ""
              })\n${exp.bullets.map((bullet) => `  * ${bullet}`).join("\n")}`
          ),
          "Education:",
          ...resume.educations.map(
            (edu) => `- ${edu.degree} ${edu.field ?? ""}, ${edu.school}`
          ),
          `Skills: ${resume.skills.map((skill) => skill.name).join(", ")}`,
          "Projects:",
          ...resume.projects.map((project) => `- ${project.name}: ${project.description ?? ""}`),
        ].join("\n");
        promptPair = atsScorePrompt(resumeText);
        break;
      }
      case "linkedin_headline":
        promptPair = linkedinHeadlinePrompt(input.role, input.skills, input.tone);
        break;
      case "linkedin_about":
        promptPair = linkedinAboutPrompt(input.role, input.experience, input.skills, input.tone);
        break;
      case "career_suggestions":
        promptPair = careerSuggestionsPrompt(input.background, input.interests, input.targetRole);
        break;
    }

    const result = await generateText({ ...promptPair, maxTokens: 1500 });

    // For ATS scoring, parse the strict-JSON response
    let output: unknown = result.text;
    if (input.type === "ats_score") {
      try {
        const cleaned = result.text.replace(/^```(json)?|```$/g, "").trim();
        output = JSON.parse(cleaned);
      } catch {
        return NextResponse.json(
          { error: "The AI returned an unexpected format. Please try again." },
          { status: 502 }
        );
      }
    }

    await db.aiGeneration.create({
      data: {
        type: input.type.toUpperCase(),
        input: promptPair.prompt.slice(0, 500),
        output: result.text.slice(0, 5000),
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        userId,
      },
    });

    return NextResponse.json({ output });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "AI generation failed. Check your API key and try again." },
      { status: 500 }
    );
  }
}
