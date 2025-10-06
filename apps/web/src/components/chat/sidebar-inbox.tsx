import useSWR from "swr"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Conversation = {
  id: string
  name: string
  type: "person" | "group"
  avatar?: string
  lastMessage?: string
  unreadCount?: number
  pinned?: boolean
}

type InboxSidebarProps = {
  selectedId: string | null
  onSelect: (id: string) => void
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function InboxSidebar({ selectedId, onSelect }: InboxSidebarProps) {
  const { data, isLoading } = useSWR<{ conversations: Conversation[] }>("/api/conversations", fetcher)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!data?.conversations) return { people: [], groups: [] }
    const q = query.toLowerCase()
    const matches = data.conversations.filter((c) => c.name.toLowerCase().includes(q))
    return {
      people: matches.filter((c) => c.type === "person"),
      groups: matches.filter((c) => c.type === "group"),
    }
  }, [data, query])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="p-3 border-b border-border">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people, groups"
          aria-label="Search conversations"
          className="h-9"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <SectionHeader title="People" />
        {isLoading && <SkeletonRow />}
        {!isLoading && filtered.people.length === 0 && <EmptyRow label="No people found" />}
        <div role="list" aria-label="People conversations" className="pb-2">
          {filtered.people.map((c) => (
            <ConversationRow key={c.id} c={c} active={selectedId === c.id} onSelect={() => onSelect(c.id)} />
          ))}
        </div>

        <SectionHeader title="Groups" />
        {isLoading && <SkeletonRow />}
        {!isLoading && filtered.groups.length === 0 && <EmptyRow label="No groups found" />}
        <div role="list" aria-label="Group conversations" className="pb-2">
          {filtered.groups.map((c) => (
            <ConversationRow key={c.id} c={c} active={selectedId === c.id} onSelect={() => onSelect(c.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="px-2 py-1">
      <div className="h-12 w-full rounded-md bg-muted animate-pulse" />
    </div>
  )
}

function EmptyRow({ label }: { label: string }) {
  return <div className="px-3 py-2 text-sm text-muted-foreground">{label}</div>
}

function ConversationRow({
  c,
  active,
  onSelect,
}: {
  c: Conversation
  active: boolean
  onSelect: () => void
}) {
  const initials =
    c.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full px-2 py-1",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
      aria-current={active ? "true" : "false"}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-md p-2 text-left",
          active ? "bg-accent text-accent-foreground" : "hover:bg-muted/70",
        )}
      >
        <Avatar className="h-9 w-9">
          {c.avatar ? (
            <AvatarImage src={c.avatar || "/placeholder.svg"} alt={`${c.name} avatar`} />
          ) : (
            <AvatarImage src="/diverse-avatars.png" alt={`${c.name} avatar`} />
          )}
          <AvatarFallback aria-hidden="true">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{c.name}</p>
            {c.pinned && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                Pinned
              </Badge>
            )}
            {c.type === "group" && (
              <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                Group
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">{c.lastMessage || "No messages yet"}</p>
        </div>
        {c.unreadCount ? (
          <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
            {c.unreadCount}
          </span>
        ) : null}
      </div>
    </button>
  )
}
