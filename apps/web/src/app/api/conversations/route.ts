import { NextResponse } from "next/server"

type Conversation = {
  id: string
  name: string
  type: "person" | "group"
  lastMessage?: string
  unreadCount?: number
  pinned?: boolean
  avatar?: string
  members?: Array<{ id: string; name: string; avatar?: string }>
}

const conversationsSeed: Record<string, Conversation> = {
  u_1: {
    id: "u_1",
    name: "Alex Johnson",
    type: "person",
    lastMessage: "Let’s sync on the plan tomorrow morning.",
    unreadCount: 2,
    pinned: true,
  },
  u_2: {
    id: "u_2",
    name: "Taylor Kim",
    type: "person",
    lastMessage: "Meeting at 10?",
    unreadCount: 0,
  },
  g_1: {
    id: "g_1",
    name: "Design Team",
    type: "group",
    lastMessage: "Shared the latest Figma link in the thread.",
    unreadCount: 1,
    pinned: true,
    members: [
      { id: "u_3", name: "Jordan Lee" },
      { id: "u_4", name: "Sam Rivera" },
      { id: "you", name: "You" },
    ],
  },
  g_2: {
    id: "g_2",
    name: "Ops Channel",
    type: "group",
    lastMessage: "Deploy completed successfully.",
    unreadCount: 5,
    members: [
      { id: "u_5", name: "Priya Sharma" },
      { id: "u_6", name: "Chris Evans" },
    ],
  },
  u_5: {
    id: "u_5",
    name: "Maya Patel",
    type: "person",
    lastMessage: "Can you review the doc by EOD?",
    unreadCount: 1,
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const conversation = conversationsSeed[id]
    return NextResponse.json({ conversation: conversation || null })
  }

  const conversations = Object.values(conversationsSeed)
  return NextResponse.json({ conversations })
}
