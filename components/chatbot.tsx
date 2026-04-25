"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", content: "Hi! I'm your wellness assistant. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.match(/\b(hi|hello|hey|greetings|good\s*(morning|evening|afternoon))\b/))
      return "Hello! 👋 I'm your WellNedd wellness assistant. Ask me about goals, habits, programs, recipes, vaccines, blogs, or your wellbeing!";
    if (lower.match(/\b(goal|goals|target|milestone)\b/))
      return "📎 You can track active goals in the **Goals** tab. Each goal shows a progress bar with days remaining. Achieving one earns +100 points!";
    if (lower.match(/\b(habit|habits|routine|streak)\b/))
      return "🔥 Build habits in the **Habits** section. A 7-day streak earns +50 bonus points. Your calendar grid shows your consistency!";
    if (lower.match(/\b(program|programs|workout\s*series|yoga\s*series|immunity\s*guide)\b/))
      return "🎯 Browse programs under **Programs** — we have Workout Series, Yoga, Immunity Guides, Sleep Protocol, and more! Enrolling earns +20 points.";
    if (lower.match(/\b(coach|coaching|appointment|session|book)\b/))
      return "💬 Book a **Fitness** or **Meditation Coaching** session in the Coaching section. You can also message your coach directly!";
    if (lower.match(/\b(tracker|steps|water|meal|reminder|hydrat|vitamin|yoga|sleep|meditation)\b/))
      return "📊 Head to the **Tracker** page to log your daily steps, water glasses, meals, and habit reminders. Each reminder earns +5 points!";
    if (lower.match(/\b(check.?in|mood|stress|energy|focus|feeling|emotion)\b/))
      return "🧠 Do your daily **Check-in** to log your mood, stress, sleep, and energy. The radar chart shows your wellness snapshot. Earns +10 points!";
    if (lower.match(/\b(recipe|immunity|booster|protein|meal\s*plan|food|eat|nutrition)\b/))
      return "🥗 Visit **Nutrition & Recipes** for immunity boosters, protein recipes, a 7-day meal planner, and myth-busting health facts!";
    if (lower.match(/\b(myth|misconception|fake|false|truth|misinformation)\b/))
      return "❌ Check the **Nutrition & Recipes** section > 'Busting Myths' tab — we debunk 6 common health myths like 'fat makes you fat' and 'detox diets work'!";
    if (lower.match(/\b(vaccine|vaccination|flu|shot|immunity|booster\s*dose)\b/))
      return "💉 Visit **Vaccine Guide** for recommended vaccines (annual, adult, travel), a checklist to track yours, and answers to common vaccine questions!";
    if (lower.match(/\b(blog|article|read|health\s*tip|tip|advice)\b/))
      return "📚 The **Blogs** section has science-backed articles on Sleep, Mindfulness, Gut Health, Zone 2 Cardio, and Chronic Stress. +5 points per article!";
    if (lower.match(/\b(assess|wellbeing|assessment|quiz|mental|overwhelmed|sustainable)\b/))
      return "📋 Take a **Wellbeing Assessment** — four short quizzes on your meals, mental-physical health link, lifestyle sustainability, and work stress. +5 pts each!";
    if (lower.match(/\b(reward|redeem|point|points|shop|marketplace|buy)\b/))
      return "🏆 Your points can be redeemed in the **Rewards Marketplace** for yoga mats, protein shakers, wellness journals, vitamin bundles, and more!";
    if (lower.match(/\b(point|earn|how|login|daily)\b/))
      return "⭐ Earn points daily: Login +15, Check-in +10, Habit Reminder +5, Program Enrollment +20, Article +5, 7-day Streak +50, Goal Achieved +100!";
    return "I'm your WellNedd wellness guide! 🌿 Try asking about: check-ins, habits, programs, tracker, recipes, vaccine guide, blogs, wellbeing assessments, or rewards!";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: getBotResponse(userMessage.content)
      };
      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 overflow-hidden rounded-2xl glass shadow-2xl flex flex-col border border-white/50"
            style={{ height: '400px' }}
          >
            <div className="flex items-center justify-between bg-teal-600/90 px-4 py-3 text-white backdrop-blur-md">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Wellness Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user" 
                      ? "bg-teal-600 text-white rounded-br-none" 
                      : "bg-white text-slate-800 shadow-sm rounded-bl-none border border-slate-100"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSend} className="border-t border-slate-200/50 bg-white/60 p-3 backdrop-blur-md flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about goals..."
                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white/80 text-slate-800"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-white disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg ring-4 ring-white/30 hover:shadow-xl transition-all cursor-pointer"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
}
