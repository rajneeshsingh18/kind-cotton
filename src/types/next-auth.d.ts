import NextAuth, { type DefaultSession } from "next-auth";
import { type Role } from "@prisma/client";

/**
 * Extend the default session and user types from NextAuth
 * to include our custom fields like 'id' and 'role'.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"]; // This merges our custom fields with the default ones (name, email, image)
  }
}