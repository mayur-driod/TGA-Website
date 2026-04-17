import type { Role } from "@prisma/client"

import { RVU_EMAIL_DOMAIN } from "@/lib/constants"

export const Permissions = {
  canManageEvents: (role: Role) => role === "MAINTAINER" || role === "ADMIN",

  canManageTeam: (role: Role) => role === "MAINTAINER" || role === "ADMIN",

  canManageBlog: (role: Role) => role === "MAINTAINER" || role === "ADMIN",

  canManageUsers: (role: Role) => role === "ADMIN",

  canManageRoles: (role: Role) => role === "ADMIN",

  canRegisterForEvent: (email: string, eventRequiresRvu: boolean) => {
    if (!eventRequiresRvu) {
      return true
    }

    return email.toLowerCase().endsWith(RVU_EMAIL_DOMAIN)
  },
}
