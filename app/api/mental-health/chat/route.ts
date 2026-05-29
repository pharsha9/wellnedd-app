import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { chatWithGemma } from "@/lib/gemma";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "model"]),
      content: z.string().min(1),
    })
  ),
  focusArea: z.string().default("general"),
});

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0].message);
    }

    const { messages, focusArea } = parsed.data;

    // Send context-aware history to Gemma 4 natively
    const reply = await chatWithGemma(messages, focusArea);

    return ok({ reply });
  } catch (error) {
    console.error("Gemma Chat API Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to communicate with Gemma 4.";
    return fail(msg, 500);
  }
}
