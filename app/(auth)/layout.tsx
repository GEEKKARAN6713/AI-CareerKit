import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/40 p-4">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Sparkles className="h-5 w-5 text-primary" />
        AI CareerKit
      </Link>
      {children}
    </div>
  );
}
