const BASE_SYSTEM =
  "You are an expert career coach and professional resume writer. You write concise, specific, achievement-oriented content. Never invent facts the user did not provide. Never use placeholder text.";

export function bulletsPrompt(role: string, company: string | undefined, description: string) {
  return {
    system: BASE_SYSTEM,
    prompt: `Rewrite the following rough notes into 3-5 strong, ATS-friendly resume bullet points for the role of "${role}"${company ? ` at "${company}"` : ""}.

Rules:
- Start each bullet with a strong action verb.
- Quantify impact where the notes support it; do not invent numbers.
- One bullet per line. No numbering, dashes, or extra commentary.

Rough notes:
${description}`,
  };
}

export function summaryPrompt(role: string, experience: string, skills: string) {
  return {
    system: BASE_SYSTEM,
    prompt: `Write a professional resume summary (2-3 sentences, first person implied, no "I") for a ${role}.

Experience:
${experience || "None provided"}

Key skills: ${skills || "None provided"}

Return only the summary paragraph.`,
  };
}

export function atsScorePrompt(resumeText: string) {
  return {
    system: BASE_SYSTEM,
    prompt: `Evaluate the following resume for ATS (applicant tracking system) compatibility and overall quality.

Respond with STRICT JSON only, no markdown fences, matching exactly this shape:
{"score": <integer 0-100>, "strengths": [<3 short strings>], "improvements": [<3-5 short, actionable strings>]}

Resume:
${resumeText}`,
  };
}

export function linkedinHeadlinePrompt(role: string, skills: string, tone: string) {
  return {
    system: BASE_SYSTEM,
    prompt: `Write 3 LinkedIn headline options (max 220 characters each) for a ${role}. Tone: ${tone}. Key skills: ${skills || "not specified"}.

One headline per line. No numbering or commentary.`,
  };
}

export function linkedinAboutPrompt(
  role: string,
  experience: string,
  skills: string,
  tone: string
) {
  return {
    system: BASE_SYSTEM,
    prompt: `Write a LinkedIn "About" section (3 short paragraphs, first person) for a ${role}. Tone: ${tone}.

Background:
${experience || "Not provided"}

Key skills: ${skills || "Not provided"}

End with a simple call to action to connect. Return only the About text.`,
  };
}

export function careerSuggestionsPrompt(
  background: string,
  interests: string,
  targetRole?: string
) {
  return {
    system: BASE_SYSTEM,
    prompt: `Act as a career advisor. Based on the background below, suggest a practical career growth plan${targetRole ? ` toward the role of "${targetRole}"` : ""}.

Background:
${background}

Interests: ${interests || "Not provided"}

Provide:
1. Three suitable next roles with one-line reasons.
2. Top 5 skills to develop, in priority order.
3. Two concrete portfolio project ideas.

Use short headings and bullet points. Be specific and realistic.`,
  };
}
