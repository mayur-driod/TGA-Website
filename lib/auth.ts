import "@/lib/auth.types"

import type { Role } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"

import { db } from "@/lib/db"
import { AUTH_SECRET } from "@/lib/auth-secret"

const smtpPort = Number(process.env.AUTH_SMTP_PORT ?? "587")
const googleClientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET

export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: AUTH_SECRET,
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
		async signIn({ user }) {
			if (!user.email) {
				return "/sign-in?error=missing-email"
			}

			user.email = user.email.toLowerCase()
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
