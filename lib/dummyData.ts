import { prisma } from "@/lib/prisma";

export async function generateDummyDataForUser(userId: string) {
  // Check if user already has check-ins. If so, skip generation to avoid duplicate effort.
  const existingCheckIns = await prisma.wellnessCheckIn.count({ where: { userId } });
  if (existingCheckIns > 0) return;

  // Generate 30 days of check-ins
  for (let day = 0; day < 30; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    await prisma.wellnessCheckIn.upsert({
      where: { userId_date: { userId, date } },
      update: {},
      create: {
        userId,
        date,
        mood: 2 + (day % 3),
        stressLevel: 2 + (day % 4),
        energyLevel: 2 + (day % 3),
        sleepHours: 6 + (day % 3),
        sleepQuality: 2 + (day % 3),
        activityMinutes: 20 + (day % 40),
        tags: ["generated"],
      },
    });
  }

  // Create Habit
  const habit = await prisma.habit.create({
    data: { userId, name: "Meditate 10 minutes", category: "MINDFULNESS", targetFrequency: 5 },
  });

  // Create Goal
  await prisma.goal.create({
    data: {
      userId,
      title: "Lower stress score",
      category: "MINDFULNESS",
      startDate: new Date(),
      targetDate: new Date(Date.now() + 45 * 86400000),
      targetMetric: "stress rating",
      baselineValue: 4,
      targetValue: 2,
      currentValue: 3.5,
    },
  });

  // Find a program to enroll in
  const program = await prisma.program.findFirst({ where: { slug: "4-week-stress-reset" } }) || await prisma.program.findFirst();
  if (program) {
    await prisma.programEnrollment.upsert({
      where: { userId_programId: { userId, programId: program.id } },
      update: {},
      create: { userId, programId: program.id, progressPercent: 35 },
    });
  }

  // Find a coach for an appointment
  const coach = await prisma.user.findFirst({ where: { role: "COACH" } });
  if (coach) {
    await prisma.appointment.create({
      data: {
        userId,
        coachId: coach.id,
        scheduledAt: new Date(Date.now() + 3 * 86400000),
        mode: "VIDEO",
      },
    });
    
    await prisma.message.create({
      data: {
        conversationId: `${userId}-${coach.id}`,
        senderId: userId,
        recipientId: coach.id,
        content: "Hi coach, I'm looking forward to our first session!",
      },
    });
  }

  // Add an initial engagement event
  await prisma.engagementEvent.create({
    data: { userId, type: "LOGIN", entityType: "Onboarding", entityId: habit.id },
  });
}
