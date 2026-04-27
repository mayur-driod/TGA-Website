"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

type Role = "MEMBER" | "MAINTAINER" | "ADMIN"

type EditableUser = {
  id: string
  name: string | null
  email: string
  role: Role
  createdAt: Date | string
  registrationsCount: number
}

type Props = {
  users: EditableUser[]
  currentUserId: string
  canManageRoles: boolean
}

type RowState = {
  name: string
  email: string
  role: Role
}

function toRowState(user: EditableUser): RowState {
  return {
    name: user.name ?? "",
    email: user.email,
    role: user.role,
  }
}

export function UserDetailsEditor({ users, currentUserId, canManageRoles }: Props) {
  const [rows, setRows] = useState<Record<string, RowState>>({})
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [messageByUser, setMessageByUser] = useState<Record<string, string>>({})

  const setField = <K extends keyof RowState>(userId: string, field: K, value: RowState[K]) => {
    setRows((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] ?? { name: "", email: "", role: "MEMBER" as Role }),
        [field]: value,
      },
    }))

    setMessageByUser((prev) => ({
      ...prev,
      [userId]: "",
    }))
  }

  const saveUser = async (userId: string) => {
    const row = rows[userId]
    if (!row) {
      return
    }

    setLoadingUserId(userId)

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: row.name.trim(),
        email: row.email.trim(),
        role: canManageRoles ? row.role : undefined,
      }),
    })

    const payload = (await response.json().catch(() => null)) as
      | { error?: string; user?: { name: string | null; email: string; role: Role } }
      | null

    const updatedUser = payload?.user

    if (!response.ok || !updatedUser) {
      const error = payload?.error ?? "Update failed"
      setMessageByUser((prev) => ({
        ...prev,
        [userId]: error,
      }))
      setLoadingUserId(null)
      return
    }

    setRows((prev) => ({
      ...prev,
      [userId]: {
        name: updatedUser.name ?? "",
        email: updatedUser.email,
        role: updatedUser.role,
      },
    }))

    setMessageByUser((prev) => ({
      ...prev,
      [userId]: "Updated",
    }))

    setLoadingUserId(null)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium">Registrations</th>
            {canManageRoles ? <th className="px-4 py-3 font-medium">Role</th> : null}
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const row = rows[user.id] ?? toRowState(user)
            const isSaving = loadingUserId === user.id
            const isSelf = currentUserId === user.id

            return (
              <tr key={user.id} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <input
                    value={row.name}
                    onChange={(event) => setField(user.id, "name", event.target.value)}
                    className="h-8 w-full min-w-44 rounded-md border border-input bg-background px-2 text-xs"
                    placeholder="Name"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="email"
                    value={row.email}
                    onChange={(event) => setField(user.id, "email", event.target.value)}
                    className="h-8 w-full min-w-56 rounded-md border border-input bg-background px-2 text-xs"
                    placeholder="Email"
                  />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
                    new Date(user.createdAt),
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.registrationsCount}</td>
                {canManageRoles ? (
                  <td className="px-4 py-3">
                    <select
                      value={row.role}
                      onChange={(event) => setField(user.id, "role", event.target.value as Role)}
                      disabled={isSelf}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="MAINTAINER">MAINTAINER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                ) : null}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button type="button" size="sm" variant="outline" disabled={isSaving} onClick={() => saveUser(user.id)}>
                      Save
                    </Button>
                    {messageByUser[user.id] ? (
                      <span className="text-xs text-muted-foreground">{messageByUser[user.id]}</span>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}

          {users.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-sm text-muted-foreground" colSpan={canManageRoles ? 6 : 5}>
                No users found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
