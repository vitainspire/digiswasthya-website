"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Milestone } from "@/types/milestone";
import { getPrimaryMilestone, formatMilestoneNumber, LiveImpactData } from "@/data/milestoneEngine";
import { useLanguage } from "@/context/LanguageContext";

export function MilestoneHeroBadge() {
    const { language } = useLanguage();
    const isHindi = language === "hi";

    const [milestone, setMilestone] = useState<Milestone | null>(null);

    useEffect(() => {
        async function fetchLiveMilestone() {
            try {
                const res = await fetch("/api/impact/data", { cache: "no-store" });
                const json = await res.json();
                const liveData: LiveImpactData | undefined = json?.success ? json.data : undefined;
                const m = getPrimaryMilestone(liveData);
                setMilestone(m);
            } catch (err) {
                console.warn("[MilestoneHeroBadge] Fallback to static:", err);
                const m = getPrimaryMilestone();
                setMilestone(m);
            }
        }

        fetchLiveMilestone();
    }, []);

    const handleClick = () => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("open-milestone-modal", {
                    detail: { category: milestone?.category }
                })
            );
        }
    };

    if (!milestone) return null;

    const formattedValue = formatMilestoneNumber(milestone.threshold);
    const shortLabel = isHindi ? milestone.shortLabel.hi : milestone.shortLabel.en;

    return (
        <motion.button
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/80 hover:bg-slate-900/95 border border-amber-400/50 hover:border-amber-300 backdrop-blur-md text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_28px_rgba(245,158,11,0.55)] transition-all duration-200 cursor-pointer"
            aria-label={`View live impact milestone: ${formattedValue} ${shortLabel}`}
        >
            {/* Glowing Pulsing Star — signals this is a live, currently-true number */}
            <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shrink-0 shadow-sm">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <Sparkles className="w-3 h-3 fill-current text-slate-950 relative z-10" />
            </span>

            {/* Real, live number + what it counts — e.g. "1,10,000+ Patients Served" */}
            <span className="text-xs sm:text-sm font-bold tracking-wide text-amber-300 group-hover:text-amber-200 transition-colors whitespace-nowrap">
                {formattedValue} {shortLabel}
            </span>
        </motion.button>
    );
}
