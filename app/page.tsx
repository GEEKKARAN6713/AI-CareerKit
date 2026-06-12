import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Globe,
  Linkedin,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    description:
      "Structured sections for experience, education, skills and projects — with AI-generated, ATS-friendly bullet points and one-click PDF export.",
  },
  {
    icon: Globe,
    title: "Shareable Portfolios",
    description:
      "Publish a beautiful public portfolio page with your projects, bio and social links at your own custom URL.",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Generator",
    description:
      "Generate compelling headlines, About sections and experience summaries tailored to your career story.",
  },
  {
    icon: Sparkles,
    title: "Claude-Powered AI",
    description:
      "Every generation is powered by Anthropic Claude for natural, professional and recruiter-ready writing.",
  },
  {
    icon: Zap,
    title: "ATS Scoring",
    description:
      "Score your resume against applicant tracking systems and get concrete suggestions to improve it.",
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description:
      "Your data stays yours. Secure authentication, protected routes and server-side AI calls only.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Everything you need to land your first interviews.",
    features: ["1 resume", "Public portfolio page", "10 AI generations / month", "PDF export"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    description: "For active job seekers who want every edge.",
    features: [
      "Unlimited resumes",
      "Portfolio themes",
      "Unlimited AI generations",
      "ATS scoring & career suggestions",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Teams",
    price: "$29",
    description: "Career services, bootcamps and universities.",
    features: ["Everything in Pro", "Up to 25 seats", "Shared templates", "Usage analytics"],
    cta: "Contact us",
    highlighted: false,
  },
];

const testimonials = [
  {
    quote:
      "The AI bullet points turned my vague job descriptions into achievements recruiters actually responded to. Three interviews in two weeks.",
    name: "Priya Sharma",
    role: "Frontend Developer",
  },
  {
    quote:
      "I built my entire portfolio site in one evening. The public link is now pinned on my LinkedIn and GitHub profiles.",
    name: "Marcus Lee",
    role: "Full Stack Engineer",
  },
  {
    quote:
      "The LinkedIn About generator captured my voice better than anything I'd written myself in years of trying.",
    name: "Ana Rodrigues",
    role: "Product Manager",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            AI CareerKit
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground">Testimonials</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Get started <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container flex flex-col items-center gap-6 py-24 text-center md:py-32">
          <Badge variant="secondary" className="animate-fade-up">
            <Sparkles className="mr-1 h-3 w-3" /> Powered by Anthropic Claude
          </Badge>
          <h1 className="max-w-3xl animate-fade-up text-4xl font-bold tracking-tight md:text-6xl">
            Your career materials,{" "}
            <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
              written by AI
            </span>
            , owned by you
          </h1>
          <p className="max-w-xl animate-fade-up text-lg text-muted-foreground">
            Build polished resumes, shareable portfolios and standout LinkedIn profiles in
            minutes — not weekends.
          </p>
          <div className="flex animate-fade-up flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Build my resume free <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">See how it works</a>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t bg-muted/40 py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to get hired
              </h2>
              <p className="mt-3 text-muted-foreground">
                One toolkit for every career asset — consistent, professional and AI-assisted.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <feature.icon className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Simple, honest pricing</h2>
              <p className="mt-3 text-muted-foreground">
                Start free. Upgrade when the interviews start rolling in.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={plan.highlighted ? "border-primary shadow-lg" : undefined}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.highlighted && <Badge>Most popular</Badge>}
                    </div>
                    <div className="text-4xl font-bold">
                      {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/signup">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="border-t bg-muted/40 py-24">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Loved by job seekers
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.name}>
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed">“{t.quote}”</p>
                    <div className="mt-4">
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container">
            <Card className="bg-gradient-to-r from-primary to-fuchsia-600 text-primary-foreground">
              <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight">
                  Ready to upgrade your career story?
                </h2>
                <p className="max-w-md text-primary-foreground/80">
                  Join thousands of developers, designers and PMs building career materials
                  that get noticed.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">
                    Create your free account <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} AI CareerKit. Built with Next.js, Prisma & Claude.</p>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
