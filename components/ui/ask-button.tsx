"use client"

import { ArrowRight, MessageSquare } from "lucide-react"
import { askTheLab } from "@/lib/ask-the-lab"
import { cn } from "@/lib/utils"

/** A small pill that opens the "Ask the Lab" chat with this question already asked. */
export function AskButton({
  question,
  className,
}: {
  question: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => askTheLab(question)}
      className={cn(
        "print-hide group/ask inline-flex max-w-full items-center gap-2 rounded-full border border-brand/25 bg-brand/5 py-2.5 pr-3.5 pl-1.5 text-left text-sm text-foreground/85 transition-all hover:border-brand/50 hover:bg-brand/10 hover:text-foreground",
        className
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
        <MessageSquare className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">
        <span className="font-semibold text-brand">Ask about this:</span>{" "}
        {question}
      </span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-50 transition-transform group-hover/ask:translate-x-0.5 group-hover/ask:opacity-100" />
    </button>
  )
}