// import { headers } from "next/headers"
// import { redirect } from "next/navigation";
// import { auth } from "./auth";


// export const requireAuth = async ()=> {
//     const session = await auth.api.getSession({
//         headers: await headers(),
//     });
//     if (!session) {
//         redirect("/login");
//     }
//     return session;
// }

// export const requireUnauth = async ()=> {
//     const session = await auth.api.getSession({
//         headers: await headers(),
//     });
//     if (!session) {
//         redirect("/login");
//     }
//     return session;
// }



import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");  // no session → go login
  return session;
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) redirect("/");        // ← has session → go home (was wrong before)
};