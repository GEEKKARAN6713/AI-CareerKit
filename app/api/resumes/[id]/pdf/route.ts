import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ResumeDocument } from "@/lib/pdf/resume-document";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const resume = await db.resume.findFirst({
    where: { id, userId: session.user.id },
    include: {
      experiences: { orderBy: { createdAt: "asc" } },
      educations: true,
      skills: true,
      projects: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!resume) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = await renderToBuffer(ResumeDocument({ resume }));
  const filename = `${resume.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
