import { NextResponse } from "next/server"

const seedMessages: Record<
  string,
  Array<{
    id: string
    conversationId: string
    author: { id: string; name: string; avatar?: string; isYou?: boolean }
    content: string
    createdAt: string
  }>
> = {
  u_1: [
    {
      id: "m1",
      conversationId: "u_1",
      author: { id: "u_1", name: "Alex Johnson" },
      content: "Hey! Did you see the update?",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "m2",
      conversationId: "u_1",
      author: { id: "you", name: "You", isYou: true },
      content: "Yep, looks great. Ship it?",
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: "m3",
      conversationId: "u_1",
      author: { id: "u_1", name: "Alex Johnson" },
      content: "Sounds good, thanks!",
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
  ],
  u_2: [
    {
      id: "m1",
      conversationId: "u_2",
      author: { id: "u_2", name: "Taylor Kim" },
      content: "Meeting at 10?",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  ],
  g_1: [
    {
      id: "m1",
      conversationId: "g_1",
      author: { id: "u_3", name: "Jordan Lee" },
      content: "Pushed new PR for review",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "m2",
      conversationId: "g_1",
      author: { id: "you", name: "You", isYou: true },
      content: "Nice! I will take a look.",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
  g_2: [
    {
      id: "m1",
      conversationId: "g_2",
      author: { id: "u_4", name: "Sam Rivera" },
      content: "Updated Figma styles",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ],
  u_5: [
    {
      id: "m1",
      conversationId: "u_5",
      author: { id: "u_5", name: "Maya Patel" },
      content: "Can you review the doc by EOD?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversationId")

  if (!conversationId) {
    return NextResponse.json({ messages: [] })
  }

  const messages = seedMessages[conversationId] || []
  return NextResponse.json({ messages })
}
