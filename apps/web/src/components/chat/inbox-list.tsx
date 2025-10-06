"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ConversationItem } from "./conversation-item"
import { SearchInput } from "./search-input"

type Conversation = {
  id: string
  name: string
  lastMessage: string
  timestamp: string // ISO
  unreadCount: number
  isPinned?: boolean
  avatarUrl?: string | null
  online?: boolean
}

type ApiResponse = { conversations: Conversation[] }

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<ApiResponse>)

const FILTERS = ["All", "Unread", "Pinned"] as const
type Filter = (typeof FILTERS)[number]

export function InboxList() {
  const { data, error, isLoading } = useSWR<ApiResponse>("/api/conversations", fetcher, {
    revalidateOnFocus: false,
  })
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("All")

  const conversations = data?.conversations ?? []

  const filtered = useMemo(() => {
    let list = conversations
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q))
    }
    if (filter === "Unread") {
      list = list.filter((c) => c.unreadCount > 0)
    } else if (filter === "Pinned") {
      list = list.filter((c) => c.isPinned)
    }
    // Pinned first, then unread, then by time desc
    return [...list].sort((a, b) => {
      if ((b.isPinned ? 1 : 0) !== (a.isPinned ? 1 : 0)) return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
      if ((b.unreadCount > 0 ? 1 : 0) !== (a.unreadCount > 0 ? 1 : 0))
        return (b.unreadCount > 0 ? 1 : 0) - (a.unreadCount > 0 ? 1 : 0)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }, [conversations, query, filter])

  return (
    <section aria-labelledby="inbox-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 id="inbox-heading" className="sr-only">
          Conversations
        </h2>
        <SearchInput value={query} onChange={setQuery} placeholder="Search conversations" />
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={f === filter ? "default" : "secondary"}
              onClick={() => setFilter(f)}
              aria-pressed={f === filter}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div role="list" aria-label="Conversation list" className="divide-y divide-border rounded-lg border bg-card">
        {isLoading && !data && <div className="p-4 text-sm text-muted-foreground">Loading…</div>}
        {error && <div className="p-4 text-sm text-destructive">Failed to load conversations</div>}
        {!isLoading && filtered.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">No conversations.</div>
        )}
        {filtered.map((c) => (
          <ConversationItem key={c.id} convo={c} />
        ))}
      </div>
    </section>
  )
}
