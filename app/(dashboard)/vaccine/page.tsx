"use client";

import { useState } from "react";
import { FadeIn } from "@/components/fade-in";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, CheckCircle2, Circle } from "lucide-react";

const VACCINES = [
  { category: "Annual Essentials", color: "card-sky", vaccines: [
    { name: "Influenza (Flu Shot)", frequency: "Every year", why: "Flu strains change annually. Yearly vaccination is essential for protection.", done: false },
    { name: "COVID-19 Booster", frequency: "As recommended by health authorities", why: "Immunity wanes over time. Boosters maintain protection against new variants.", done: false },
  ]},
  { category: "Core Adult Vaccines", color: "card-violet", vaccines: [
    { name: "Tdap (Tetanus, Diphtheria, Pertussis)", frequency: "Every 10 years", why: "Protects against tetanus from wounds and diphtheria/pertussis outbreaks.", done: false },
    { name: "MMR (Measles, Mumps, Rubella)", frequency: "Once, if not vaccinated", why: "Highly effective against these viral diseases. Recommended for unvaccinated adults.", done: false },
    { name: "Varicella (Chickenpox)", frequency: "Two doses if not vaccinated", why: "Adults who haven't had chickenpox are at risk for a severe illness.", done: false },
    { name: "Hepatitis B", frequency: "Three doses if not vaccinated", why: "Prevents chronic liver disease, cirrhosis, and liver cancer.", done: false },
  ]},
  { category: "Travel & Situational", color: "card-emerald", vaccines: [
    { name: "Typhoid", frequency: "Every 2–5 years if traveling to endemic areas", why: "Recommended for travel to South Asia, Africa, and Latin America.", done: false },
    { name: "Hepatitis A", frequency: "Two doses", why: "Protects against Hepatitis A, spread through contaminated food and water.", done: false },
    { name: "Yellow Fever", frequency: "Once (lifelong protection)", why: "Required for entry into some African and South American countries.", done: false },
  ]},
];

const FAQS = [
  { q: "Do vaccines cause the disease they prevent?", a: "No. Vaccines contain weakened, inactivated, or partial viruses/bacteria that cannot cause disease. They train your immune system to recognize and fight the actual pathogen." },
  { q: "Can I get too many vaccines at once?", a: "Your immune system can handle multiple vaccines simultaneously. Combination vaccines are designed to be safe. Your doctor determines the best schedule for you." },
  { q: "Are vaccines safe for adults?", a: "Yes. All approved vaccines go through extensive clinical trials and ongoing safety monitoring. Side effects are typically mild (sore arm, fatigue) and temporary." },
  { q: "If I had COVID-19, do I still need the vaccine?", a: "Yes, vaccination after infection provides stronger and more consistent immunity — often called 'hybrid immunity'. The timing may vary, so consult your doctor." },
  { q: "Do natural immunity and vaccine immunity differ?", a: "Vaccine immunity is predictable and controlled. Natural immunity varies greatly. For many diseases, vaccines offer more reliable protection with fewer risks." },
];

type VaccineStatus = Record<string, boolean>;

export default function VaccinePage() {
  const [status, setStatus] = useState<VaccineStatus>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggle = (name: string) => setStatus(p => ({ ...p, [name]: !p[name] }));
  const totalVaccines = VACCINES.flatMap(c => c.vaccines).length;
  const doneCnt = Object.values(status).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <FadeIn delay={0.05}>
        <h1 className="text-3xl font-bold text-slate-900">Vaccine Vitality Guidance</h1>
        <p className="mt-1 text-slate-600">Stay informed and up-to-date on recommended vaccines for a healthy life.</p>
      </FadeIn>

      {/* Progress tracker */}
      <FadeIn delay={0.1}>
        <div className="rounded-2xl glass p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-600" />
              <h2 className="font-bold text-slate-800">My Vaccine Checklist</h2>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-0.5 text-sm font-black text-sky-700">{doneCnt}/{totalVaccines} tracked</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-700" style={{ width: `${totalVaccines > 0 ? (doneCnt / totalVaccines) * 100 : 0}%` }} />
          </div>
        </div>
      </FadeIn>

      {/* Vaccine categories */}
      <div className="space-y-6">
        {VACCINES.map((cat, ci) => (
          <FadeIn key={cat.category} delay={0.15 + ci * 0.07}>
            <div className="rounded-2xl glass shadow-sm overflow-hidden">
              <div className={`${cat.color} px-5 py-4`}>
                <h2 className="font-bold text-white text-lg">{cat.category}</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {cat.vaccines.map((v, vi) => {
                  const isDone = !!status[v.name];
                  return (
                    <div key={v.name} className={`flex items-start gap-4 p-5 transition-colors cursor-pointer hover:bg-white/30 ${isDone ? "bg-emerald-50/40" : ""}`}
                      onClick={() => toggle(v.name)}>
                      {isDone ? <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" /> : <Circle className="h-6 w-6 text-slate-300 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <h3 className={`font-bold ${isDone ? "text-emerald-700" : "text-slate-800"}`}>{v.name}</h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">📅 {v.frequency}</p>
                        <p className="text-sm text-slate-600 mt-1">{v.why}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* FAQ Accordion */}
      <FadeIn delay={0.4}>
        <div className="rounded-2xl glass shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-4">
            <h2 className="font-bold text-white text-lg">Common Vaccine Questions</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {FAQS.map((faq, i) => (
              <button key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left p-5 hover:bg-white/30 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-800">{faq.q}</p>
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="mt-3 text-sm text-slate-600 overflow-hidden text-left">
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.5}>
        <div className="rounded-2xl bg-sky-50 border border-sky-200 p-5">
          <p className="text-sm font-medium text-sky-800">⚕️ <strong>Disclaimer:</strong> This information is for educational purposes only. Always consult a licensed healthcare professional before making vaccination decisions.</p>
        </div>
      </FadeIn>
    </div>
  );
}
