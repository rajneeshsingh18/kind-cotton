// src/components/modules/auth/AuthButtons.tsx
"use client" // This component needs to be a client component to use event handlers

import { signIn, signOut } from "next-auth/react"
import { Button } from "../../ui/button" // Adjust the path as needed based on your folder structure

// A component to show login/logout buttons based on session
export function AuthButtons({ session }: { session: any }) {
  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>
          {session.user?.name}
        </p>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    )
  }

  return <Button onClick={() => signIn("google")}>Sign in with Google</Button>
}