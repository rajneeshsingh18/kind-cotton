// src/components/shared/header/index.tsx
import { auth } from "@/lib/auth" // Our main auth config
import { AuthButtons } from "@/components/modules/auth/AuthButtons"
import Link from "next/link"

export async function Header() {
  const session = await auth() // Get the session on the server

  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-xl">
          ClothingBrand
        </Link>
        <div>
          {/* We pass the server-side session to the client component */}
          <AuthButtons session={session} />
        </div>
      </nav>
    </header>
  )
}