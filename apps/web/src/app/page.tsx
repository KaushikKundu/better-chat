"use client"

import { useState } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import { InboxSidebar } from "@/components/chat/sidebar-inbox"
import { ChatPanel } from "@/components/chat/chat-panel"
import { DetailsPanel } from "@/components/chat/details-panel"
import { ModeToggle } from "@/components/mode-toggle"

export default function Page() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            {/* <img src="/chat-logo.png" alt="Chat app logo" className="h-5 w-5" /> */}
            <span className="text-sm font-medium">Chat</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <InboxSidebar selectedId={selectedId} onSelect={setSelectedId} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex justify-between w-full items-center">

            <h1 className="text-pretty text-base font-semibold md:text-lg">Inbox</h1>
            <ModeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="h-full w-full flex">
            <section className="flex-1 min-w-0">
              <ChatPanel conversationId={selectedId} />
            </section>
            <aside className="hidden lg:block lg:w-80 xl:w-96 border-l border-border bg-background/60">
              <DetailsPanel conversationId={selectedId} />
            </aside>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
