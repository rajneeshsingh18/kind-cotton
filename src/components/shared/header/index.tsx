import { auth } from "@/lib/auth"; // Your NextAuth.js config
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  // Fetches session data on the server, avoiding a client-side API call
  const session = await auth();

  // Renders the client component and passes the session data as a prop
  return <HeaderClient session={session} />;
}