"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface BarItem {
    label: string;
    value: number;
    color?: string;
}

interface BarChartProps {
    data: BarItem[];
    title: string;
    icon?: React.ReactNode;
    barColor?: string;
}

function AnimatedBarRow({
    item,
    index,
    maxVal,
    inView,
    defaultColor
}: {
    item: BarItem;
    index: number;
    maxVal: number;
    inView: boolean;
    defaultColor?: string;
}) {
    const percentage = Math.min((item.value / maxVal) * 100, 100);
    const itemColor = item.color || defaultColor || "#1d7a72";

    // Animated count up for values
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 70 });
    const [displayVal, setDisplayVal] = useState(0);

    useEffect(() => {
        if (inView) {
            const timeout = setTimeout(() => {
                motionValue.set(item.value);
            }, index * 80);
            return () => clearTimeout(timeout);
        }
    }, [inView, item.value, motionValue, index]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayVal(Math.floor(latest));
        });
    }, [springValue]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
            className="group/row p-2.5 rounded-xl transition-all duration-200 hover:bg-violet-50/60"
        >
            <div className="flex justify-between items-center text-xs font-bold font-sans mb-2">
                <div className="flex items-center gap-2.5">
                    {/* Color dot badge */}
                    <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm transition-transform duration-200 group-hover/row:scale-125"
                        style={{ backgroundColor: itemColor, boxShadow: `0 0 6px ${itemColor}60` }}
                    />
                    <span className="text-slate-800 font-semibold tracking-wide text-[11px] group-hover/row:text-slate-950 transition-colors">
                        {item.label}
                    </span>
                </div>
                <span className="text-slate-900 font-extrabold font-mono text-xs tracking-tight">
                    {displayVal.toLocaleString("en-IN")}
                </span>
            </div>

            <div className="h-3 w-full bg-slate-100/90 rounded-full overflow-hidden relative p-[1px] border border-slate-200/50">
                <motion.div
                    initial={{ width: "0%" }}
                    animate={inView ? { width: `${percentage}%` } : { width: "0%" }}
                    transition={{
                        duration: 1.1,
                        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        delay: index * 0.08 + 0.1
                    }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                        background: `linear-gradient(90deg, ${itemColor}dd, ${itemColor})`,
                        boxShadow: `0 0 8px ${itemColor}40`
                    }}
                >
                    {/* Shimmer sweep effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
            </div>
        </motion.div>
    );
}

export function BarChart({ data, title, icon, barColor }: BarChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-60px" });
    const maxVal = Math.max(...data.map(d => d.value), 1);

    return (
        <div
            ref={containerRef}
            className="w-full bg-white p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group/chart"
        >
            {/* Top gradient glow line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-primary-500 to-violet-600 opacity-80" />

            <div className="mb-5 flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    {icon || <span className="h-2 w-2 rounded-full bg-violet-600 animate-ping" />}
                    {title}
                </h4>
                <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                    Live Distribution
                </span>
            </div>

            <div className="space-y-1">
                {data.map((item, index) => (
                    <AnimatedBarRow
                        key={index}
                        item={item}
                        index={index}
                        maxVal={maxVal}
                        inView={isInView}
                        defaultColor={barColor}
                    />
                ))}
            </div>
        </div>
    );
}
