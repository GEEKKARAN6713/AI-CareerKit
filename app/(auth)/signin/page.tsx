import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to continue building your career materials.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense>
          <SignInForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
