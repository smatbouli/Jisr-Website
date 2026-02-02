import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Start with Email",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                    include: {
                        factoryProfile: true,
                        buyerProfile: true
                    }
                })

                // --- TEMPORARY FIX: Force Admin Role ---
                if (user && user.email === 'admin@sinaa.com' && user.role !== 'ADMIN') {
                    console.log('Use found but has wrong role. Fixing admin role...');
                    const updatedUser = await prisma.user.update({
                        where: { email: 'admin@sinaa.com' },
                        data: { role: 'ADMIN' }
                    });
                    user.role = 'ADMIN'; // Update local object to allow immediate login
                }
                // ---------------------------------------

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid = await compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                if (user.isBanned) {
                    throw new Error("Account suspended.")
                }

                let name = null;
                if (user.role === "FACTORY") {
                    name = user.factoryProfile?.businessName;
                } else if (user.role === "BUYER") {
                    name = user.buyerProfile?.businessName;
                } else if (user.role === "ADMIN") {
                    name = "Administrator";
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: name,
                    role: user.role,
                }
            }
        })
    ],
})
