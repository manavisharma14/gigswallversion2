"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, User, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SuccessStoriesOneAtATime() {
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);

  const items = useMemo(
    () => [
      { name: "Ashly",  gig: "Create a Personal Portfolio Website", price: 1000 },
      { name: "Ruthvic", gig: "Looking for a Video Creator (Promo Video)", price: 1700 },
      { name: "Pulkit",  gig: "Need a Wedding Card Designed", price: 1000 },
      { name: "Soham",  gig: "Need Someone to Edit a Reel", price: 400 },
      { name: "Anjali", gig: "Tutoring: 1st Year Physics (MIT ECE)", price: 600 },
    
      { name: "Aman",   gig: "Data Entry for Survey Responses (100 entries)", price: 800 },
      { name: "Mridula", gig: "Logo Designer Needed for my Startup", price: 1500 },
      { name: "Raghav", gig: "Need Help Reviewing My SOP (Grad School Experience Preferred)", price: 1200 },
      { name: "Priya",  gig: "Illustrate a Logo Using Adobe Illustrator", price: 1000 },
    ],
    []
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!visible || paused) return;
    timerRef.current = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      1500
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, visible, items.length]);

  if (!visible) return null;
  const current = items[index];

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[320px] select-none"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] shadow-2xl">
        <div className="rounded-2xl bg-white/90 dark:bg-neutral-900/85 backdrop-blur-md">
          {/* header */}
          <div className="flex items-center justify-between px-3 pt-3">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              🔥 Trending on GigsWall
            </p>
            <button
              aria-label="Dismiss"
              onClick={() => setVisible(false)}
              className="p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ticker */}
          <div className="relative mt-3 h-[80px] overflow-hidden px-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.name}-${index}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 0.7,
                }}
                className="flex items-center gap-3 rounded-xl bg-white/70 dark:bg-neutral-900/50 ring-1 ring-black/5 dark:ring-white/10 p-3 shadow-sm hover:scale-[1.02] transition"
              >
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#667EEA] to-[#A991F7] text-white flex items-center justify-center shadow">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {current.name}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate">
                    {current.gig}
                  </p>
                  <span className="mt-1 inline-flex items-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 text-xs font-medium">
                    ₹{current.price}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* footer ctas */}
          <div className="grid grid-cols-2 gap-2 px-3 pb-3 pt-3">
            <a
              href="/gigs"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Apply
            </a>
            <a
              href="/post"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#667EEA] to-[#A991F7] hover:opacity-90 transition"
            >
              Post
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}