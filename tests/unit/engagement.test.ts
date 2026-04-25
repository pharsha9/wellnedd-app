import { describe, expect, it } from "vitest";
import { pointsForEvent } from "@/lib/engagement";

describe("pointsForEvent", () => {
  it("returns configured points per event", () => {
    expect(pointsForEvent("LOGIN")).toBe(1);
    expect(pointsForEvent("CHECKIN_CREATED")).toBe(5);
    expect(pointsForEvent("HABIT_COMPLETED")).toBe(2);
    expect(pointsForEvent("PROGRAM_PROGRESS")).toBe(10);
    expect(pointsForEvent("CONTENT_VIEWED")).toBe(1);
  });
});
