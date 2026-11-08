"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DeptItem {
    department: string;
    count: number;
}

interface PortalDepartmentBarChartProps {
    data: DeptItem[];
}

export function PortalDepartmentBarChart({ data }: PortalDepartmentBarChartProps) {
    // Show Top 8 Departments
    const displayData = data
        .filter(d => d.department.toLowerCase() !== "not specified")
        .slice(0, 8);

    const [hoveredIdx, setHoveredIdx] = useState<number | null>(5); // Default highlight General Physician

    // Y-axis maximum: largest displayed count rounded up to a clean multiple of 4 equal steps,
    // so the tallest bar always fits inside the chart.
    const peak = Math.max(...displayData.map(d => d.count), 1);
    const rawStep = peak / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const niceStep = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map(m => m * magnitude).find(s => s >= rawStep) ?? rawStep;
    const maxY = niceStep * 4;
    const ySteps = [4, 3, 2, 1, 0].map(i => Math.round(niceStep * i));

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 h-full flex flex-col justify-between font-sans">
            {/* Title & Subtitle matching Management Portal */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                    CONSULTATIONS BY DEPARTMENT
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    The treating doctor&apos;s specialization (Top 8 Departments)
                </p>
            </div>

            {/* Container for Top 8 Departments */}
            <div className="w-full pb-20">
                <div 
                    className="h-88 relative flex items-end pt-6 pb-24 pl-14 pr-4 border-l border-b border-slate-200 w-full"
                >
                    {/* Dotted Grid Horizontal Lines */}
                    <div className="absolute left-14 right-0 top-6 bottom-24 flex flex-col justify-between pointer-events-none">
                        {ySteps.map((step) => (
                            <div key={step} className="w-full border-b border-dashed border-slate-200/80 h-0" />
                        ))}
                    </div>

                    {/* Y-Axis Labels */}
                    <div className="absolute left-0 top-3 bottom-24 flex flex-col justify-between text-xs font-semibold text-slate-500 pointer-events-none">
                        {ySteps.map((step) => (
                            <span key={step}>{step}</span>
                        ))}
                    </div>

                    {/* Top 8 Department Bars */}
                    <div className="w-full h-full flex items-end justify-around gap-4 z-10">
                        {displayData.map((item, idx) => {
                            const heightPct = Math.min((item.count / maxY) * 100, 100);
                            const isHovered = hoveredIdx === idx;

                            return (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer max-w-[80px]"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {/* Grey Highlight Overlay behind hovered bar */}
                                    {isHovered && (
                                        <div className="absolute inset-y-0 -inset-x-2 bg-slate-300/60 pointer-events-none z-0 rounded-xs" />
                                    )}

                                    {/* White Tooltip Box matching Management Portal Screenshot */}
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-lg px-4 py-3 rounded-md z-30 min-w-[150px] pointer-events-none text-left"
                                        >
                                            <div className="text-sm font-semibold text-slate-800 leading-tight">
                                                {item.department}
                                            </div>
                                            <div className="text-sm font-semibold text-blue-600 mt-2">
                                                count : {item.count.toLocaleString("en-IN")}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Solid Blue Bar */}
                                    <div
                                        className="w-full max-w-[32px] bg-[#0d5be1] hover:bg-[#0b4ec2] rounded-t-xs z-10 transition-all duration-150"
                                        style={{
                                            height: `${Math.max(heightPct, 1)}%`
                                        }}
                                    />

                                    {/* Clean Downward-Sloping Label Below X-Axis */}
                                    <div className="absolute top-[calc(100%+8px)] left-1/2 origin-top-left rotate-45 text-[11px] font-semibold text-slate-600 whitespace-nowrap select-none pointer-events-none">
                                        {item.department}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
