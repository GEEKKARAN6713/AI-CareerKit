import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("demo1234", 12);

  const user = await db.user.upsert({
    where: { email: "demo@careerkit.dev" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@careerkit.dev",
      password,
      headline: "Full Stack Developer",
    },
  });

  // Reset demo data so the seed is idempotent
  await db.resume.deleteMany({ where: { userId: user.id } });
  await db.portfolio.deleteMany({ where: { userId: user.id } });
  await db.aiGeneration.deleteMany({ where: { userId: user.id } });

  await db.resume.create({
    data: {
      userId: user.id,
      title: "Full Stack Developer — 2026",
      fullName: "Demo User",
      email: "demo@careerkit.dev",
      phone: "+1 555 010 2026",
      location: "Bengaluru, India",
      website: "https://github.com/demo-user",
      summary:
        "Full stack developer and 2026 computer science graduate with hands-on experience building production-grade web applications with Next.js, TypeScript and PostgreSQL. Passionate about developer experience, clean architecture and AI-assisted tooling.",
      experiences: {
        create: [
          {
            role: "Software Engineering Intern",
            company: "Acme Cloud",
            startDate: "May 2025",
            endDate: "Aug 2025",
            current: false,
            bullets: [
              "Built a customer-facing usage dashboard with Next.js and Prisma, reducing support tickets about billing by 30%",
              "Implemented role-based access control across 12 API routes with full test coverage",
              "Optimized PostgreSQL queries with indexes and pagination, cutting p95 latency from 800ms to 120ms",
            ],
          },
          {
            role: "Open Source Contributor",
            company: "Various projects",
            startDate: "Jan 2024",
            endDate: "",
            current: true,
            bullets: [
              "Contributed 15+ merged pull requests to TypeScript developer tooling projects",
              "Authored documentation and reproducible bug reports adopted by maintainers",
            ],
          },
        ],
      },
      educations: {
        create: [
          {
            school: "National Institute of Technology",
            degree: "B.Tech",
            field: "Computer Science",
            startYear: "2022",
            endYear: "2026",
          },
        ],
      },
      skills: {
        create: [
          { name: "TypeScript" },
          { name: "Next.js" },
          { name: "React" },
          { name: "Node.js" },
          { name: "PostgreSQL" },
          { name: "Prisma" },
          { name: "Tailwind CSS" },
          { name: "Docker" },
        ],
      },
      projects: {
        create: [
          {
            name: "AI CareerKit",
            description:
              "AI-powered resume, portfolio and LinkedIn builder with Claude integration, PDF export and public portfolio pages.",
            url: "https://gitlab.com/geekkaran6713-group/ai-careerkit",
            tech: ["Next.js", "Prisma", "PostgreSQL", "Anthropic API"],
          },
          {
            name: "DevLink Shortener",
            description:
              "URL shortener with analytics, rate limiting and a REST API, deployed on the edge.",
            url: "https://github.com/demo-user/devlink",
            tech: ["Hono", "Cloudflare Workers", "D1"],
          },
        ],
      },
    },
  });

  await db.portfolio.create({
    data: {
      userId: user.id,
      slug: "demo-user",
      displayName: "Demo User",
      tagline: "Full Stack Developer · Next.js · TypeScript · PostgreSQL",
      bio: "I'm a 2026 CS graduate who loves building polished, production-quality web applications. Currently exploring AI-assisted developer tools and looking for full stack roles.",
      skills: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "Prisma", "Docker"],
      github: "https://github.com/demo-user",
      linkedin: "https://linkedin.com/in/demo-user",
      websiteUrl: "https://demo-user.dev",
      theme: "midnight",
      published: true,
      projects: {
        create: [
          {
            name: "AI CareerKit",
            description:
              "Full-stack AI career toolkit: resumes with ATS scoring, shareable portfolios and LinkedIn content generation.",
            url: "https://gitlab.com/geekkaran6713-group/ai-careerkit",
            tech: ["Next.js", "Prisma", "Claude API"],
          },
          {
            name: "Realtime Kanban",
            description: "Collaborative kanban board with live cursors and optimistic updates.",
            url: "https://github.com/demo-user/kanban",
            tech: ["React", "WebSockets", "Redis"],
          },
        ],
      },
    },
  });

  await db.aiGeneration.createMany({
    data: [
      {
        userId: user.id,
        type: "BULLETS",
        input: "Rewrite the following rough notes into resume bullet points...",
        output:
          "Built a customer-facing usage dashboard with Next.js and Prisma...\nImplemented role-based access control...",
        inputTokens: 215,
        outputTokens: 120,
      },
      {
        userId: user.id,
        type: "LINKEDIN_HEADLINE",
        input: "Write 3 LinkedIn headline options for a Full Stack Developer...",
        output:
          "Full Stack Developer | Next.js, TypeScript & PostgreSQL | Building AI-powered web apps",
        inputTokens: 96,
        outputTokens: 88,
      },
      {
        userId: user.id,
        type: "ATS_SCORE",
        input: "Evaluate the following resume for ATS compatibility...",
        output: '{"score": 82, "strengths": ["Quantified achievements"], "improvements": ["Add keywords"]}',
        inputTokens: 540,
        outputTokens: 110,
      },
    ],
  });

  console.log("✅ Seed complete.");
  console.log("   Demo login → demo@careerkit.dev / demo1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
