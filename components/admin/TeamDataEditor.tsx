"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { TeamCommittee, TeamHierarchyData, TeamMemberProfile, TeamSocialLink } from "@/lib/types"

type TeamApiResponse = {
  data?: TeamHierarchyData
  error?: string
}

type Props = {
  initialData: TeamHierarchyData
}

type MemberSectionKey = "studentAdvisors" | "leadershipCore" | "facultyMentors"

const MEMBER_SECTIONS: Array<{ key: MemberSectionKey; label: string; idPrefix: string }> = [
  { key: "studentAdvisors", label: "Student Advisors", idPrefix: "advisor" },
  { key: "leadershipCore", label: "Leadership Core", idPrefix: "lead" },
  { key: "facultyMentors", label: "Faculty Mentors", idPrefix: "faculty" },
]

const SOCIAL_OPTIONS: TeamSocialLink["platform"][] = ["linkedin", "x", "instagram", "email", "website", "other"]

function cloneData(data: TeamHierarchyData): TeamHierarchyData {
  return JSON.parse(JSON.stringify(data)) as TeamHierarchyData
}

function createMember(idPrefix: string): TeamMemberProfile {
  const unique = Date.now().toString(36)

  return {
    id: `${idPrefix}-${unique}`,
    name: "",
    role: "",
    department: "",
    year: null,
    bio: "",
    avatar: "",
    imageUrl: null,
    focusAreas: [],
    socials: [],
  }
}

function createCommittee(): TeamCommittee {
  const unique = Date.now().toString(36)

  return {
    id: `committee-${unique}`,
    name: "",
    description: "",
    focus: "",
    leads: [],
    openRoles: [],
  }
}

