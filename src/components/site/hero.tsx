"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section
      id="hero"
      className="relative -mt-[5.625rem] flex min-h-[92vh] items-center overflow-hidden px-6 pt-[5.625rem]"
    >
      <div className="ambient-glow" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-[96rem] flex-col items-start gap-6"
      >
        {profile.location && (
          <motion.p
            variants={item}
            className="rounded-full border border-border-strong px-3.5 py-1 text-xs text-muted-foreground"
          >
            {profile.location}
            {profile.years_experience
              ? ` · ${profile.years_experience}+ years building`
              : ""}
          </motion.p>
        )}

        <motion.h1
          variants={item}
          className="font-display text-balance text-5xl font-medium leading-[1.05] sm:text-6xl md:text-7xl"
        >
          {profile.full_name || "Your Name"}
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-xl text-balance text-lg text-muted-foreground sm:text-xl"
        >
          {profile.headline || "A short line about what you build and for whom."}
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild size="lg">
            <a href="/#projects">
              See the work <ArrowDown className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="glass" size="lg">
            <a href="/#contact">
              <Mail className="h-4 w-4" /> Get in touch
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
