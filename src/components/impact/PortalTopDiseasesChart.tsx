"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface DiseaseItem {
    disease: string;
    count: number;
}

interface PortalTopDiseasesChartProps {
    data: DiseaseItem[];
}

export function PortalTopDiseasesChart({ data }: PortalTopDiseasesChartProps) {
    const displayData = data.slice(0, 8);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(2);

    // X-axis maximum: largest displayed count rounded up to a clean multiple of 2 equal steps
    // (the chart shows three labels: 0, midpoint, maximum), so the longest bar always fits.
    const peak = Math.max(...displayData.map(d => d.count), 1);
    const rawStep = peak / 2;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const niceStep = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map(m => m * magnitude).find(s => s >= rawStep) ?? rawStep;
    const maxScale = niceStep * 2;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 h-full flex flex-col justify-between relative overflow-hidden font-sans"
        >
            {/* Soft accent top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-80" />

            {/* Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                            TOP DISEASES
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                            <Activity className="w-3 h-3 text-purple-600" />
                            Top 8 Diagnoses
                        </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        Recorded diagnoses distribution
                    </p>
                </div>
            </div>

            {/* Horizontal Bar Chart Container */}
            <div className="relative pt-2 pb-2 px-2 border-b border-l border-slate-200">
                <div className="space-y-2.5">
                    {displayData.map((item, idx) => {
                        const widthPct = Math.min((item.count / maxScale) * 100, 100);
                        const isHovered = hoveredIdx === idx;

                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-3 py-1 px-2 rounded-xl transition-colors cursor-pointer relative ${
                                    isHovered ? "bg-slate-100/70" : "hover:bg-slate-50"
                                }`}
                                onMouseEnter={() => setHoveredIdx(idx)}
                            >
                                {/* Left Label */}
                                <div className="w-36 text-right text-[11px] font-semibold text-slate-600 truncate" title={item.disease}>
                                    {item.disease}
                                </div>

                                {/* Bar Track */}
                                <div className="flex-1 h-3.5 bg-slate-100/60 rounded-full relative flex items-center overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: `${widthPct}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full rounded-full transition-all duration-150"
                                        style={{
                                            backgroundColor: isHovered ? "#7c3aed" : "#8b5cf6",
                                            opacity: isHovered ? 1 : 0.85
                                        }}
                                    />
                                </div>

                                {/* Glassmorphism Tooltip Card */}
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute left-[35%] -top-3 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1 rounded-xl shadow-lg z-20 pointer-events-none flex items-center gap-2"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                                        <span>{item.disease}:</span>
                                        <span className="text-purple-600 font-extrabold">{item.count.toLocaleString("en-IN")}</span>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* X Axis scale labels */}
                <div className="flex justify-between text-[9.5px] font-semibold text-slate-400 mt-4 pl-40 pr-2">
                    <span>0</span>
                    <span>{Math.round(maxScale / 2).toLocaleString("en-US")}</span>
                    <span>{maxScale.toLocaleString("en-US")}</span>
                </div>
            </div>
        </motion.div>
    );
}
