"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react"
import { useState } from "react"

interface QuizQuestion {
  id: string
  prompt: string
  options: { id: string; text: string }[]
  correctId: string
  explanation: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What primarily causes lithium dendrites to form during charging?",
    options: [
      { id: "a", text: "Uneven deposition of lithium ions on the anode" },
      { id: "b", text: "Overheating of the cathode" },
      { id: "c", text: "Excess electrolyte volume" },
      { id: "d", text: "The separator aging over time" },
    ],
    correctId: "a",
    explanation:
      "Dendrites start when lithium plates unevenly instead of as a smooth layer, building up at microscopic high points.",
  },
  {
    id: "q2",
    prompt: "What's the main danger dendrites pose to a battery?",
    options: [
      { id: "a", text: "They make the battery lighter" },
      {
        id: "b",
        text: "They can pierce the separator and short-circuit the cell",
      },
      { id: "c", text: "They increase the battery's voltage" },
      { id: "d", text: "They speed up charging time" },
    ],
    correctId: "b",
    explanation:
      "Once a dendrite bridges the gap between electrodes, it creates a direct short circuit that can trigger thermal runaway.",
  },
  {
    id: "q3",
    prompt:
      "Which battery chemistry is generally most resistant to thermal runaway?",
    options: [
      { id: "a", text: "NMC" },
      { id: "b", text: "LFP" },
      { id: "c", text: "Lead-acid" },
    ],
    correctId: "b",
    explanation:
      "LFP (lithium iron phosphate) is known for higher thermal stability than NMC chemistries, though it trades off some energy density.",
  },
  {
    id: "q4",
    prompt: "What does the SEI layer do?",
    options: [
      { id: "a", text: "Measures battery health remotely" },
      {
        id: "b",
        text: "Forms a protective film on the anode from electrolyte breakdown",
      },
      { id: "c", text: "Physically separates the anode and cathode" },
      { id: "d", text: "Speeds up electron flow to the cathode" },
    ],
    correctId: "b",
    explanation:
      "The Solid Electrolyte Interphase is a thin passivation layer that strongly influences how evenly lithium plates on the anode.",
  },
  {
    id: "q5",
    prompt: "Which charging habit helps reduce dendrite risk?",
    options: [
      { id: "a", text: "Fast-charging every time" },
      { id: "b", text: "Charging in freezing temperatures" },
      { id: "c", text: "Charging at moderate rates and avoiding extremes" },
      { id: "d", text: "Leaving the battery at 100% for weeks" },
    ],
    correctId: "c",
    explanation:
      "Moderate charging rates and temperatures give lithium ions time to settle evenly, which is the single biggest lever a user controls.",
  },
  {
    id: "q6",
    prompt: "Which anode material is least likely to grow dendrites?",
    options: [
      { id: "a", text: "Lithium metal" },
      { id: "b", text: "Graphite" },
      { id: "c", text: "Lithium titanate (LTO)" },
      { id: "d", text: "Silicon" },
    ],
    correctId: "c",
    explanation:
      "LTO works at a voltage far above where lithium metal forms, so plating is very unlikely. The trade-off is much lower energy density.",
  },
]


function ScoreRing({ score, total }: { score: number; total: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const pct = score / total
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="stroke-foreground/10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="stroke-primary dark:stroke-cyan-400"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-4xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">of {total}</span>
      </div>
    </div>
  )
}

export default function QuizSection() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)

  const question = quizQuestions[index]
  const selected = answers[question.id] ?? null
  const isLast = index === quizQuestions.length - 1
  const score = quizQuestions.filter((q) => answers[q.id] === q.correctId).length
  const answeredCount = Object.keys(answers).length
  const missed = quizQuestions.filter((q) => answers[q.id] && answers[q.id] !== q.correctId)

  function handleSelect(optionId: string) {
    if (selected) return
    setAnswers((a) => ({ ...a, [question.id]: optionId }))
  }

  function handleNext() {
    if (isLast) setFinished(true)
    else setIndex((i) => i + 1)
  }

  function handleRestart() {
    setIndex(0)
    setAnswers({})
    setFinished(false)
  }

  const slide = reduced
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)] sm:p-10">
      <div className="mb-8 flex gap-1.5" aria-hidden>
        {quizQuestions.map((q, i) => {
          const a = answers[q.id]
          return (
            <span
              key={q.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-500",
                a && a === q.correctId && "bg-emerald-500",
                a && a !== q.correctId && "bg-red-400",
                !a && i === index && !finished && "bg-primary/50 dark:bg-cyan-500/50",
                !a && (i !== index || finished) && "bg-foreground/10"
              )}
            />
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {finished ? (
          <motion.div key="done" {...slide} className="flex flex-col items-center gap-6 text-center">
            <ScoreRing score={score} total={quizQuestions.length} />
            <div>
              <p className="text-xl font-bold text-foreground">
                {score === quizQuestions.length
                  ? "Perfect score. You know your dendrites."
                  : score >= quizQuestions.length - 2
                    ? "Nicely done."
                    : "Good start. Here's what to revisit."}
              </p>
            </div>
            {missed.length > 0 && (
              <ul className="w-full max-w-xl space-y-2 text-left">
                {missed.map((q) => (
                  <li key={q.id} className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-sm font-semibold text-foreground">{q.prompt}</p>
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      {q.options.find((o) => o.id === q.correctId)?.text}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{q.explanation}</p>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" />
              Retake quiz
            </button>
          </motion.div>
        ) : (
          <motion.div key={question.id} {...slide} className="space-y-6">
            <div>
              <p className="font-mono text-xs font-semibold text-muted-foreground">
                Question {index + 1} / {quizQuestions.length}
              </p>
              <p className="mt-2 font-heading text-xl leading-snug font-bold text-foreground sm:text-2xl">
                {question.prompt}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {question.options.map((opt, oi) => {
                const isCorrect = opt.id === question.correctId
                const isChosen = opt.id === selected
                const revealed = selected !== null

                return (
                  <motion.button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    disabled={revealed}
                    animate={
                      revealed && isChosen && !isCorrect && !reduced
                        ? { x: [0, -6, 6, -4, 4, 0] }
                        : { x: 0 }
                    }
                    transition={{ duration: 0.4 }}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition-colors",
                      !revealed && "border-border bg-background hover:border-primary/50 hover:bg-primary/5 dark:hover:border-cyan-500/50",
                      revealed && isCorrect && "border-emerald-500 bg-emerald-500/10",
                      revealed && isChosen && !isCorrect && "border-destructive bg-red-500/10",
                      revealed && !isCorrect && !isChosen && "border-border opacity-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-colors",
                        !revealed && "border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary dark:group-hover:text-cyan-400",
                        revealed && isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                        revealed && isChosen && !isCorrect && "border-destructive bg-destructive text-white",
                        revealed && !isCorrect && !isChosen && "border-border text-muted-foreground"
                      )}
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1 text-foreground">{opt.text}</span>
                    {revealed && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                    {revealed && isChosen && !isCorrect && <XCircle className="h-5 w-5 shrink-0 text-destructive" />}
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span
                      className={cn(
                        "font-semibold",
                        selected === question.correctId
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-destructive"
                      )}
                    >
                      {selected === question.correctId ? "Correct. " : "Not quite. "}
                    </span>
                    {question.explanation}
                  </p>
                  <button
                    type="button"
                    onClick={handleNext}
                    autoFocus
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 dark:bg-cyan-600"
                  >
                    {isLast ? "See my score" : "Next question"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="sr-only" aria-live="polite">
        {answeredCount} of {quizQuestions.length} answered, {score} correct
      </p>
    </div>
  )
}