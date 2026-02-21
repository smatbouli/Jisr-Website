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

                console.log('Login attempt for:', credentials.email);

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                    include: {
                        factoryProfile: true,
                        buyerProfile: true
                    }
                })

                if (!user) {
                    console.log('User not found');
                    return null;
                }

                // --- TEMPORARY FIX: Force Admin Role ---
                if (user.email === 'admin@sinaa.com' && user.role !== 'ADMIN') {
                    console.log('User found but has wrong role. Fixing admin role...');
                    await prisma.user.update({
                        where: { email: 'admin@sinaa.com' },
                        data: { role: 'ADMIN' }
                    });
                    user.role = 'ADMIN';
                }
                // ---------------------------------------

                if (!user.password) {
                    console.log('User has no password');
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.password)
                console.log('Password valid:', isPasswordValid);

                if (!isPasswordValid) {
                    return null
                }

                if (user.isBanned) {
                    console.log('User is banned');
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
    trustHost: true,
})
