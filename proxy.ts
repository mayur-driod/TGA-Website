import { NextResponse } from "next/server"

export async function proxy() {
  // Route-level access control is handled by server layouts/pages via auth().
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
