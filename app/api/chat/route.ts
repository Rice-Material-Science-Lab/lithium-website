import { google } from "@ai-sdk/google"
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
  stepCountIs,
} from "ai"
import { z } from "zod"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are the assistant embedded in the Battery Dendrites website,
a Rice University * Mesoscale Materials Science Group  website about lithium metal battery
simulator. Answer questions about the simulation, its parameters, and general
lithium battery / dendrite science concisely and helpfully. If asked something
unrelated, just answer normally as a helpful assistant. Feel free to use markdown, but avoid large headers as your response is being placed in a small window. Using code blocks is advised when possible to support responses.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      getMarkdownCode: tool({
        inputSchema: z.object({}),
        description: "Get code used to display your markdown responses",
        execute: async () => {
          const res = await fetch(
            "https://raw.githubusercontent.com/Rice-Material-Science-Lab/lithium-website/main/components/memoized-markdown.tsx"
          )
          const text = await res.text()
          return { text }
        },
      }),
      getSimCPPCode: tool({
        inputSchema: z.object({}),
        description:
          "Get backend code used to run the simulation. It is compiled to WASM then ran in the browser.",
        execute: async () => {
          const res = await fetch(
            "https://raw.githubusercontent.com/Rice-Material-Science-Lab/lithium-kmc/main/lkmc-wasm.cpp"
          )
          const text = await res.text()
          return { text }
        },
      }),
      getFrontendReactCode: tool({
        inputSchema: z.object({}),
        description:
          "Get frontend code that displays the sim. This file is quite large.",
        execute: async () => {
          const res = await fetch(
            "https://raw.githubusercontent.com/Rice-Material-Science-Lab/lithium-website/main/components/pages/sim-page/sim.tsx"
          )
          const text = await res.text()
          return { text }
        },
      }),
      getParamsCardCode: tool({
        inputSchema: z.object({}),
        description:
          "Get the code containing the params that the user can input.",
        execute: async () => {
          const res = await fetch(
            "https://raw.githubusercontent.com/Rice-Material-Science-Lab/lithium-website/main/components/pages/sim-page/cards/params-card.tsx"
          )
          const text = await res.text()
          return { text }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}