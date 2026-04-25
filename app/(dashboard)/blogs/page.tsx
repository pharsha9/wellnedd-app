"use client";

import { useState } from "react";
import { FadeIn } from "@/components/fade-in";
import { BookOpen, Clock, Tag, Sun, Search } from "lucide-react";

const DAILY_TIPS = [
  "Start your morning with a glass of lukewarm water to kickstart your metabolism.",
  "Take 5 deep breaths before any stressful meeting — it activates your parasympathetic system.",
  "Stand up and stretch every 45 minutes of sitting to reduce back tension.",
  "Replace an afternoon snack with a handful of mixed nuts for sustained energy.",
  "Practice gratitude for 2 minutes before bed — it measurably improves sleep quality.",
  "10 minutes of sunlight exposure in the morning resets your circadian rhythm.",
  "Batch your tasks into focused 25-minute intervals — the Pomodoro technique works.",
];

const BLOGS = [
  {
    title: "The Science of Sleep: Why 7–9 Hours Is Non-Negotiable",
    tag: "Sleep", readTime: "6 min", emoji: "🌙",
    gradient: "from-indigo-500 to-blue-600",
    excerpt: "Chronic sleep deprivation disrupts hormones, impairs immunity, and accelerates aging. Discover what happens to your body during each sleep stage.",
    content: `Sleep is not passive rest — it is one of the most active, productive periods for your body.

**Stage 1 & 2 (Light Sleep)**: Your heart rate slows, body temperature drops, and your brain starts consolidating memories from the day.

**Stage 3 (Deep Sleep)**: Human growth hormone is released, repairing muscles and tissues. Your immune system strengthens.

**REM Sleep**: This is where emotional processing happens. Vivid dreaming allows your brain to integrate experiences and process stress.

Cutting sleep below 7 hours even one night elevates cortisol, increases hunger hormones (ghrelin), and impairs prefrontal cortex function — your seat of rational decision-making.

**Tips for Better Sleep:**
- Keep a consistent sleep/wake time, even on weekends
- Avoid screens 60 minutes before bed
- Keep your room cool (16–19°C / 60–67°F)
- Try 4-7-8 breathing to calm your nervous system`,
  },
  {
    title: "Mindfulness Is Not Meditation — Here's the Difference",
    tag: "Mindfulness", readTime: "5 min", emoji: "🧘",
    gradient: "from-violet-500 to-purple-600",
    excerpt: "Most people confuse mindfulness with meditation. Understanding both can dramatically improve your mental clarity and emotional regulation.",
    content: `**Mindfulness** is the quality of being present and fully engaged with whatever you're doing, free from distraction or judgment.

**Meditation** is a formal practice — usually seated — where you intentionally focus your mind for a set period.

Mindfulness can happen during a shower, a meal, or a walk. Meditation is a dedicated practice that trains your capacity for mindfulness.

**Why it matters clinically:** Studies show that just 8 weeks of mindfulness-based stress reduction (MBSR) can physically reduce the size of the amygdala (your brain's fear center) while strengthening the prefrontal cortex.

**How to start:** Begin with 5 minutes of body scan meditation. Lie still, and slowly move your attention from your feet to the top of your head, noticing sensations without judgment.`,
  },
  {
    title: "Gut-Brain Axis: Your Second Brain Controls Your Mood",
    tag: "Nutrition", readTime: "7 min", emoji: "🧬",
    gradient: "from-emerald-500 to-teal-600",
    excerpt: "95% of serotonin — your happiness neurotransmitter — is produced in your gut. What you eat directly shapes how you feel.",
    content: `Your gut contains over 100 trillion microorganisms — more than cells in your body. This microbiome communicates directly with your brain via the vagus nerve, the enteric nervous system, and through chemical signals in the bloodstream.

**Key research:** Studies show that people with diverse gut microbiomes have lower rates of anxiety, depression, and cognitive decline.

**Foods that boost your microbiome:**
- Fermented foods (yogurt, kimchi, kefir) — introduce beneficial bacteria
- Fiber-rich foods (oats, legumes, vegetables) — feed existing bacteria
- Polyphenols (berries, dark chocolate, green tea) — encourage bacterial diversity

**Foods that harm your microbiome:**
- Ultra-processed foods and artificial sweeteners
- Excessive alcohol and red meat
- Antibiotic overuse (when not medically necessary)

A 2023 Stanford study found that a diet high in fermented foods increased microbiome diversity and reduced inflammatory markers in just 10 weeks.`,
  },
  {
    title: "Zone 2 Cardio: The Longevity Exercise You're Ignoring",
    tag: "Fitness", readTime: "5 min", emoji: "🏃",
    gradient: "from-sky-500 to-cyan-600",
    excerpt: "Elite athletes and longevity researchers agree: low-intensity, steady-state exercise is one of the most powerful tools for a long, healthy life.",
    content: `Zone 2 cardio refers to exercise at 60–70% of your maximum heart rate — the level where you can hold a conversation but feel slightly breathless.

**Why Zone 2?** This intensity primarily burns fat for fuel and trains your mitochondria (cellular energy factories) to become more efficient. This translates to:
- Better cardiovascular endurance
- Enhanced fat metabolism
- Improved insulin sensitivity
- Reduced all-cause mortality

**How much do you need?** Peter Attia MD, a leading longevity physician, recommends 150–180 minutes of Zone 2 per week.

**Simple Zone 2 activities:**
- Brisk walking (most underrated)
- Cycling at a comfortable pace
- Swimming leisurely laps
- Light jogging where you can still talk

You don't need to sweat it out every session. Consistency at the right intensity beats intensity without consistency.`,
  },
  {
    title: "The Hidden Cost of Chronic Stress on Your Body",
    tag: "Wellness", readTime: "6 min", emoji: "🧠",
    gradient: "from-rose-500 to-pink-600",
    excerpt: "Stress is not just a feeling — it is a full-body biological response that, when chronic, silently damages nearly every organ system.",
    content: `When you experience stress, your adrenal glands release cortisol and adrenaline. This is adaptive in short bursts — it saved our ancestors from predators.

**The problem:** Modern stressors (deadlines, notifications, finances) don't resolve quickly, keeping cortisol elevated chronically.

**Chronic cortisol elevations cause:**
- **Brain:** Shrinks the hippocampus (memory), impairs decision-making, increases anxiety and depression risk
- **Heart:** Elevates blood pressure, increases risk of heart disease
- **Gut:** Disrupts the microbiome, increases gut permeability ("leaky gut")
- **Immune system:** Suppresses immune function, makes you more susceptible to illness
- **Weight:** Elevates blood sugar and promotes fat storage, especially around the abdomen

**Proven stress-reduction interventions:**
1. Regular exercise (even walking)
2. Consistent sleep schedule
3. Social connection and meaningful relationships
4. Mindfulness or breathwork
5. Time in nature (proven to lower cortisol by 15–20%)`,
  },
];

