"use client";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center vibrant-mesh-bg p-6">
      <div className="watermark-bg">WELLNESS</div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-2xl glass p-8 shadow-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
