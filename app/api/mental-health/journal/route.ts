import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { trackEngagement } from "@/lib/engagement";
import { analyzeJournal } from "@/lib/gemma";

const journalSchema = z.object({
  content: z.string().min(10, "Journal entry must be at least 10 characters long."),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 50,
    });
    return ok(entries);
  } catch (error) {
    console.error("GET Journal Entry Error:", error);
    return fail("Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = journalSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0].message);
    }

    const { content } = parsed.data;

    // Call Gemma 4 for native AI analysis of the journal
    const analysis = await analyzeJournal(content);

    // Save entry to the database
    const result = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content,
        moodAnalysis: analysis as unknown as Prisma.InputJsonValue,
        recommendedSteps: analysis.copingSteps as unknown as Prisma.InputJsonValue,
      },
    });

    // Award +15 points to user for completing a journal analysis
    await trackEngagement(user.id, "JOURNAL_ANALYZED", {
      entityType: "JournalEntry",
      entityId: result.id,
    });

    return ok(result, 201);
  } catch (error) {
    console.error("POST Journal Entry Error:", error);
    return fail("An error occurred while analyzing your journal.", 500);
  }
}
