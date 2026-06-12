import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Github, Globe, Linkedin, Twitter, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

async function getPortfolio(slug: string) {
  return db.portfolio.findUnique({
    where: { slug },
    include: { projects: { orderBy: { createdAt: "asc" } } },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);
  if (!portfolio || !portfolio.published) return { title: "Portfolio not found" };
  return {
    title: `${portfolio.displayName} — Portfolio`,
    description: portfolio.tagline ?? portfolio.bio?.slice(0, 160) ?? undefined,
  };
}

const themeStyles = {
  minimal: {
    page: "bg-white text-zinc-900",
    card: "border border-zinc-200 bg-white",
    accent: "text-violet-600",
    chip: "bg-zinc-100 text-zinc-700",
    muted: "text-zinc-500",
  },
  gradient: {
    page: "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white",
    card: "border border-white/20 bg-white/10 backdrop-blur",
    accent: "text-white",
    chip: "bg-white/20 text-white",
    muted: "text-white/70",
  },
  midnight: {
    page: "bg-zinc-950 text-zinc-100",
    card: "border border-zinc-800 bg-zinc-900",
    accent: "text-violet-400",
    chip: "bg-zinc-800 text-zinc-300",
    muted: "text-zinc-400",
  },
} as const;

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio || !portfolio.published) notFound();

  const theme = themeStyles[portfolio.theme as keyof typeof themeStyles] ?? themeStyles.minimal;

  const socials = [
    { href: portfolio.github, icon: Github, label: "GitHub" },
    { href: portfolio.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: portfolio.twitter, icon: Twitter, label: "X" },
    { href: portfolio.websiteUrl, icon: Globe, label: "Website" },
  ].filter((social) => social.href);

  return (
    <div className={cn("min-h-screen", theme.page)}>
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* Hero */}
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {portfolio.displayName}
          </h1>
          {portfolio.tagline && (
            <p className={cn("mt-3 text-lg", theme.muted)}>{portfolio.tagline}</p>
          )}
          {socials.length > 0 && (
            <div className="mt-6 flex justify-center gap-4">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={cn("transition-opacity hover:opacity-70", theme.accent)}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Bio */}
        {portfolio.bio && (
          <section className="mt-14">
            <h2 className={cn("mb-3 text-sm font-bold uppercase tracking-widest", theme.accent)}>
              About
            </h2>
            <p className="whitespace-pre-line leading-relaxed">{portfolio.bio}</p>
          </section>
        )}

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <section className="mt-12">
            <h2 className={cn("mb-3 text-sm font-bold uppercase tracking-widest", theme.accent)}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill}
                  className={cn("rounded-full px-3 py-1 text-sm font-medium", theme.chip)}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects.length > 0 && (
          <section className="mt-12">
            <h2 className={cn("mb-4 text-sm font-bold uppercase tracking-widest", theme.accent)}>
              Projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {portfolio.projects.map((project) => (
                <div key={project.id} className={cn("rounded-xl p-5", theme.card)}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.name}`}
                        className={cn("shrink-0 hover:opacity-70", theme.accent)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className={cn("mt-2 text-sm leading-relaxed", theme.muted)}>
                      {project.description}
                    </p>
                  )}
                  {project.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className={cn("rounded-full px-2 py-0.5 text-xs", theme.chip)}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className={cn("mt-20 text-center text-xs", theme.muted)}>
          Built with AI CareerKit
        </footer>
      </div>
    </div>
  );
}
