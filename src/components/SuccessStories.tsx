"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, User, Sparkles, Star } from "lucide-react";
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
    ],
    []
  );

  // auto-advance
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!visible || paused) return;
    timerRef.current = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      3500
    );
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [paused, visible, items.length]);

  if (!visible) return null;
  const current = items[index];

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-[320px] select-none"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] shadow-xl">
        <div className="rounded-2xl bg-white/90 dark:bg-neutral-900/85 backdrop-blur-sm">
          {/* header */}
          <div className="flex items-center justify-between px-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="relative h-2.5 w-2.5 rounded-full bg-green-500">
                <span className="absolute inset-0 rounded-full animate-ping bg-green-500/60" />
              </span>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-200">
                What’s happening on GigsWall
              </p>
            </div>
            <button
              aria-label="Dismiss"
              onClick={() => setVisible(false)}
              className="p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* one-at-a-time ticker */}
          <div className="relative mt-2 h-[64px] overflow-hidden px-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.name}-${index}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.7 }}
                className="flex items-start gap-3 rounded-xl bg-white/60 dark:bg-neutral-900/50 ring-1 ring-black/5 dark:ring-white/10 p-2"
              >
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-[#667EEA] to-[#A991F7] text-white flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {current.name}{" "}
                    <span className="font-normal text-neutral-600 dark:text-neutral-300">
                      • {current.gig}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" />
                    ₹{current.price}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* top/bottom fade masks for polish */}
            <div className="pointer-events-none absolute inset-x-3 top-0 h-5 bg-gradient-to-b from-white/90 dark:from-neutral-900/85 to-transparent" />
            <div className="pointer-events-none absolute inset-x-3 bottom-0 h-5 bg-gradient-to-t from-white/90 dark:from-neutral-900/85 to-transparent" />
          </div>

          {/* footer ctas */}
          <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-2">
            <a
              href="/gigs"
              className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Apply to a gig
            </a>
            <a
              href="/post"
              className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#667EEA] to-[#A991F7] hover:opacity-90 transition"
            >
              Post a gig
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}