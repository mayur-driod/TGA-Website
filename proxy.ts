import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED_ROUTES = ["/dashboard", "/admin"]
const authSecret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({
    req,
    secret: authSecret,
  })

  const isLoggedIn = Boolean(token)
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
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
