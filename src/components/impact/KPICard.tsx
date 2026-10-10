"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";
import * as Icons from "lucide-react";
import { KPICardData } from "@/data/impactData";
import { useLanguage } from "@/context/LanguageContext";

interface KPICardProps {
    data: KPICardData;
}

export function KPICard({ data }: KPICardProps) {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { value, suffix = "", label, icon, description } = data;
    const [isFlipped, setIsFlipped] = useState(false);

    // Dynamically resolve Lucide icon
    const iconName = icon as keyof typeof Icons;
    const LucideIcon = (iconName in Icons)
        ? (Icons[iconName] as Icons.LucideIcon)
        : Icons.HelpCircle;

    // Scroll-triggered counting animation
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 38, stiffness: 80 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (inView) motionValue.set(value);
    }, [inView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [springValue]);

    return (
        <div
            ref={ref}
            className="perspective-1000 cursor-pointer h-44 select-none"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => setIsFlipped(f => !f)}
            aria-label={label[currentLang]}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.85, ease: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number] }}
                className="transform-style-3d relative w-full h-full group"
            >
                {/* ─── FRONT FACE (Rich Forest Green Card on Light BG) ─── */}
                <div className="backface-hidden absolute inset-0 bg-gradient-to-br from-[#003f3a] via-[#00524b] to-[#002b28] rounded-2xl border border-primary-500/50 shadow-md hover:shadow-xl hover:border-primary-300/80 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 px-5 py-4 overflow-hidden">
                    {/* Glowing corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl bg-primary-300/10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-14 h-14 rounded-tr-3xl bg-amber-400/10 pointer-events-none" />

                    {/* Icon Container — Gold on Emerald */}
                    <div className="relative z-10 p-3 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 group-hover:bg-amber-400/25 group-hover:scale-110 transition-all duration-200 shadow-sm">
                        <LucideIcon className="h-6 w-6 stroke-[1.8]" />
                    </div>

                    {/* Label — Crisp White */}
                    <h3 className="relative z-10 text-[11px] font-black text-white uppercase tracking-wider text-center leading-snug max-w-[165px] drop-shadow-sm">
                        {label[currentLang]}
                    </h3>

                    {/* Hint badge */}
                    <span className="relative z-10 text-[9px] font-bold text-amber-300/90 uppercase tracking-widest flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                        <span className="h-1 w-1 rounded-full bg-amber-400 animate-ping" />
                        hover ↻
                    </span>
                </div>

                {/* ─── BACK FACE (Vivid Emerald/Gold Gradient) ─── */}
                <div className="backface-hidden rotate-y-180 absolute inset-0 bg-gradient-to-br from-[#00524b] via-[#003f3a] to-[#001a18] rounded-2xl border border-amber-500/40 shadow-xl flex flex-col items-center justify-center gap-2 px-5 py-4 overflow-hidden">
                    {/* Corner accent circle */}
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

                    {/* Animated number — Vivid Gold */}
                    <div className="relative z-10 flex items-baseline gap-0.5">
                        <span className="text-3xl lg:text-4xl font-black tracking-tighter text-amber-400 leading-none tabular-nums drop-shadow-sm">
                            {displayValue.toLocaleString("en-IN")}
                        </span>
                        {suffix && (
                            <span className="text-amber-300 font-extrabold text-xl leading-none">
                                {suffix}
                            </span>
                        )}
                    </div>

                    {/* Label */}
                    <h3 className="relative z-10 text-[10px] font-black text-primary-200 uppercase tracking-widest text-center leading-snug max-w-[170px]">
                        {label[currentLang]}
                    </h3>

                    {/* Short description */}
                    <p className="relative z-10 text-[10px] text-primary-100/75 font-light text-center leading-relaxed line-clamp-2 max-w-[180px]">
                        {description[currentLang]}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
