import "@/lib/auth.types"

import type { Role } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"

import { db } from "@/lib/db"

const smtpPort = Number(process.env.AUTH_SMTP_PORT ?? "587")
const authSecret =
	process.env.AUTH_SECRET ??
	process.env.NEXTAUTH_SECRET ??
	(process.env.NODE_ENV !== "production" ? "dev-only-change-me-auth-secret" : undefined)
const googleClientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET

export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: authSecret,
	adapter: PrismaAdapter(db),
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},
	providers: [
		Google({
			clientId: googleClientId!,
			clientSecret: googleClientSecret!,
		}),
		Nodemailer({
			from: process.env.AUTH_EMAIL_FROM ?? "TGA <noreply@tga.local>",
			server: {
				host: process.env.AUTH_SMTP_HOST,
				port: smtpPort,
				secure: smtpPort === 465,
				auth: {
					user: process.env.AUTH_SMTP_USER,
					pass: process.env.AUTH_SMTP_PASS,
				},
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, email }) {
			if (!user.email) {
				return "/sign-in?error=missing-email"
			}

			const normalizedEmail = user.email.toLowerCase()
			user.email = normalizedEmail

			if (account?.provider === "nodemailer" && email?.verificationRequest) {
				const existingUser = await db.user.findUnique({
					where: { email: normalizedEmail },
					select: { id: true },
				})

				if (!existingUser) {
					return "/sign-in?error=AccountNotFound"
				}

				await db.account.upsert({
					where: {
						provider_providerAccountId: {
							provider: "nodemailer",
							providerAccountId: normalizedEmail,
						},
					},
					update: {
						userId: existingUser.id,
						type: "email",
					},
					create: {
						userId: existingUser.id,
						type: "email",
						provider: "nodemailer",
						providerAccountId: normalizedEmail,
					},
				})
			}

			return true
		},
		async jwt({ token }) {
			if (!token.email) {
				return token
			}

			const dbUser = await db.user.findUnique({
				where: { email: token.email.toLowerCase() },
				select: { id: true, role: true, image: true },
			})

			if (dbUser) {
				token.id = dbUser.id
				token.role = dbUser.role
				token.picture = dbUser.image ?? token.picture
			}

			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = typeof token.id === "string" ? token.id : ""
				session.user.role = (typeof token.role === "string" ? token.role : "MEMBER") as Role
				session.user.image = typeof token.picture === "string" ? token.picture : session.user.image
			}

			return session
		},
	},
	pages: {
		signIn: "/sign-in",
		error: "/sign-in",
		verifyRequest: "/verify-email",
	},
})
