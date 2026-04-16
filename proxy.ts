import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MEMBER_ROUTES = ["/dashboard"]
const MAINTAINER_ROUTES = ["/admin", "/admin/events", "/admin/blog"]
const ADMIN_ROUTES = ["/admin/users", "/admin/settings"]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  const isLoggedIn = Boolean(token)
  const role = typeof token?.role === "string" ? token.role : undefined

  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/sign-in?error=unauthorized", req.url))
    }
  }

  if (MAINTAINER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn || (role !== "MAINTAINER" && role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/sign-in?error=unauthorized", req.url))
    }
  }

  if (MEMBER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${callbackUrl}`, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
