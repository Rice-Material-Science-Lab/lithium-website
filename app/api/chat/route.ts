import { markdownCode, simCPPCode } from "@/lib/tool-responses"
import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, UIMessage, tool, stepCountIs } from "ai"
import { z } from "zod"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are the assistant embedded in the Dendrite Lab website,
a Rice University Materials Science lab site about lithium metal battery
simulator. Answer questions about the simulation, its parameters, and general
lithium battery / dendrite science concisely and helpfully. If asked something
unrelated, just answer normally as a helpful assistant. Feel free to use markdown, but avoid large headers as your response is being placed in a small window.`

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
        execute: () => ({
          markdownCode,
        }),
      }),
      getSimCPPCode: tool({ 
        inputSchema: z.object({}),
        description: "Get backend code used to run the simulation. It is compiled to WASM then ran in the browser. Call getSimReactCode for more info.",
        execute: () => ({
          simCPPCode,
        }),
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
