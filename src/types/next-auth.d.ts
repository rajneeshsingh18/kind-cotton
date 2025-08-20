import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"]; 
    // ✅ This keeps `name`, `email`, `image` from DefaultSession
  }

  interface User {
    id: string;
    role: Role;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
