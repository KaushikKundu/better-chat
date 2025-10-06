"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Props = {
  convo: {
    id: string
    name: string
    lastMessage: string
    timestamp: string // ISO
    unreadCount: number
    isPinned?: boolean
    avatarUrl?: string | null
    online?: boolean
  }
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" })
}

export function ConversationItem({ convo }: Props) {
  const initials = convo.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <article
      role="listitem"
      className={cn("flex cursor-pointer items-center gap-3 p-4 transition-colors", "hover:bg-accent")}
      aria-label={`${convo.name}, ${convo.unreadCount > 0 ? "unread" : "read"}`}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={convo.avatarUrl ?? undefined} alt={`${convo.name} avatar`} />
          <AvatarFallback aria-label={`${convo.name} initials`}>{initials}</AvatarFallback>
        </Avatar>
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-card",
            convo.online ? "bg-emerald-500" : "bg-muted",
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("truncate font-medium", convo.unreadCount > 0 && "text-primary")}>{convo.name}</p>
          <time className="shrink-0 text-xs text-muted-foreground">{formatTime(convo.timestamp)}</time>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm text-muted-foreground",
              convo.unreadCount > 0 && "font-medium text-foreground",
            )}
          >
            {convo.lastMessage}
          </p>
          {convo.unreadCount > 0 && (
            <Badge variant="default" className="shrink-0" aria-label={`${convo.unreadCount} unread messages`}>
              {convo.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </article>
  )
}
