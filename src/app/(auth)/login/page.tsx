"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

// ✅ The 'export default' is the crucial part that fixes the error.
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border bg-background p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to continue to your account.
          </p>
        </div>
        <div className="mt-6">
          <Button
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Sign In with Google
          </Button>
        </div>
      </div>
    </div>
  );
}