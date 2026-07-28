// import { createAuthClient } from "better-auth/react"
// export const authClient = createAuthClient();



import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  plugins: [
polarClient()
  ],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // ← add this
});