// src/lib/auth/index.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"

import db from "@/lib/db"

import type { User as NextAuthUser } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      role?: string;
    }
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session management
  },
  callbacks: {
    // This callback is used to add custom data (like role) to the session token.
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session
    },
    // This callback is used to add the user's ID and role to the JWT.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token
    },
  },
})