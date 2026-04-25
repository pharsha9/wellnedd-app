import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@wellnedd.local" },
    update: {},
    create: { name: "Admin", email: "admin@wellnedd.local", hashedPassword: hash, role: Role.ADMIN },
  });

  const coaches = await Promise.all(
    ["Ava Coach", "Milo Coach", "Noah Coach"].map((name, i) =>
      prisma.user.upsert({
        where: { email: `coach${i + 1}@wellnedd.local` },
        update: {},
        create: { name, email: `coach${i + 1}@wellnedd.local`, hashedPassword: hash, role: Role.COACH },
      }),
    ),
  );

  const users = await Promise.all(
    Array.from({ length: 6 }).map((_, i) =>
      prisma.user.upsert({
        where: { email: `user${i + 1}@wellnedd.local` },
        update: {},
        create: { name: `User ${i + 1}`, email: `user${i + 1}@wellnedd.local`, hashedPassword: hash, role: Role.USER, points: 50 + i * 10 },
      }),
    ),
  );

  const stress = await prisma.program.upsert({
    where: { slug: "4-week-stress-reset" },
    update: {},
    create: {
      title: "4-Week Stress Reset",
      slug: "4-week-stress-reset",
      description: "Foundational stress management program.",
      category: "STRESS",
      estimatedDurationWeeks: 4,
      difficulty: "BEGINNER",
      modules: {
        create: [
          { order: 1, title: "Awareness", summary: "Understand stress triggers", lessons: { create: [{ order: 1, title: "Trigger mapping", content: "Notice patterns." }] } },
          { order: 2, title: "Recovery", summary: "Build daily resets", lessons: { create: [{ order: 1, title: "Breathing practice", content: "Box breathing." }] } },
        ],
      },
    },
  });

  await prisma.program.upsert({
    where: { slug: "sleep-better-3-weeks" },
    update: {},
    create: {
      title: "Sleep Better in 3 Weeks",
      slug: "sleep-better-3-weeks",
      description: "Practical sleep hygiene routines.",
      category: "SLEEP",
      estimatedDurationWeeks: 3,
      difficulty: "BEGINNER",
    },
  });

  await prisma.contentItem.upsert({
    where: { slug: "stress-basics" },
    update: {},
    create: { title: "Stress Basics", slug: "stress-basics", type: "ARTICLE", body: "Stress education and grounding tools.", tags: ["stress"], published: true },
  });
  await prisma.contentItem.upsert({
    where: { slug: "sleep-hygiene" },
    update: {},
    create: { title: "Sleep Hygiene", slug: "sleep-hygiene", type: "ARTICLE", body: "Daily sleep checklist.", tags: ["sleep"], published: true },
  });
  await prisma.contentItem.upsert({
    where: { slug: "breathing-exercise" },
    update: {},
    create: { title: "Breathing Exercise", slug: "breathing-exercise", type: "EXERCISE", body: "4-7-8 breathing", tags: ["mindfulness"], published: true },
  });

  for (const user of users) {
    for (let day = 0; day < 30; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);
      await prisma.wellnessCheckIn.upsert({
        where: { userId_date: { userId: user.id, date } },
        update: {},
        create: {
          userId: user.id,
          date,
          mood: 2 + (day % 3),
          stressLevel: 2 + (day % 4),
          energyLevel: 2 + (day % 3),
          sleepHours: 6 + (day % 3),
          sleepQuality: 2 + (day % 3),
          activityMinutes: 20 + (day % 40),
          tags: ["seeded"],
        },
      });
    }
    const habit = await prisma.habit.create({
      data: { userId: user.id, name: "Meditate 10 minutes", category: "MINDFULNESS", targetFrequency: 5 },
    });
    await prisma.goal.create({
      data: {
        userId: user.id,
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
    await prisma.programEnrollment.upsert({
      where: { userId_programId: { userId: user.id, programId: stress.id } },
      update: {},
      create: { userId: user.id, programId: stress.id, progressPercent: 35 },
    });
    await prisma.appointment.create({
      data: {
        userId: user.id,
        coachId: coaches[0].id,
        scheduledAt: new Date(Date.now() + 3 * 86400000),
        mode: "VIDEO",
      },
    });
    await prisma.message.create({
      data: {
        conversationId: `${user.id}-${coaches[0].id}`,
        senderId: user.id,
        recipientId: coaches[0].id,
        content: "Hi coach, I need support with sleep consistency.",
      },
    });
    await prisma.engagementEvent.create({
      data: { userId: user.id, type: "LOGIN", entityType: "Seed", entityId: habit.id },
    });
  }

  const rewardCount = await prisma.reward.count();
  if (rewardCount === 0) {
    await prisma.reward.createMany({
      data: [
        { name: "Mindful Mug", description: "Branded mug", pointsCost: 100, active: true },
        { name: "Yoga Mat", description: "Starter yoga mat", pointsCost: 250, active: true },
      ],
    });
  }

  console.log("Seed complete", { admin: admin.email, users: users.length, coaches: coaches.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
