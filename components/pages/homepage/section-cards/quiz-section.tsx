import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react"
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
]

export default function QuizSection() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = quizQuestions[index]
  const isLast = index === quizQuestions.length - 1

  function handleSelect(optionId: string) {
    if (selected) return
    setSelected(optionId)
    if (optionId === question.correctId) setScore((s) => s + 1)
  }

  function handleNext() {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  function handleRestart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  return (
    <Card className="max-w-8/10 space-y-4 rounded-2xl p-8 shadow-sm">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Check yourself
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Quick dendrite quiz
        </h2>
      </div>

      {finished ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-3xl font-bold text-foreground">
            {score} / {quizQuestions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {score === quizQuestions.length
              ? "Perfect score — you know your dendrites."
              : "Nice work. Scroll back up for a refresher on anything you missed."}
          </p>
          <Button onClick={handleRestart} variant="outline" className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Retake Quiz
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground">
            Question {index + 1} of {quizQuestions.length}
          </p>
          <p className="text-base font-semibold text-foreground">
            {question.prompt}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {question.options.map((opt: any) => {
              const isCorrect = opt.id === question.correctId
              const isChosen = opt.id === selected
              const revealed = selected !== null

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={revealed}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    !revealed && "border-border hover:border-primary/50",
                    revealed && isCorrect && "border-green-500 bg-green-500/10",
                    revealed &&
                      isChosen &&
                      !isCorrect &&
                      "border-destructive bg-red-500/10",
                    revealed &&
                      !isCorrect &&
                      !isChosen &&
                      "border-border opacity-60"
                  )}
                >
                  <span>{opt.text}</span>
                  {revealed && isCorrect && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  )}
                  {revealed && isChosen && !isCorrect && (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                  )}
                </button>
              )
            })}
          </div>

          {selected && (
            <div className="space-y-3 rounded-xl bg-muted/50 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {question.explanation}
              </p>
              <Button onClick={handleNext} size="sm">
                {isLast ? "See Score" : "Next Question"}
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
