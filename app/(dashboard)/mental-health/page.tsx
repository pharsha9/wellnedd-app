"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Send, Sparkles, BookOpen, Wind, Smile, 
  ChevronRight, Calendar, AlertCircle, RefreshCw, CheckCircle2, 
  Moon, Heart, ChevronLeft, BarChart3, CloudRain, Star, ShieldAlert, Play, Pause, Activity
} from "lucide-react";
import toast from "react-hot-toast";
import { FadeIn } from "@/components/fade-in";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

type Tab = "dashboard" | "chat" | "cbt" | "sleep" | "sos";

interface Distortion {
  name: string;
  explanation: string;
}

interface Reframe {
  original: string;
  reframed: string;
}

interface JournalAnalysis {
  emotions: string[];
  triggers: string[];
  distortions: Distortion[];
  reframing: Reframe[];
  affirmation: string;
  copingSteps: string[];
}

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  moodAnalysis: JournalAnalysis | null;
  createdAt: string;
}

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
}

const DISTORTION_LIBRARY = [
  { name: "Catastrophizing", definition: "Expecting the worst-case scenario to happen, no matter how unlikely." },
  { name: "All-or-Nothing Thinking", definition: "Viewing things in black-and-white. If you aren't perfect, you're a failure." },
  { name: "Mind Reading", definition: "Assuming you know what others are thinking and why they act, without proof." },
  { name: "Emotional Reasoning", definition: "Believing that because you feel something, it must be true (e.g., 'I feel guilty, so I must have done wrong')." },
  { name: "Overgeneralization", definition: "Taking a single negative event and seeing it as a never-ending pattern of defeat." },
  { name: "Should Statements", definition: "Holding yourself to rigid rules of how you 'should' or 'must' behave." }
];

