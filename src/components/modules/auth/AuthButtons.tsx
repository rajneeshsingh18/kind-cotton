"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";

export function AuthButtons({ session }: { session: Session | null }) {
  if (session?.user) { // Check for session.user for type safety
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium hidden sm:inline">{session.user.name}</span>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    );
  }
  return <Button onClick={() => signIn("google")}>Sign In</Button>;
}