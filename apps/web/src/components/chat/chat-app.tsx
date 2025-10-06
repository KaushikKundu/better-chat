import { InboxSidebar } from "./sidebar-inbox"
import { ChatPanel } from "./chat-panel"
import { DetailsPanel } from "./details-panel"

type ChatAppProps = {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ChatApp({ selectedId, onSelect }: ChatAppProps) {
  // Left: inbox (md+), Middle: chat (always), Right: details (lg+)
  return (
    <div className="h-full w-full flex">
      {/* Left sidebar (Inbox) */}
      <aside className="hidden md:flex md:w-72 lg:w-80 xl:w-88 border-r border-border bg-background/60">
        <InboxSidebar selectedId={selectedId} onSelect={onSelect} />
      </aside>

      {/* Middle chat panel */}
      <section className="flex-1 min-w-0 flex">
        <ChatPanel conversationId={selectedId} />
      </section>

      {/* Right details panel */}
      <aside className="hidden lg:flex lg:w-80 xl:w-96 border-l border-border bg-background/60">
        <DetailsPanel conversationId={selectedId} />
      </aside>
    </div>
  )
}
