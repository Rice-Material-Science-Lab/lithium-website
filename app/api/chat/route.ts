import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, UIMessage } from "ai"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are the assistant embedded in the Dendrite Lab website,
a Rice University Materials Science lab site about lithium metal battery
electrodeposition, dendrite growth, and the lab's kinetic Monte Carlo (KMC)
simulator. Answer questions about the simulation, its parameters, and general
lithium battery / dendrite science concisely and helpfully. If asked something
unrelated, just answer normally as a helpful assistant.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