export function TeamDataEditor({ initialData }: Props) {
  const [formData, setFormData] = useState<TeamHierarchyData>(cloneData(initialData))
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({})
  const [expandedCommittees, setExpandedCommittees] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"idle" | "success" | "error">("idle")

  const getMemberCardKey = (section: MemberSectionKey, member: TeamMemberProfile, memberIndex: number) =>
    `${section}-${member.id || memberIndex}`

  const getCommitteeCardKey = (committee: TeamCommittee, committeeIndex: number) =>
    `${committee.id || "committee"}-${committeeIndex}`

  const resetMessage = () => {
    setMessage(null)
    setMessageType("idle")
  }

  const refreshFromDb = async () => {
    resetMessage()

    const response = await fetch("/api/admin/team", {
      method: "GET",
      cache: "no-store",
    })

    const payload = (await response.json()) as TeamApiResponse

    if (!response.ok || !payload.data) {
      setMessageType("error")
      setMessage(payload.error ?? "Failed to fetch team data")
      return
    }

    setFormData(cloneData(payload.data))
    setMessageType("success")
    setMessage("Loaded latest data from database")
  }

  const saveChanges = async () => {
    resetMessage()

    setIsSaving(true)

    try {
      const response = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: formData }),
      })

      const payload = (await response.json()) as TeamApiResponse

      if (!response.ok || !payload.data) {
        setMessageType("error")
        setMessage(payload.error ?? "Failed to save team data")
        return
      }

      setFormData(cloneData(payload.data))
      setMessageType("success")
      setMessage("Team data saved to database")
    } finally {
      setIsSaving(false)
    }
  }

  const updateMember = <K extends keyof TeamMemberProfile>(
    section: MemberSectionKey,
    memberIndex: number,
    field: K,
    value: TeamMemberProfile[K],
  ) => {
    setFormData((prev) => {
      const next = cloneData(prev)
      next[section][memberIndex][field] = value
      return next
    })
  }

  const updateSocial = (
    section: MemberSectionKey,
    memberIndex: number,
    socialIndex: number,
    field: "platform" | "url",
    value: string,
  ) => {
    setFormData((prev) => {
      const next = cloneData(prev)
      if (field === "platform") {
        next[section][memberIndex].socials[socialIndex].platform = value as TeamSocialLink["platform"]
      } else {
        next[section][memberIndex].socials[socialIndex].url = value
      }
      return next
    })
  }

  const addMember = (section: MemberSectionKey, idPrefix: string) => {
    setFormData((prev) => {
      const next = cloneData(prev)
      const created = createMember(idPrefix)
      next[section].push(created)

      const cardKey = getMemberCardKey(section, created, next[section].length - 1)
      setExpandedMembers((expandedPrev) => ({ ...expandedPrev, [cardKey]: true }))

      return next
    })
  }

  const removeMember = (section: MemberSectionKey, memberIndex: number) => {
    setFormData((prev) => {
      const next = cloneData(prev)
      next[section].splice(memberIndex, 1)
      return next
    })
  }

  const addSocial = (section: MemberSectionKey, memberIndex: number) => {
    setFormData((prev) => {
      const next = cloneData(prev)
      next[section][memberIndex].socials.push({ platform: "instagram", url: "" })
      return next
    })
  }

  const removeSocial = (section: MemberSectionKey, memberIndex: number, socialIndex: number) => {
    setFormData((prev) => {
      const next = cloneData(prev)
      next[section][memberIndex].socials.splice(socialIndex, 1)
      return next
    })
  }

  const updateCommittee = <K extends keyof TeamCommittee>(
    committeeIndex: number,
    field: K,
    value: TeamCommittee[K],
  ) => {
    setFormData((prev) => {
      const next = cloneData(prev)
      next.committees[committeeIndex][field] = value
      return next
    })
  }

  const addCommittee = () => {
    setFormData((prev) => {
      const next = cloneData(prev)
      const created = createCommittee()
      next.committees.push(created)

      const cardKey = getCommitteeCardKey(created, next.committees.length - 1)
      setExpandedCommittees((expandedPrev) => ({ ...expandedPrev, [cardKey]: true }))

      return next
    })
  }

  const removeCommittee = (committeeIndex: number) => {
    setFormData((prev) => {
      const next = cloneData(prev)
      next.committees.splice(committeeIndex, 1)
      return next
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Team content editor</h2>
        <p className="text-sm text-muted-foreground">
          Edit each section in a structured flow. Add or remove members, committees, and social links without touching JSON.
        </p>
      </div>

      <div className="space-y-6">
        {MEMBER_SECTIONS.map((section) => (
          <div key={section.key} className="space-y-3 rounded-lg border border-border bg-background/70 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">{section.label}</h3>
              <Button type="button" size="sm" variant="outline" onClick={() => addMember(section.key, section.idPrefix)}>
                <Plus className="size-3.5" aria-hidden />
                Add person
              </Button>
            </div>

            <div className="space-y-3">
              {formData[section.key].map((member, memberIndex) => (
                (() => {
                  const cardKey = getMemberCardKey(section.key, member, memberIndex)
                  const isExpanded = Boolean(expandedMembers[cardKey])

                  return (
                    <div key={cardKey} className="rounded-lg border border-border bg-card p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{member.name || "Untitled member"}</p>
                          <p className="text-xs text-muted-foreground">{member.role || "No role set"}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setExpandedMembers((prev) => ({
                                ...prev,
                                [cardKey]: !prev[cardKey],
                              }))
                            }
                          >
                            {isExpanded ? "Close" : "Edit"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMember(section.key, memberIndex)}
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {isExpanded ? (
                        <>
                          <div className="mb-3 mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                            <input
                              value={member.name}
                              onChange={(event) => updateMember(section.key, memberIndex, "name", event.target.value)}
                              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                              placeholder="Name"
                            />
                            <input
                              value={member.role}
                              onChange={(event) => updateMember(section.key, memberIndex, "role", event.target.value)}
                              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                              placeholder="Role"
                            />
                            <input
                              value={member.department}
                              onChange={(event) => updateMember(section.key, memberIndex, "department", event.target.value)}
                              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                              placeholder="Department"
                            />
                            <input
                              value={member.year ?? ""}
                              onChange={(event) => updateMember(section.key, memberIndex, "year", event.target.value || null)}
                              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                              placeholder="Year"
                            />
                          </div>

                          <div className="mb-3 grid gap-2 md:grid-cols-3">
                            <input
                              value={member.id}
                              onChange={(event) => updateMember(section.key, memberIndex, "id", event.target.value)}
                              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                              placeholder="ID"
                            />
                            <input
                              value={member.avatar}
                              onChange={(event) => updateMember(section.key, memberIndex, "avatar", event.target.value)}
                              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                              placeholder="Avatar initials"
                            />
                            <input
                              value={member.imageUrl ?? ""}
                              onChange={(event) => updateMember(section.key, memberIndex, "imageUrl", event.target.value || null)}
                              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                              placeholder="Profile image URL"
                            />
                          </div>

                          <textarea
                            value={member.bio}
                            onChange={(event) => updateMember(section.key, memberIndex, "bio", event.target.value)}
                            className="min-h-16 w-full rounded-md border border-input bg-background px-2 py-2 text-xs"
                            placeholder="Short bio"
                          />

                          <div className="mt-2 grid gap-2 md:grid-cols-2">
                            <input
                              value={member.focusAreas.join(", ")}
                              onChange={(event) =>
                                updateMember(
                                  section.key,
                                  memberIndex,
                                  "focusAreas",
                                  event.target.value
                                    .split(",")
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                                )
                              }
                              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                              placeholder="Focus areas (comma separated)"
                            />

                            <label className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-2 text-xs text-muted-foreground">
                              <input
                                type="checkbox"
                                checked={Boolean(member.isFounder)}
                                onChange={(event) => updateMember(section.key, memberIndex, "isFounder", event.target.checked)}
                              />
                              Founder
                            </label>
                          </div>

                          <div className="mt-3 rounded-md border border-border bg-background/80 p-2">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs font-medium text-foreground">Social links</p>
                              <Button type="button" size="sm" variant="ghost" onClick={() => addSocial(section.key, memberIndex)}>
                                <Plus className="size-3.5" aria-hidden />
                                Add social
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {member.socials.map((social, socialIndex) => (
                                <div key={`${member.id}-social-${socialIndex}`} className="grid gap-2 md:grid-cols-[10rem_1fr_auto]">
                                  <select
                                    value={social.platform}
                                    onChange={(event) =>
                                      updateSocial(section.key, memberIndex, socialIndex, "platform", event.target.value as TeamSocialLink["platform"])
                                    }
                                    className="h-8 rounded-md border border-input bg-card px-2 text-xs"
                                  >
                                    {SOCIAL_OPTIONS.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    value={social.url}
                                    onChange={(event) => updateSocial(section.key, memberIndex, socialIndex, "url", event.target.value)}
                                    className="h-8 rounded-md border border-input bg-card px-2 text-xs"
                                    placeholder="URL or handle"
                                  />
                                  <Button
                                    type="button"
                                    size="icon-sm"
                                    variant="ghost"
                                    onClick={() => removeSocial(section.key, memberIndex, socialIndex)}
                                    aria-label="Remove social"
                                  >
                                    <Trash2 className="size-3.5" aria-hidden />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )
                })()
              ))}

              {formData[section.key].length === 0 ? (
                <p className="rounded-md border border-dashed border-border bg-card px-3 py-4 text-xs text-muted-foreground">
                  No members in this section yet.
                </p>
              ) : null}
            </div>
          </div>
        ))}

        <div className="space-y-3 rounded-lg border border-border bg-background/70 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">Committees</h3>
            <Button type="button" size="sm" variant="outline" onClick={addCommittee}>
              <Plus className="size-3.5" aria-hidden />
              Add committee
            </Button>
          </div>

          <div className="space-y-3">
            {formData.committees.map((committee, committeeIndex) => {
              const cardKey = getCommitteeCardKey(committee, committeeIndex)
              const isExpanded = Boolean(expandedCommittees[cardKey])

              return (
                <div key={cardKey} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{committee.name || "Untitled committee"}</p>
                      <p className="text-xs text-muted-foreground">{committee.focus || "No focus set"}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExpandedCommittees((prev) => ({
                            ...prev,
                            [cardKey]: !prev[cardKey],
                          }))
                        }
                      >
                        {isExpanded ? "Close" : "Edit"}
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => removeCommittee(committeeIndex)}>
                        <Trash2 className="size-3.5" aria-hidden />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <>
                      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                        <input
                          value={committee.name}
                          onChange={(event) => updateCommittee(committeeIndex, "name", event.target.value)}
                          className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                          placeholder="Committee name"
                        />
                        <input
                          value={committee.id}
                          onChange={(event) => updateCommittee(committeeIndex, "id", event.target.value)}
                          className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                          placeholder="Committee ID"
                        />
                        <input
                          value={committee.focus}
                          onChange={(event) => updateCommittee(committeeIndex, "focus", event.target.value)}
                          className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                          placeholder="Focus"
                        />
                      </div>

                      <textarea
                        value={committee.description}
                        onChange={(event) => updateCommittee(committeeIndex, "description", event.target.value)}
                        className="mt-2 min-h-16 w-full rounded-md border border-input bg-background px-2 py-2 text-xs"
                        placeholder="Committee description"
                      />

                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        <input
                          value={committee.leads.join(", ")}
                          onChange={(event) =>
                            updateCommittee(
                              committeeIndex,
                              "leads",
                              event.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean),
                            )
                          }
                          className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                          placeholder="Leads (comma separated)"
                        />

                        <input
                          value={committee.openRoles.join(", ")}
                          onChange={(event) =>
                            updateCommittee(
                              committeeIndex,
                              "openRoles",
                              event.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean),
                            )
                          }
                          className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                          placeholder="Open roles (comma separated)"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              )
            })}

            {formData.committees.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-card px-3 py-4 text-xs text-muted-foreground">
                No committees yet.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={saveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save team data"}
        </Button>
        <Button type="button" variant="outline" onClick={refreshFromDb} disabled={isSaving}>
          Reload from database
        </Button>
      </div>

      {message ? (
        <p className={messageType === "error" ? "text-sm text-destructive" : "text-sm text-primary"}>{message}</p>
      ) : null}
    </div>
  )
}
