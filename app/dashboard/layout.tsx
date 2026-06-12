import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar, MobileNav } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <div className="font-semibold md:hidden">AI CareerKit</div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserNav
              name={session.user.name ?? "User"}
              email={session.user.email ?? ""}
            />
          </div>
        </header>
        <MobileNav />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