export default function MentalHealthSuperApp() {
  useSession();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  // Journaling state
  const [journalContent, setJournalContent] = useState("");
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [submittingJournal, setSubmittingJournal] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: "init", role: "model", content: "Welcome back to your AI Companion. Tell me what is on your mind today, and we can work through it together." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatFocus, setChatFocus] = useState("general");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // CBT Deck State
  const [cbtStep, setCbtStep] = useState(0);
  const [cbtSituation, setCbtSituation] = useState("");
  const [cbtNegativeThought, setCbtNegativeThought] = useState("");
  const [cbtSelectedDistortion, setCbtSelectedDistortion] = useState("");
  const [cbtEvidenceAgainst, setCbtEvidenceAgainst] = useState("");
  const [cbtReframedThought, setCbtReframedThought] = useState("");
  const [generatingCbtReframe, setGeneratingCbtReframe] = useState(false);

  // Sleep Oasis State
  const [sleepWorry, setSleepWorry] = useState("");
  const [sleepTheme, setSleepTheme] = useState("Rainy Mountain Cabin");
  const [sleepStyle, setSleepStyle] = useState("Deep Calming Voice");
  const [sleepStory, setSleepStory] = useState("");
  const [generatingSleepStory, setGeneratingSleepStory] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const sleepScrollRef = useRef<HTMLDivElement>(null);

  // SOS State
  const [sosMood, setSosMood] = useState<"panic" | "anger" | "burnout" | "grief">("panic");
  const [sosStep, setSosStep] = useState(0); // 0: select, 1: interactive grounding, 2: crisis script
  const [groundingLogs, setGroundingLogs] = useState({
    see: ["", "", "", "", ""],
    feel: ["", "", "", ""],
    hear: ["", "", ""],
    smell: ["", ""],
    taste: [""]
  });
  const [sosScript, setSosScript] = useState("");
  const [generatingSosScript, setGeneratingSosScript] = useState(false);

  // Interactive breathing inside SOS
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale");
  const [breathingTimer, setBreathingTimer] = useState(4);

  useEffect(() => {
    let active = true;
    const loadJournals = async () => {
      try {
        const res = await fetch("/api/mental-health/journal");
        const data = await res.json();
        if (active && data.data) {
          setJournals(data.data);
          if (data.data.length > 0) setSelectedJournal(data.data[0]);
        }
      } catch {
        toast.error("Failed to load past reflection logs.");
      } finally {
        if (active) setLoadingJournals(false);
      }
    };
    loadJournals();
    return () => {
      active = false;
    };
  }, []);

  // Chat auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Breathing loop inside SOS
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isBreathing) {
      timerId = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev <= 1) {
            // cycle phase: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
            setBreathingPhase((current) => {
              if (current === "Inhale") return "Hold";
              if (current === "Hold") return "Exhale";
              if (current === "Exhale") return "Hold (Out)";
              return "Inhale";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isBreathing]);

  // Sleep Autoscroller
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    if (isAutoScrolling && sleepScrollRef.current) {
      scrollTimer = setInterval(() => {
        if (sleepScrollRef.current) {
          sleepScrollRef.current.scrollTop += 1;
          if (sleepScrollRef.current.scrollTop + sleepScrollRef.current.clientHeight >= sleepScrollRef.current.scrollHeight) {
            setIsAutoScrolling(false);
          }
        }
      }, 50);
    }
    return () => clearInterval(scrollTimer);
  }, [isAutoScrolling]);

  // Handle new journal entry
  const handleAddJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (journalContent.length < 10) {
      toast.error("Please write a slightly longer journal entry (minimum 10 characters).");
      return;
    }

    setSubmittingJournal(true);
    try {
      const res = await fetch("/api/mental-health/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: journalContent }),
      });
      const data = await res.json();
      if (data.data) {
        setJournals(prev => [data.data, ...prev]);
        setSelectedJournal(data.data);
        setJournalContent("");
        toast.success("Journal added! +15 points earned 🎉");
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to analyze journal.";
      toast.error(msg);
    } finally {
      setSubmittingJournal(false);
    }
  };

  // Chat message send
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingMessage) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: chatInput.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setSendingMessage(true);

    try {
      const res = await fetch("/api/mental-health/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content })),
          focusArea: chatFocus
        })
      });
      const data = await res.json();
      if (data.data?.reply) {
        setChatMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: data.data.reply
        }]);
      }
    } catch {
      toast.error("AI companion timed out. Please retry.");
    } finally {
      setSendingMessage(false);
    }
  };

  // Guided CBT Reframe Request
  const handleGenerateCbtReframe = async () => {
    if (!cbtNegativeThought || !cbtSituation) {
      toast.error("Please fill in the situation and negative thought first.");
      return;
    }

    setGeneratingCbtReframe(true);
    try {
      const res = await fetch("/api/mental-health/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Help me reframe this thought using CBT. Situation: "${cbtSituation}". Negative Automatic Thought: "${cbtNegativeThought}". Cognitive Distortion identified: "${cbtSelectedDistortion}". Evidence against the negative thought: "${cbtEvidenceAgainst}". Produce a balanced, realistic, and constructive reframed thought. Keep your response brief, under 2 sentences, stating ONLY the reframed thought.`
            }
          ],
          focusArea: "cbt"
        })
      });
      const data = await res.json();
      if (data.data?.reply) {
        setCbtReframedThought(data.data.reply);
        setCbtStep(4);
      }
    } catch {
      toast.error("Gemma 4 was unable to process the reframe.");
    } finally {
      setGeneratingCbtReframe(false);
    }
  };

  // Generate sleepcast story
  const handleGenerateSleepcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sleepWorry.trim()) {
      toast.error("Please enter what is keeping you awake.");
      return;
    }

    setGeneratingSleepStory(true);
    setSleepStory("");
    try {
      const res = await fetch("/api/mental-health/sleepcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worryText: sleepWorry, theme: sleepTheme, style: sleepStyle })
      });
      const data = await res.json();
      if (data.data?.story) {
        setSleepStory(data.data.story);
        setIsAutoScrolling(true);
      }
    } catch {
      toast.error("Failed to generate your Sleepcast.");
    } finally {
      setGeneratingSleepStory(false);
    }
  };

  // Generate Panic Grounding Script
  const handleGenerateGrounding = async () => {
    setGeneratingSosScript(true);
    setSosScript("");
    try {
      const res = await fetch("/api/mental-health/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `I am currently experiencing intense ${sosMood}. Give me a short, highly grounding, reassuring personal crisis script using positive psychology. Speak directly to me. Keep it to 3 small paragraphs and focus on physical presence, releasing self-blame, and rhythmic breathing.`
            }
          ],
          focusArea: "grounding"
        })
      });
      const data = await res.json();
      if (data.data?.reply) {
        setSosScript(data.data.reply);
        setSosStep(2);
      }
    } catch {
      toast.error("Could not load crisis script.");
    } finally {
      setGeneratingSosScript(false);
    }
  };

  // Calculations for Analytics Charts
  const getAnalyticsData = () => {
    if (journals.length === 0) return [];
    return [...journals].reverse().map(j => {
      let score = 50; // Neutral baseline
      if (j.moodAnalysis) {
        const emoStr = j.moodAnalysis.emotions.join(", ").toLowerCase();
        if (emoStr.includes("anxious") || emoStr.includes("sad") || emoStr.includes("overwhelmed") || emoStr.includes("tired")) {
          score -= 20;
        }
        if (emoStr.includes("happy") || emoStr.includes("hopeful") || emoStr.includes("calm") || emoStr.includes("content") || emoStr.includes("motivated")) {
          score += 30;
        }
      }
      return {
        date: new Date(j.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        calmness: Math.max(10, Math.min(100, score))
      };
    });
  };

  // Compile Trigger Map categories
  const getTriggerCategories = () => {
    const counts: Record<string, number> = {};
    journals.forEach(j => {
      j.moodAnalysis?.triggers.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    const colors = ["#0ea5e9", "#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#f59e0b"];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length]
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Redesigned Header Block */}
      <FadeIn delay={0.05}>
        <div className="rounded-3xl glass p-6 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2.5">
              <Brain className="h-9 w-9 text-teal-500" /> Mind Sanctuary
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              Gemma 4 Native Cognitive Health Super-App &bull; Empathetic CBT Workspace
            </p>
          </div>

          {/* New Tab Switcher Layout */}
          <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 gap-1 select-none">
            {[
              { id: "dashboard", label: "Sanctuary Deck", icon: BarChart3 },
              { id: "chat", label: "AI Companion", icon: Sparkles },
              { id: "cbt", label: "CBT Worksheet", icon: Heart },
              { id: "sleep", label: "Sleep Oasis", icon: Moon },
              { id: "sos", label: "SOS Grounding", icon: ShieldAlert }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? "bg-white shadow-md text-teal-600 border border-slate-200/20" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Main Switcher Area */}
      <AnimatePresence mode="wait">
        
        {/* Tab 1: Dashboard with Trigger Maps & Journaling */}
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Journal Entry Panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Journal Composer Card */}
              <div className="rounded-3xl glass p-6 shadow-sm border border-white/50">
                <div className="flex items-center gap-2 text-slate-800">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  <h2 className="text-lg font-bold">Write a Daily Reflection</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Log your thoughts, feelings, or automatic judgments. Gemma 4 will immediately run a full CBT analysis on triggers, emotions, and reframing models.
                </p>

                <form onSubmit={handleAddJournal} className="mt-4 space-y-4">
                  <textarea
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    placeholder="E.g., I've been feeling incredibly overwhelmed by my work deadlines today. I feel like I'm falling behind and my team will notice I'm not performing well..."
                    rows={5}
                    className="w-full rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Requires at least 10 characters. Awards +15 points.
                    </p>
                    <button
                      type="submit"
                      disabled={submittingJournal || journalContent.length < 10}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:scale-[1.02] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submittingJournal ? (
                        <>
                          <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4.5 w-4.5" /> Analyze with Gemma 4
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Reflection Details & AI Breakdown */}
              {selectedJournal ? (
                <div className="rounded-3xl glass p-6 shadow-md border border-white/60 space-y-6">
                  <div className="flex justify-between items-start border-b border-slate-200/50 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-800">CBT AI Analysis</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(selectedJournal.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    {selectedJournal.moodAnalysis && (
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {selectedJournal.moodAnalysis.emotions.map((emotion, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-teal-50 text-teal-600 border border-teal-200/40">
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedJournal.moodAnalysis ? (
                    <div className="space-y-5 text-slate-700">
                      
                      {/* Journal Excerpt */}
                      <div className="p-4 bg-slate-50/60 border border-slate-200/30 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Original Reflection</p>
                        <p className="text-xs italic leading-relaxed text-slate-700">&ldquo;{selectedJournal.content}&rdquo;</p>
                      </div>

                      {/* AI Affirmation */}
                      <div className="p-4 bg-indigo-50/20 border border-indigo-200/10 rounded-2xl flex items-start gap-3">
                        <Smile className="h-5.5 w-5.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">Empathetic Affirmation</p>
                          <p className="text-xs font-semibold leading-relaxed text-slate-700">
                            {selectedJournal.moodAnalysis.affirmation}
                          </p>
                        </div>
                      </div>

                      {/* Cognitive Distortions Checklist */}
                      {selectedJournal.moodAnalysis.distortions && selectedJournal.moodAnalysis.distortions.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cognitive Distortions Detected</p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {selectedJournal.moodAnalysis.distortions.map((dist, idx) => (
                              <div key={idx} className="p-3.5 bg-red-50/20 border border-red-100 rounded-2xl flex items-start gap-2.5">
                                <AlertCircle className="h-4.5 w-4.5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-slate-800">{dist.name}</p>
                                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{dist.explanation}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CBT Thought Reframing cards */}
                      {selectedJournal.moodAnalysis.reframing && selectedJournal.moodAnalysis.reframing.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cognitive Reframing Alternatives</p>
                          <div className="space-y-3">
                            {selectedJournal.moodAnalysis.reframing.map((ref, idx) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-slate-200/40 rounded-2xl overflow-hidden shadow-xs">
                                <div className="p-3.5 bg-slate-50/80 border-r border-slate-100">
                                  <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md uppercase">Automatic Thought</span>
                                  <p className="text-xs text-slate-600 mt-2 italic">&ldquo;{ref.original}&rdquo;</p>
                                </div>
                                <div className="p-3.5 bg-teal-50/15">
                                  <span className="text-[9px] font-bold bg-teal-100/80 text-teal-700 px-1.5 py-0.5 rounded-md uppercase">Alternative View</span>
                                  <p className="text-xs font-semibold text-slate-700 mt-2 leading-relaxed">&ldquo;{ref.reframed}&rdquo;</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Coping Steps list */}
                      {selectedJournal.moodAnalysis.copingSteps && selectedJournal.moodAnalysis.copingSteps.length > 0 && (
                        <div className="border-t border-slate-200/50 pt-4">
                          <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <CheckCircle2 className="h-4.5 w-4.5" /> Coping Recommendations
                          </p>
                          <div className="grid gap-2">
                            {selectedJournal.moodAnalysis.copingSteps.map((step, idx) => (
                              <div key={idx} className="flex gap-2.5 items-center p-3 bg-white/50 border border-slate-200/40 rounded-xl hover:border-teal-300/40 transition-all shadow-2xs">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-[10px] font-black">
                                  {idx + 1}
                                </span>
                                <p className="text-xs text-slate-700 font-semibold">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      No analysis available for this entry.
                    </div>
                  )}
                </div>
              ) : (
                !loadingJournals && (
                  <div className="rounded-3xl glass p-10 text-center border border-white/50 text-slate-500 text-sm">
                    No reflections logged yet. Write down your feelings above to activate the CBT analytics!
                  </div>
                )
              )}
            </div>

            {/* Sidebar Column: Analytics Charts and past logs list */}
            <div className="space-y-6">
              
              {/* Trigger & Calmness Analytics panel */}
              {journals.length > 0 && (
                <div className="rounded-3xl glass p-5 border border-white/50 shadow-sm space-y-5">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-teal-500" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Calmness Analytics</h3>
                  </div>

                  {/* Calmness Area Chart */}
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getAnalyticsData()} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[0, 100]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="calmness" stroke="#0ea5e9" fill="#e0f2fe" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Trigger Map (Pie representation) */}
                  {getTriggerCategories().length > 0 && (
                    <div className="border-t border-slate-200/50 pt-4 space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Identified Stress Triggers</h4>
                      <div className="space-y-2">
                        {getTriggerCategories().map((cat, i) => (
                          <div key={i} className="flex justify-between items-center text-xs font-semibold">
                            <span className="flex items-center gap-2 text-slate-600">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </span>
                            <span className="text-slate-400">{cat.value} logs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reflection Logs archive list */}
              <div className="rounded-3xl glass p-5 border border-white/50 shadow-sm flex flex-col h-[350px]">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/40 pb-3 flex justify-between items-center">
                  <span>Reflection Logs Archive</span>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {journals.length}
                  </span>
                </h3>

                <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2">
                  {loadingJournals ? (
                    <div className="text-center py-10 flex flex-col items-center gap-2 text-slate-400">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span className="text-[10px] font-bold uppercase">Loading Log History</span>
                    </div>
                  ) : journals.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                      Archive is empty. Write your first log to start!
                    </div>
                  ) : (
                    journals.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => setSelectedJournal(entry)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                          selectedJournal?.id === entry.id
                            ? "bg-teal-50/50 border-teal-300 shadow-2xs"
                            : "bg-white/40 border-slate-200/50 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </span>
                          {entry.moodAnalysis && (
                            <span className="text-[8px] font-black bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-md uppercase">
                              {entry.moodAnalysis.emotions[0]}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-semibold line-clamp-1">
                          {entry.content}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Companion Chat */}
        {activeTab === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[550px]"
          >
            {/* Presets Sidebar */}
            <div className="md:col-span-1 rounded-3xl glass p-5 border border-white/50 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Focus Mode</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">Configure Gemma 4&apos;s prompt style for this chat.</p>
              </div>

              <div className="space-y-1">
                {[
                  { id: "general", name: "Empathetic Guide", desc: "General mental support" },
                  { id: "cbt", name: "CBT Reframing", desc: "Challenge cognitive errors" },
                  { id: "grounding", name: "Stress Grounding", desc: "Quick relief for panic & anxiety" },
                  { id: "gratitude", name: "Gratitude Loop", desc: "Practice mindful appreciation" },
                  { id: "self-compassion", name: "Self Compassion", desc: "Kindness & self-validation" },
                ].map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setChatFocus(preset.id);
                      setChatMessages([
                        {
                          id: Date.now().toString(),
                          role: "model",
                          content: `Focus Mode changed to **${preset.name}**. Tell me what is happening or what you are feeling, and we can explore it together.`
                        }
                      ]);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-0.5 cursor-pointer ${
                      chatFocus === preset.id
                        ? "bg-teal-50/50 border-teal-300 shadow-2xs"
                        : "bg-white/40 border-slate-200/50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800">{preset.name}</span>
                    <span className="text-[9px] text-slate-400 leading-normal">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Space */}
            <div className="md:col-span-3 rounded-3xl glass border border-white/50 shadow-sm flex flex-col overflow-hidden">
              <div className="bg-teal-600/90 text-white px-5 py-4 flex items-center justify-between border-b border-white/20">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider">Gemma 4 Sanctuary Companion</p>
                    <p className="text-[9px] text-teal-100 uppercase font-black tracking-widest mt-0.5">
                      Focus: {chatFocus}
                    </p>
                  </div>
                </div>
                <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Chat bubbles */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white/20">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start gap-2.5 max-w-[80%]">
                      {msg.role === "model" && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 text-white text-[10px] font-black shadow-2xs mt-0.5">
                          G4
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        msg.role === "user"
                          ? "bg-teal-600 text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                      }`}>
                        {msg.content.split("\n\n").map((para, pIdx) => {
                          const formatted = para.replace(/\*\*(.*?)\*\*/g, "$1");
                          return <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>{formatted}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {sendingMessage && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 text-white text-[10px] font-black shadow-2xs mt-0.5 animate-spin" />
                      <div className="bg-white text-slate-400 border border-slate-100 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="border-t border-slate-200/50 bg-white/60 p-4 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Talk to your companion about anything..."
                  disabled={sendingMessage}
                  className="flex-1 rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-xs font-semibold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-800 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || sendingMessage}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white disabled:opacity-50 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Send className="h-4.5 w-4.5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Guided CBT Thought Record Card Deck */}
        {activeTab === "cbt" && (
          <motion.div
            key="cbt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Step indicators */}
            <div className="flex gap-2 select-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= cbtStep ? "bg-teal-500" : "bg-slate-200"}`}
                />
              ))}
            </div>

            <div className="rounded-3xl glass p-8 shadow-lg border border-white/50 space-y-6">
              
              {/* Step Title Header */}
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-black">
                  {cbtStep + 1}
                </span>
                <h3 className="font-bold text-slate-800">
                  {cbtStep === 0 && "Describe the Situation"}
                  {cbtStep === 1 && "Log your Automatic Negative Thought"}
                  {cbtStep === 2 && "Identify Cognitive Distortion"}
                  {cbtStep === 3 && "Evidence & Challenge"}
                  {cbtStep === 4 && "Constructive Alternative Perspective"}
                </h3>
              </div>

              {/* Step 0: Situation */}
              {cbtStep === 0 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">What specific event triggered your distress? Describe it objectively.</p>
                  <textarea
                    value={cbtSituation}
                    onChange={(e) => setCbtSituation(e.target.value)}
                    placeholder="E.g., My manager asked for a sudden meeting at 4 PM without specifying the topic."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                </div>
              )}

              {/* Step 1: Automatic Thought */}
              {cbtStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">What automatic judgment or negative thought did you have immediately after the event?</p>
                  <textarea
                    value={cbtNegativeThought}
                    onChange={(e) => setCbtNegativeThought(e.target.value)}
                    placeholder="E.g., I'm going to get fired. They've discovered I make too many errors and they want to let me go."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                </div>
              )}

              {/* Step 2: Distortions selector */}
              {cbtStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Select the cognitive distortion that best fits this thought pattern:</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {DISTORTION_LIBRARY.map(dist => (
                      <button
                        key={dist.name}
                        onClick={() => setCbtSelectedDistortion(dist.name)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col gap-0.5 cursor-pointer ${
                          cbtSelectedDistortion === dist.name
                            ? "bg-teal-50/50 border-teal-300 shadow-2xs"
                            : "bg-white/40 border-slate-200/50 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-800">{dist.name}</span>
                        <span className="text-[9px] text-slate-400 leading-normal">{dist.definition}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Evidence */}
              {cbtStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Write down any objective facts or evidence that contradict this thought. (Why might it not happen?)</p>
                  <textarea
                    value={cbtEvidenceAgainst}
                    onChange={(e) => setCbtEvidenceAgainst(e.target.value)}
                    placeholder="E.g., I received a positive performance review last month. Meeting notifications without descriptions are standard. My manager is usually friendly."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                </div>
              )}

              {/* Step 4: Reframe Result */}
              {cbtStep === 4 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Based on your input, Gemma 4 has generated a balanced reframed perspective:</p>
                  <div className="p-5 bg-teal-50/20 border border-teal-200/30 rounded-2xl text-slate-800">
                    <p className="text-sm font-semibold leading-relaxed italic">&ldquo;{cbtReframedThought}&rdquo;</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Original Negative Thought</span>
                      <p className="mt-1 text-slate-500 italic">&ldquo;{cbtNegativeThought}&rdquo;</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Cognitive Error Type</span>
                      <p className="mt-1 text-slate-500 font-bold">{cbtSelectedDistortion || "General Distortion"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card deck controls */}
              <div className="flex justify-between items-center border-t border-slate-200/40 pt-4">
                <button
                  disabled={cbtStep === 0}
                  onClick={() => setCbtStep(prev => Math.max(0, prev - 1))}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-600 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>

                {cbtStep < 3 ? (
                  <button
                    disabled={
                      (cbtStep === 0 && !cbtSituation) ||
                      (cbtStep === 1 && !cbtNegativeThought) ||
                      (cbtStep === 2 && !cbtSelectedDistortion)
                    }
                    onClick={() => setCbtStep(prev => Math.min(3, prev + 1))}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </button>
                ) : cbtStep === 3 ? (
                  <button
                    onClick={handleGenerateCbtReframe}
                    disabled={generatingCbtReframe || !cbtEvidenceAgainst}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-black text-white rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer shadow-md"
                  >
                    {generatingCbtReframe ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Analyzing Thought...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Reframe Thought
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCbtStep(0);
                      setCbtSituation("");
                      setCbtNegativeThought("");
                      setCbtSelectedDistortion("");
                      setCbtEvidenceAgainst("");
                      setCbtReframedThought("");
                    }}
                    className="px-6 py-2.5 text-xs font-bold text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Start New Worksheet
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* Tab 4: Sleep Oasis Personalized AI Stories */}
        {activeTab === "sleep" && (
          <motion.div
            key="sleep"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Input Composer */}
            <div className="rounded-3xl glass p-6 border border-white/50 shadow-sm space-y-5 h-fit">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Moon className="h-5.5 w-5.5 text-teal-500" /> Sleep Story Oasis
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Log the day&apos;s stress keeping you awake. Gemma 4 will weave a slow-paced bedtime narrative specifically configured to calm your mind.
                </p>
              </div>

              <form onSubmit={handleGenerateSleepcast} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What&apos;s keeping you awake?</label>
                  <textarea
                    value={sleepWorry}
                    onChange={(e) => setSleepWorry(e.target.value)}
                    placeholder="E.g., Feeling stressed about my upcoming project launch and worrying I won't meet the deadline..."
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 bg-white/70 p-3.5 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Story Setting Theme</label>
                  <select
                    value={sleepTheme}
                    onChange={(e) => setSleepTheme(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/70 p-3 text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option>Rainy Mountain Cabin</option>
                    <option>The Midnight Express Train</option>
                    <option>Deep Space Nebula Cruise</option>
                    <option>Bioluminescent Whispering Forest</option>
                    <option>Calm Floating Ocean Raft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Narrative Style</label>
                  <select
                    value={sleepStyle}
                    onChange={(e) => setSleepStyle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/70 p-3 text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option>Deep Calming Voice</option>
                    <option>Whimsical Fantasy Story</option>
                    <option>Poetic & Slow-Paced Scenery</option>
                    <option>Soothing Whispering Guide</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generatingSleepStory || !sleepWorry.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white text-xs font-black shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {generatingSleepStory ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Drafting Story...
                    </>
                  ) : (
                    <>
                      <Play className="h-4.5 w-4.5" /> Generate Sleepcast
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Redesigned Dreamy Sleep Screen Reader */}
            <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-8 flex flex-col justify-between min-h-[480px] text-slate-100 relative overflow-hidden">
              {/* Starfield overlay effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none z-0" />
              
              <div className="relative z-10 border-b border-slate-800 pb-4 flex justify-between items-center select-none">
                <div className="flex items-center gap-2">
                  <Star className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sleep Oasis Display</span>
                </div>
                {sleepStory && (
                  <button
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-300 transition-colors cursor-pointer"
                  >
                    {isAutoScrolling ? (
                      <>
                        <Pause className="h-3.5 w-3.5" /> Pause Auto-Scroll
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" /> Auto-Scroll
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Story text space */}
              <div
                ref={sleepScrollRef}
                className="relative z-10 flex-1 overflow-y-auto my-6 pr-2 max-h-[300px] text-slate-300 space-y-4"
              >
                {generatingSleepStory ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 gap-3 text-slate-400 select-none">
                    <CloudRain className="h-10 w-10 animate-bounce text-indigo-400" />
                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Weaving quiet realms with Gemma 4...</p>
                  </div>
                ) : sleepStory ? (
                  sleepStory.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm font-medium leading-relaxed tracking-wide text-slate-300 select-text">
                      {para}
                    </p>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 gap-3 text-slate-500 select-none text-center">
                    <Moon className="h-12 w-12 text-slate-700" />
                    <p className="text-xs font-semibold leading-relaxed max-w-xs">
                      Enter your worry text on the left and select generate to begin your customized sleep induction story.
                    </p>
                  </div>
                )}
              </div>

              <div className="relative z-10 border-t border-slate-800 pt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
                <span>Setting: {sleepTheme}</span>
                <span>Tone: {sleepStyle}</span>
              </div>
            </div>

          </motion.div>
        )}

        {/* Tab 5: SOS Grounding Room */}
        {activeTab === "sos" && (
          <motion.div
            key="sos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* Grounding Room Selection Card */}
            {sosStep === 0 && (
              <div className="rounded-3xl glass p-8 shadow-md border border-white/50 text-center space-y-6">
                <div className="space-y-1">
                  <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-800">Distress & Grounding Space</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    If you are experiencing a surge of panic, anger, or burnout, take a moment here. We offer interactive physical awareness games and instant AI crisis scripts.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 select-none">
                  {[
                    { id: "panic" as const, label: "Surge of Panic", color: "border-red-200 text-red-700 bg-red-50/50" },
                    { id: "anger" as const, label: "Intense Anger", color: "border-orange-200 text-orange-700 bg-orange-50/50" },
                    { id: "burnout" as const, label: "Severe Burnout", color: "border-violet-200 text-violet-700 bg-violet-50/50" },
                    { id: "grief" as const, label: "Overwhelming Grief", color: "border-indigo-200 text-indigo-700 bg-indigo-50/50" },
                  ].map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => setSosMood(mood.id)}
                      className={`px-4.5 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        sosMood === mood.id ? "scale-105 ring-2 ring-indigo-500 shadow-sm" : "opacity-75 hover:opacity-100"
                      } ${mood.color}`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                  <button
                    onClick={() => setSosStep(1)}
                    className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    5-4-3-2-1 Grounding Log
                  </button>
                  <button
                    onClick={handleGenerateGrounding}
                    disabled={generatingSosScript}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.01] text-white text-xs font-black transition-all cursor-pointer shadow-md"
                  >
                    {generatingSosScript ? "Assembling Script..." : "Generate Grounding Script"}
                  </button>
                </div>
              </div>
            )}

            {/* 5-4-3-2-1 Sensory grounding logs */}
            {sosStep === 1 && (
              <div className="rounded-3xl glass p-8 shadow-md border border-white/50 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">5-4-3-2-1 Sensory Checklist</h3>
                  <button
                    onClick={() => {
                      setIsBreathing(!isBreathing);
                      setBreathingTimer(4);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      isBreathing ? "bg-teal-100 text-teal-700 border border-teal-200" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Wind className="h-4 w-4" /> {isBreathing ? `${breathingPhase} (${breathingTimer}s)` : "Enable Breath Guide"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">1. Look around: Name 5 things you see</span>
                    <div className="grid grid-cols-5 gap-2">
                      {groundingLogs.see.map((val, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newSee = [...groundingLogs.see];
                            newSee[idx] = e.target.value;
                            setGroundingLogs(prev => ({ ...prev, see: newSee }));
                          }}
                          placeholder={`Item ${idx + 1}`}
                          className="rounded-xl border border-slate-200 bg-white/70 p-2 text-xs font-semibold outline-none focus:border-teal-500 text-slate-800"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">2. Touch: Name 4 physical sensations you feel</span>
                    <div className="grid grid-cols-4 gap-2">
                      {groundingLogs.feel.map((val, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newFeel = [...groundingLogs.feel];
                            newFeel[idx] = e.target.value;
                            setGroundingLogs(prev => ({ ...prev, feel: newFeel }));
                          }}
                          placeholder={`Sensation ${idx + 1}`}
                          className="rounded-xl border border-slate-200 bg-white/70 p-2 text-xs font-semibold outline-none focus:border-teal-500 text-slate-800"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">3. Hear: Name 3 ambient sounds you hear</span>
                    <div className="grid grid-cols-3 gap-2">
                      {groundingLogs.hear.map((val, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newHear = [...groundingLogs.hear];
                            newHear[idx] = e.target.value;
                            setGroundingLogs(prev => ({ ...prev, hear: newHear }));
                          }}
                          placeholder={`Sound ${idx + 1}`}
                          className="rounded-xl border border-slate-200 bg-white/70 p-2 text-xs font-semibold outline-none focus:border-teal-500 text-slate-800"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">4. Smell: Name 2 scents you smell</span>
                    <div className="grid grid-cols-2 gap-2">
                      {groundingLogs.smell.map((val, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newSmell = [...groundingLogs.smell];
                            newSmell[idx] = e.target.value;
                            setGroundingLogs(prev => ({ ...prev, smell: newSmell }));
                          }}
                          placeholder={`Scent ${idx + 1}`}
                          className="rounded-xl border border-slate-200 bg-white/70 p-2 text-xs font-semibold outline-none focus:border-teal-500 text-slate-800"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">5. Taste: Name 1 flavor you taste</span>
                    <input
                      type="text"
                      value={groundingLogs.taste[0]}
                      onChange={(e) => {
                        setGroundingLogs(prev => ({ ...prev, taste: [e.target.value] }));
                      }}
                      placeholder="Taste description"
                      className="w-full rounded-xl border border-slate-200 bg-white/70 p-2.5 text-xs font-semibold outline-none focus:border-teal-500 text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/40 pt-4">
                  <button
                    onClick={() => {
                      setSosStep(0);
                      setIsBreathing(false);
                    }}
                    className="px-5 py-2 text-xs font-bold text-slate-600 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Grounding complete. You successfully shifted your attention 💚");
                      setSosStep(0);
                      setIsBreathing(false);
                    }}
                    className="px-6 py-2.5 text-xs font-black text-white rounded-xl bg-teal-600 hover:bg-teal-700 cursor-pointer"
                  >
                    Finish Grounding
                  </button>
                </div>
              </div>
            )}

            {/* Guided Crisis Reassurance Text */}
            {sosStep === 2 && (
              <div className="rounded-3xl glass p-8 shadow-md border border-white/50 space-y-6">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">
                    Gemma Grounding Script
                  </span>
                  <button
                    onClick={() => setSosStep(0)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    Go Back
                  </button>
                </div>

                <div className="space-y-4 text-slate-700 select-text leading-relaxed">
                  {sosScript.split("\n\n").map((para, idx) => {
                    const cleanPara = para.replace(/\*\*(.*?)\*\*/g, "$1");
                    return <p key={idx} className="text-sm font-semibold text-slate-700">{cleanPara}</p>;
                  })}
                </div>

                <div className="border-t border-slate-200/50 pt-4 text-center select-none">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Repeat slowly as you inhale and exhale</p>
                  <button
                    onClick={() => {
                      toast.success("Script logged. Take a deep breath 💚");
                      setSosStep(0);
                    }}
                    className="px-8 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md cursor-pointer"
                  >
                    I Feel Centered
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
