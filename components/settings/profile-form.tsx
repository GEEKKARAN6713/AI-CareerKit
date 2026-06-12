"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  headline: z.string().max(120).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm({
  name,
  headline,
  email,
}: {
  name: string;
  headline: string;
  email: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name, headline },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updateProfile({ name: values.name, headline: values.headline ?? "" });
      toast.success("Profile updated");
      router.refresh();
    } catch {
      toast.error("Could not update profile.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="settings-email">Email</Label>
        <Input id="settings-email" value={email} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="settings-name">Full name</Label>
        <Input id="settings-name" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="settings-headline">Headline</Label>
        <Input
          id="settings-headline"
          placeholder="Full Stack Developer"
          {...register("headline")}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}
