const DEV_AUTH_SECRET = "dev-only-change-me-auth-secret"

export function resolveAuthSecret() {
  const secret =
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV !== "production" ? DEV_AUTH_SECRET : undefined)

  if (!secret) {
    throw new Error("Missing AUTH_SECRET or NEXTAUTH_SECRET in production.")
  }

  return secret
}

export const AUTH_SECRET = resolveAuthSecret()
