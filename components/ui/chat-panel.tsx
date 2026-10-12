"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useChat } from "@ai-sdk/react"
import { MessageSquare, Send, X } from "lucide-react"
import { ASK_THE_LAB_EVENT, type AskTheLabDetail } from "@/lib/ask-the-lab"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Bubble, BubbleContent } from "./bubble"
import { MemoizedMarkdown } from "../memoized-markdown"

export default function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [floating, setFloating] = useState(false)
  const [input, setInput] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat()
  const busy = status === "streaming" || status === "submitted"
  const busyRef = useRef(busy)
  useEffect(() => {
    busyRef.current = busy
  }, [busy])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const t = e.target as Node
      if (ref.current?.contains(t) || panelRef.current?.contains(t)) return
      if (!floating) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [floating])

  useEffect(() => {
    function handleAsk(e: Event) {
      const { question } = (e as CustomEvent<AskTheLabDetail>).detail
      setFloating(true)
      setOpen(true)
      if (question && !busyRef.current) sendMessage({ text: question })
    }
    window.addEventListener(ASK_THE_LAB_EVENT, handleAsk)
    return () => window.removeEventListener(ASK_THE_LAB_EVENT, handleAsk)
  }, [sendMessage])

  function close() {
    setOpen(false)
    setFloating(false)
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    sendMessage({ text })
    setInput("")
  }

  const panel = open ? (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Ask the Lab"
      className={cn(
        "z-50 flex h-110 flex-col rounded-2xl border border-border bg-card/95 text-card-foreground shadow-lg ring-1 ring-foreground/10 backdrop-blur-xl",
        floating
          ? "fixed right-4 bottom-4 max-h-[calc(100dvh-2rem)] w-[min(24rem,calc(100vw-2rem))] shadow-[0_24px_64px_-20px_rgb(0_0_0/0.45)] sm:right-6 sm:bottom-6"
          : "absolute top-full right-0 mt-3 w-96"
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 pt-5 pb-3">
        <div>
          <p className="font-heading text-base font-bold text-foreground">
            Ask the Lab
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ask about the simulation or dendrite science.
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close chat"
          className="-mt-1 -mr-2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <MessageScroller className="h-full">
          <MessageScrollerViewport ref={scrollRef} className="h-full px-4 py-4">
            <MessageScrollerContent className="space-y-4 pb-6">
              {messages.length === 0 && (
                <MessageScrollerItem>
                  <p className="px-1 py-4 text-sm text-muted-foreground">
                    Try asking &ldquo;what does the deposition rate parameter
                    do?&rdquo;
                  </p>
                </MessageScrollerItem>
              )}

              {messages.map((m) => (
                <MessageScrollerItem
                  key={m.id}
                  messageId={m.id}
                  scrollAnchor={m.role === "user"}
                >
                  <Message>
                    <MessageContent>
                      <Bubble
                        variant={m.role === "user" ? "default" : "secondary"}
                        align={m.role === "user" ? "end" : "start"}
                      >
                        <BubbleContent>
                          <div className="overflow-x-auto text-sm leading-relaxed">
                            <span className="dark:text-foreground/90">
                              <MemoizedMarkdown
                                content={m.parts
                                  .map((part) =>
                                    part.type === "text" ? part.text : ""
                                  )
                                  .join("")}
                              />
                            </span>
                          </div>
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}

              {busy && messages[messages.length - 1]?.role === "user" && (
                <MessageScrollerItem>
                  <p className="px-1 text-sm text-muted-foreground">
                    Thinking…
                  </p>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>

        <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
          <div className="pointer-events-auto">
            <MessageScrollerButton />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          className="h-9"
        />
        <Button type="submit" size="icon-sm" disabled={!input.trim() || busy}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  ) : null

  return (
    <MessageScrollerProvider autoScroll>
      <div className="relative" ref={ref}>
        <Button
          variant="ghost"
          size="icon-sm"
          className={`hover:bg-primary-foreground/10 ${open ? "text-primary-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}
          onClick={() => {
            setFloating(false)
            setOpen((prev) => !(prev && !floating))
          }}
          aria-label="Open chat assistant"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        {floating && panel ? createPortal(panel, document.body) : panel}
      </div>
    </MessageScrollerProvider>
  )
}
