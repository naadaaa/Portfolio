import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { chatModel, SYSTEM_PROMPT } from "@/lib/ai-config";

// Route handlers that stream must not be statically optimized.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: chatModel,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  // toUIMessageStreamResponse gives us the SSE stream shape useChat expects
  // on the client, including support for the built-in stop button.
  return result.toUIMessageStreamResponse();
}