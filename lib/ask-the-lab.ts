export const ASK_THE_LAB_EVENT = "ask-the-lab"

export type AskTheLabDetail = { question: string }

export function askTheLab(question: string) {
  window.dispatchEvent(
    new CustomEvent<AskTheLabDetail>(ASK_THE_LAB_EVENT, { detail: { question } })
  )
}