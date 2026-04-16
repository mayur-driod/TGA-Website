"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

type Role = "MEMBER" | "MAINTAINER" | "ADMIN"

type Props = {
  userId: string
  currentRole: Role
  disabled?: boolean
}

export function RoleSelect({ userId, currentRole, disabled = false }: Props) {
  const [role, setRole] = useState<Role>(currentRole)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const updateRole = async () => {
    setLoading(true)
    setMessage(null)

    const response = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    })

    const result = (await response.json()) as { error?: string }

    if (!response.ok) {
      setMessage(result.error ?? "Update failed")
      setLoading(false)
      return
    }

    setMessage("Updated")
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        disabled={disabled || loading}
        onChange={(event) => setRole(event.target.value as Role)}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
      >
        <option value="MEMBER">MEMBER</option>
        <option value="MAINTAINER">MAINTAINER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <Button type="button" size="sm" variant="outline" disabled={disabled || loading} onClick={updateRole}>
        Save
      </Button>
      {message ? <span className="text-xs text-muted-foreground">{message}</span> : null}
    </div>
  )
}
