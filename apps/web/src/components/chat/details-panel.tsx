import useSWR from "swr"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type Conversation = {
  id: string
  name: string
  type: "person" | "group"
  avatar?: string
  members?: Array<{ id: string; name: string; avatar?: string }>
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DetailsPanel({ conversationId }: { conversationId: string | null }) {
  const { data } = useSWR<{ conversation: Conversation }>(
    conversationId ? `/api/conversations?id=${conversationId}` : null,
    fetcher,
  )

  if (!conversationId) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 text-sm text-muted-foreground">
        Select a conversation to see details.
      </div>
    )
  }

  const c = data?.conversation
  const initials =
    c?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {c?.avatar ? (
              <AvatarImage src={c.avatar || "/placeholder.svg"} alt={`${c?.name} avatar`} />
            ) : (
              <AvatarImage src="/conversation-avatar.jpg" alt={`${c?.name} avatar`} />
            )}
            <AvatarFallback aria-hidden="true">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{c?.name || "Conversation"}</p>
            <p className="text-xs text-muted-foreground">{c?.type === "group" ? "Group" : "Direct Message"}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">
              Pin
            </Button>
            <Button size="sm" variant="outline">
              Mute
            </Button>
            <Button size="sm" variant="outline">
              Leave
            </Button>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Members</h3>
          <div className="space-y-2">
            {(c?.members || []).map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  {m.avatar ? (
                    <AvatarImage src={m.avatar || "/placeholder.svg"} alt={`${m.name} avatar`} />
                  ) : (
                    <AvatarImage src="/member-avatar.jpg" alt={`${m.name} avatar`} />
                  )}
                  <AvatarFallback aria-hidden="true">
                    {m.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm">{m.name}</p>
              </div>
            ))}
            {(!c?.members || c.members.length === 0) && (
              <p className="text-sm text-muted-foreground">No members to show.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
