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
    if (lower.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello! How can I support your wellness journey today?";
    }
    if (lower.match(/\b(goal|goals|target)\b/)) {
      return "You can track your active goals in the 'Goals' tab on the left. Keeping a daily streak helps build momentum!";
    }
    if (lower.match(/\b(program|programs|stress|sleep)\b/)) {
      return "We offer structured programs like the '4-Week Stress Reset' and 'Sleep Better'. Check the Programs section!";
    }
    if (lower.match(/\b(coach|appointment|meeting|session)\b/)) {
      return "You can schedule sessions and message your coach directly in the Coaching tab.";
    }
    if (lower.match(/\b(habit|habits|routine)\b/)) {
      return "Habits are the foundation of wellness. Log your daily habits in the Habits tab to earn points!";
    }
    if (lower.match(/\b(reward|rewards|point|points)\b/)) {
      return "You earn points by logging check-ins and completing habits. Redeem them in the Rewards tab!";
    }
    return "I'm a simple wellness bot. Try asking me about your goals, habits, programs, or coaching!";
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
