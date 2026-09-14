"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(login, { error: undefined });
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <div className="ambient-glow" />
      <div className="glass relative z-10 w-full max-w-sm rounded-[var(--radius-lg)] p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium">Admin sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Only you should have credentials for this.
            </p>
          </div>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {state?.error && <p className="text-sm text-danger">{state.error}</p>}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
