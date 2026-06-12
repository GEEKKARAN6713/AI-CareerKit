import type { Prisma } from "@prisma/client";

export type ResumeWithRelations = Prisma.ResumeGetPayload<{
  include: {
    experiences: true;
    educations: true;
    skills: true;
    projects: true;
  };
}>;
