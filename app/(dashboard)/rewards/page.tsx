"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/fade-in";
import { Gift, Coins, CheckCircle, ShoppingBag } from "lucide-react";

type Reward = { id: string; name: string; description: string; pointsCost: number; active: boolean };
type UserReward = { id: string; reward: Reward; redeemedAt: string };

const REWARD_EMOJIS = ["🧘", "🏃", "🍎", "💊", "🌿", "🎯", "🧪", "🛁", "📖", "🎧", "🏋️", "🌙"];

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeemed, setRedeemed] = useState<UserReward[]>([]);
  const [points, setPoints] = useState(0);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rewards/list").then(r => r.ok ? r.json() : null).then(d => {
      if (d) { setRewards(d.rewards); setRedeemed(d.redeemed); setPoints(d.points); }
    }).catch(() => {
      // fallback dummy data
      setRewards([
        { id: "1", name: "Yoga Mat", description: "Premium non-slip yoga mat for your practice", pointsCost: 200, active: true },
        { id: "2", name: "Protein Shaker", description: "BPA-free shaker bottle with wire whisk ball", pointsCost: 150, active: true },
        { id: "3", name: "Wellness Journal", description: "Guided daily reflection & habit journal", pointsCost: 100, active: true },
        { id: "4", name: "Vitamin Bundle", description: "30-day supply of daily essential vitamins", pointsCost: 300, active: true },
        { id: "5", name: "Meditation App", description: "1-month premium access to guided meditation", pointsCost: 250, active: true },
        { id: "6", name: "Healthy Snack Box", description: "Curated box of 12 nutritious snacks", pointsCost: 180, active: true },
        { id: "7", name: "Sleep Mask", description: "Silk sleep mask for deep, quality rest", pointsCost: 80, active: true },
        { id: "8", name: "Resistance Bands", description: "Set of 5 resistance bands for home workouts", pointsCost: 120, active: true },
      ]);
      setPoints(385);
    });
  }, []);

  const handleRedeem = async (reward: Reward) => {
    if (points < reward.pointsCost || redeeming) return;
    setRedeeming(reward.id);
    try {
      const res = await fetch("/api/rewards/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rewardId: reward.id }) });
      if (res.ok) {
        setPoints(p => p - reward.pointsCost);
        setJustRedeemed(reward.id);
        setTimeout(() => setJustRedeemed(null), 3000);
      }
    } catch { /* ignore */ } finally { setRedeeming(null); }
  };

  return (
    <div className="space-y-8">
      <FadeIn delay={0.05}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Wellness Marketplace</h1>
            <p className="mt-1 text-slate-600">Redeem your hard-earned points for wellness products & perks.</p>
          </div>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-white shadow-lg"
          >
            <Coins className="h-8 w-8" />
            <div>
              <p className="text-xs font-semibold opacity-80">Your Balance</p>
              <p className="text-3xl font-black">{points.toLocaleString()}</p>
              <p className="text-xs opacity-80">wellness points</p>
            </div>
          </motion.div>
        </div>
      </FadeIn>

      {/* How to earn */}
      <FadeIn delay={0.1}>
        <div className="rounded-2xl glass p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Gift className="h-5 w-5 text-amber-500" /> How to Earn Points</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Daily Login", pts: "+15" },
              { label: "Mood Check-in", pts: "+10" },
              { label: "Habit Reminder", pts: "+5" },
              { label: "Program Enrolled", pts: "+20" },
              { label: "Blog Read", pts: "+5" },
              { label: "Assessment Done", pts: "+5" },
              { label: "7-Day Streak", pts: "+50" },
              { label: "Goal Achieved", pts: "+100" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
                <span className="text-xs font-medium text-slate-700">{item.label}</span>
                <span className="text-xs font-black text-amber-600">{item.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Marketplace Grid */}
      <FadeIn delay={0.15}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rewards.map((r, i) => {
            const emoji = REWARD_EMOJIS[i % REWARD_EMOJIS.length];
            const canAfford = points >= r.pointsCost;
            const isRedeemed = justRedeemed === r.id;
            return (
              <FadeIn key={r.id} delay={0.05 * i}>
                <div className={`relative rounded-2xl glass shadow-sm transition-all hover:shadow-md overflow-hidden flex flex-col ${!canAfford ? "opacity-75" : ""}`}>
                  <AnimatePresence>
                    {isRedeemed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-emerald-500/90 rounded-2xl backdrop-blur-sm"
                      >
                        <CheckCircle className="h-12 w-12 text-white mb-2" />
                        <p className="font-bold text-white text-lg">Redeemed!</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
                    <span className="text-5xl">{emoji}</span>
                  </div>
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <h3 className="font-bold text-slate-800">{r.name}</h3>
                    <p className="text-xs text-slate-500 flex-1">{r.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-amber-500" />
                        <span className="font-black text-amber-600">{r.pointsCost}</span>
                        <span className="text-xs text-slate-400">pts</span>
                      </div>
                      <button
                        onClick={() => handleRedeem(r)}
                        disabled={!canAfford || !!redeeming}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${canAfford ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:shadow-md active:scale-95" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {redeeming === r.id ? "..." : canAfford ? "Redeem" : "Need more pts"}
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </FadeIn>

      {/* Recent Redemptions */}
      {redeemed.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="rounded-2xl glass p-5 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4">Your Redemptions</h2>
            <div className="space-y-2">
              {redeemed.map(x => (
                <div key={x.id} className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-2.5">
                  <span className="font-medium text-slate-800">{x.reward.name}</span>
                  <span className="text-xs text-slate-500">{new Date(x.redeemedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