const ALL_TAGS = ["All", "Sleep", "Mindfulness", "Nutrition", "Fitness", "Wellness"];

export default function BlogsPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);
  const [tipIndex] = useState(() => Math.floor(Math.random() * DAILY_TIPS.length));

  const filtered = BLOGS.filter(b =>
    (activeTag === "All" || b.tag === activeTag) &&
    (searchQuery === "" || b.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <FadeIn delay={0.05}>
        <h1 className="text-3xl font-bold text-slate-900">Health & Wellness Blogs</h1>
        <p className="mt-1 text-slate-600">Evidence-based articles to help you make smarter wellness decisions. +5 points per article read.</p>
      </FadeIn>

      {/* Daily Tip */}
      <FadeIn delay={0.1}>
        <div className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-5 shadow-lg text-white flex items-start gap-4">
          <Sun className="h-7 w-7 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide opacity-80 mb-1">Daily Health Tip</p>
            <p className="font-semibold text-lg leading-snug">{DAILY_TIPS[tipIndex]}</p>
          </div>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.15}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/80 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${activeTag === t ? "bg-sky-500 text-white shadow-md" : "bg-white/70 border border-slate-200 text-slate-600 hover:border-sky-300"}`}>
                <Tag className="h-3 w-3" />{t}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Blog Cards */}
      <div className="space-y-4">
        {filtered.map((blog, i) => {
          const isExpanded = expandedBlog === blog.title;
          return (
            <FadeIn key={blog.title} delay={0.05 * i}>
              <div className="rounded-2xl glass shadow-sm hover:shadow-md transition-all overflow-hidden">
                <button className="w-full text-left" onClick={() => setExpandedBlog(isExpanded ? null : blog.title)}>
                  <div className="flex gap-0">
                    <div className={`w-2 bg-gradient-to-b ${blog.gradient} flex-shrink-0 rounded-l-2xl`} />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{blog.emoji}</span>
                          <div>
                            <h2 className="font-bold text-slate-800 text-left">{blog.title}</h2>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white bg-gradient-to-r ${blog.gradient}`}>{blog.tag}</span>
                              <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3 w-3" />{blog.readTime}</span>
                            </div>
                          </div>
                        </div>
                        <BookOpen className={`h-5 w-5 flex-shrink-0 mt-1 transition-colors ${isExpanded ? "text-sky-500" : "text-slate-300"}`} />
                      </div>
                      <p className="mt-3 text-sm text-slate-600 text-left">{blog.excerpt}</p>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-white/30 px-6 py-5">
                    <div className="prose prose-sm max-w-none text-slate-700">
                      {blog.content.split("\n\n").map((para, pi) => (
                        <p key={pi} className="mb-3 last:mb-0 text-sm leading-relaxed whitespace-pre-wrap">{para}</p>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                      <p className="text-xs font-bold text-emerald-600">✅ Article read — +5 points earned!</p>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <BookOpen className="mx-auto mb-3 h-12 w-12" />
            <p className="font-semibold">No articles match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
