import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { chatModel, SYSTEM_PROMPT } from "@/lib/ai-config";
import { getProjectDetails } from "@/lib/tools/getProjectDetails";

// Route handlers that stream must not be statically optimized.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: chatModel,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      getProjectDetails,
    },
  });

  // By default the AI SDK redacts thrown error details for security.
  // We want our designed error state to show the actual message, so we
  // explicitly pass it through here.
  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (error instanceof Error) return error.message;
      return "Something went wrong running that tool.";
    },
  });
}