
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import {checkout,polar,portal} from "@polar-sh/better-auth"

import  prisma  from "@/lib/db";
import { polarClient } from "./polar";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    socialProviders : {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignup: true,
            use:[
                checkout({
                    products: [
                        {
                            productId:"0a05067a-74f4-4720-b22e-a6fb530ab20b",
                            slug: "pro",
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL ,
                    authenticatedUsersOnly: true,

                }),
                portal(),
            ]
        })
    ]
});
