# AI CareerKit 🚀

An AI-powered **resume, portfolio and LinkedIn profile builder** — a production-quality full-stack application built with Next.js 15 and the Anthropic Claude API.

## ✨ Features

- **AI Resume Builder** — structured editor (details, experience, education, skills, projects), AI-generated ATS-friendly bullet points, AI professional summaries, live preview and **PDF export**
- **ATS Scoring** — Claude evaluates your resume and returns a 0–100 score with strengths and concrete improvements
- **Portfolio Builder** — public shareable page at `/p/your-slug` with projects, bio, skills, social links and **three themes** (minimal, gradient, midnight)
- **LinkedIn Generator** — headlines and About sections in selectable tones, with copy-to-clipboard
- **Career Suggestions** — AI-powered growth plan: next roles, skills to develop, project ideas
- **Dashboard** — overview cards, recent AI activity, quick actions
- **Settings** — profile management, AI usage stats (generations + tokens by type), dark mode toggle
- **Auth** — email/password with bcrypt, JWT sessions, middleware-protected routes
- Responsive design, dark mode, loading skeletons, empty states and error states throughout

## 🛠 Tech stack

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 15 (App Router), React 19, TypeScript |
| Styling    | Tailwind CSS, shadcn/ui, lucide-react |
| Database   | PostgreSQL + Prisma ORM |
| Auth       | Auth.js / NextAuth v5 (credentials, JWT) |
| AI         | Anthropic Claude API (`@anthropic-ai/sdk`) |
| Forms      | React Hook Form + Zod |
| PDF        | @react-pdf/renderer |
| Infra      | Docker, docker-compose, GitLab CI, Vercel-ready |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system and ER diagrams.

## 🚀 Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or use the docker-compose service below)
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Install

```bash
git clone https://gitlab.com/geekkaran6713-group/ai-careerkit.git
cd ai-careerkit
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL, e.g. `http://localhost:3000` |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `ANTHROPIC_MODEL` | Claude model (default `claude-sonnet-4-5`) |
| `NEXT_PUBLIC_APP_URL` | Public base URL for portfolio share links |

### 3. Database

```bash
# Start PostgreSQL (optional, via Docker)
docker compose up -d db

# Apply the schema
npm run db:push

# Seed demo data
npm run db:seed
```

Demo login after seeding: **demo@careerkit.dev / demo1234**

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000.

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run start` | Start the production server |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:migrate` | Create/apply a migration |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

## 🐳 Docker

Run the full stack (app + PostgreSQL):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export AUTH_SECRET=$(openssl rand -base64 32)
docker compose up --build
```

Then apply the schema once: `docker compose exec app npx prisma db push` (or run `npm run db:push` locally against port 5432).

## ☁️ Deploy to Vercel

1. Push this repository to GitLab/GitHub and import it in [Vercel](https://vercel.com/new).
2. Provision a PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.).
3. Set the environment variables from the table above in the Vercel project settings (set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production URL).
4. Deploy — the build command (`prisma generate && next build`) is already configured.
5. Apply the schema once from your machine: `DATABASE_URL=... npx prisma db push` (and optionally `npx prisma db seed`).

## 🔁 CI/CD

The GitLab pipeline (`.gitlab-ci.yml`) runs on every push:

- **typecheck** — `prisma generate` + `tsc --noEmit`
- **build** — full production `next build`

## 📁 Project structure

```
app/                  # App Router pages & API routes
  (auth)/             # Sign in / sign up
  dashboard/          # Protected app (overview, resumes, portfolio, linkedin, career, settings)
  p/[slug]/           # Public portfolio pages
  api/                # auth, AI generation, PDF export
components/           # ui/ (shadcn), auth/, dashboard/, resume/, portfolio/, ai/, settings/
lib/                  # auth, db, ai/ (claude client + prompts), actions/, validations/, pdf/
prisma/               # schema.prisma + seed.ts
docs/                 # architecture & ER diagrams
types/                # shared TypeScript types
```

## 🔒 Security notes

- Passwords hashed with bcrypt (12 rounds); JWT sessions via Auth.js
- All dashboard routes protected by middleware; every query scoped by `userId`
- All inputs validated with Zod on both client and server
- The Anthropic API key is used **server-side only**; every AI call is logged with token usage

## 📄 License

MIT — free to use as a portfolio reference.
