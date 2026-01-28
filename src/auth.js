import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
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



                return {
                    id: user.id,
                    email: user.email,
                    name: user.role === "FACTORY" ? user.factoryProfile?.businessName : user.buyerProfile?.businessName,
                    role: user.role,
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in url
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role
                session.user.id = token.id
            }
            return session
        }
    }
})
