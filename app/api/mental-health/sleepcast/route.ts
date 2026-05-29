import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { generateSleepcast } from "@/lib/gemma";

const sleepcastSchema = z.object({
  worryText: z.string().min(1, "Please provide what is on your mind."),
  theme: z.string().default("Rainy Mountain Cabin"),
  style: z.string().default("Deep Calming Voice"),
});

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const parsed = sleepcastSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0].message);
    }

    const { worryText, theme, style } = parsed.data;

    // Call Gemma 4 natively to generate the bedtime sleepcast
    const story = await generateSleepcast(worryText, theme, style);

    return ok({ story });
  } catch (error) {
    console.error("Gemma Sleepcast API Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to generate sleepcast.";
    return fail(msg, 500);
  }
}
