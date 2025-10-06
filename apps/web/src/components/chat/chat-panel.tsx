"use client"

import useSWR from "swr"
import { useEffect, useMemo, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: string
  conversationId: string
  author: { id: string; name: string; avatar?: string; isYou?: boolean }
  content: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ChatPanel({ conversationId }: { conversationId: string | null }) {
  const { data } = useSWR<{ messages: Message[] }>(
    conversationId ? `/api/messages?conversationId=${conversationId}` : null,
    fetcher,
  )

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [data?.messages?.length, conversationId])

  const title = useMemo(() => {
    if (!data?.messages || data.messages.length === 0) return "Select a conversation"
    const first = data.messages[0]
    return first.author.isYou ? "You" : first.author.name
  }, [data])

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-pretty truncate">{title}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Search
          </Button>
          <Button variant="ghost" size="sm">
            More
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {!conversationId && (
          <div className="h-full w-full grid place-items-center">
            <p className="text-sm text-muted-foreground">Choose a conversation from the left to start chatting.</p>
          </div>
        )}

        {conversationId && (
          <div className="space-y-3">
            {data?.messages?.map((m) => (
              <MessageBubble key={m.id} m={m} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder={conversationId ? "Write a message..." : "Select a conversation to write..."}
            aria-label="Message input"
            disabled={!conversationId}
          />
          <Button type="submit" disabled={!conversationId}>
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}

function MessageBubble({ m }: { m: Message }) {
  const isYou = m.author.isYou
  const initials =
    m.author.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"

  return (
    <div className="flex items-start gap-3">
      {!isYou && (
        <Avatar className="h-8 w-8 mt-0.5">
          {m.author.avatar ? (
            <AvatarImage src={m.author.avatar || "/placeholder.svg"} alt={`${m.author.name} avatar`} />
          ) : (
            <AvatarImage src="/diverse-avatars.png" alt={`${m.author.name} avatar`} />
          )}
          <AvatarFallback aria-hidden="true">{initials}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[75%] rounded-md px-3 py-2 ${isYou ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}
      >
        {!isYou && <p className="text-xs font-medium mb-0.5">{m.author.name}</p>}
        <p className="text-sm leading-6">{m.content}</p>
        <p className={`mt-1 text-[10px] ${isYou ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      {isYou && (
        <Avatar className="h-8 w-8 mt-0.5">
          <AvatarImage src="/ai-avatar.png" alt="Your avatar" />
          <AvatarFallback aria-hidden="true">You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
