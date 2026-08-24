"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"

export default function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || status === "streaming" || status === "submitted") return
    sendMessage({ text })
    setInput("")
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon-sm"
        className={`hover:bg-white/10 ${open ? "text-white" : "text-white/70 hover:text-white"}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open chat assistant"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-3 flex h-110 w-96 flex-col rounded-2xl border border-border bg-card text-card-foreground">
          <div className="px-5 pt-5 pb-3">
            <p className="text-base font-bold text-foreground">Ask the Lab</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ask about the simulation or dendrite science.
            </p>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 pb-3"
          >
            {messages.length === 0 && (
              <p className="px-1 py-4 text-sm text-muted-foreground">
                Try asking &ldquo;what does the deposition rate parameter
                do?&rdquo;
              </p>
            )}

            {messages.map((m) => (
              <div key={m.id} className="text-sm leading-snug">
                <span className="mr-1 font-semibold text-foreground">
                  {m.role === "user" ? "You" : "Assistant"}:
                </span>
                <span className="text-foreground/90">
                  {m.parts
                    .map((part) => (part.type === "text" ? part.text : ""))
                    .join("")}
                </span>
              </div>
            ))}

            {(status === "submitted" || status === "streaming") &&
              messages[messages.length - 1]?.role === "user" && (
                <p className="text-sm text-muted-foreground">Thinking…</p>
              )}
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
            <Button
              type="submit"
              size="icon-sm"
              disabled={!input.trim() || status === "streaming" || status === "submitted"}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
