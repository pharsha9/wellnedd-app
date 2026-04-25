import { describe, expect, it, vi, beforeEach } from "vitest";

const upsertMock = vi.fn();
const trackMock = vi.fn();

vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn().mockResolvedValue({ id: "user-1" }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wellnessCheckIn: {
      upsert: upsertMock,
    },
  },
}));

vi.mock("@/lib/engagement", () => ({
  trackEngagement: trackMock,
}));

describe("/api/check-ins POST", () => {
  beforeEach(() => {
    upsertMock.mockReset();
    trackMock.mockReset();
  });

  it("creates or updates today's check-in", async () => {
    upsertMock.mockResolvedValue({ id: "check-1", mood: 4 });
    const { POST } = await import("@/app/api/check-ins/route");
    const req = new Request("http://localhost/api/check-ins", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mood: 4,
        stressLevel: 2,
        energyLevel: 4,
        sleepHours: 7,
        sleepQuality: 4,
        activityMinutes: 35,
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data.id).toBe("check-1");
    expect(upsertMock).toHaveBeenCalledOnce();
    expect(trackMock).toHaveBeenCalledOnce();
  });
});
