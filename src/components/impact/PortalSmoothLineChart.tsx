"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface Point {
    year: string;
    value: number;
}

interface PortalSmoothLineChartProps {
    title: string;
    subtitle: string;
    data: Point[];
    lineColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    maxScale?: number;
}

export function PortalSmoothLineChart({
    title,
    subtitle,
    data,
    lineColor = "#2563eb",
    gradientFrom = "#2563eb",
    gradientTo = "#ffffff",
    maxScale
}: PortalSmoothLineChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(data.length > 0 ? data.length - 1 : null);

    useEffect(() => {
        if (data && data.length > 0) {
            setHoveredIdx(data.length - 1);
        }
    }, [data]);

    // Compact dimensions for side-by-side view
    const svgWidth = 500;
    const svgHeight = 170;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 15;
    const paddingBottom = 30;

    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const chartHeight = svgHeight - paddingTop - paddingBottom;

    // Y-axis maximum: an explicit maxScale wins; otherwise round the largest value up to a clean
    // multiple of 4 equal ticks so that no point is drawn above the chart.
    const maxY = maxScale || (() => {
        const peak = Math.max(...data.map(d => d.value), 100);
        const rawStep = peak / 4;
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const niceStep = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map(m => m * magnitude).find(s => s >= rawStep) ?? rawStep;
        return niceStep * 4;
    })();

    const points = data.map((d, idx) => {
        const x = data.length > 1 
            ? paddingLeft + (idx / (data.length - 1)) * chartWidth 
            : paddingLeft + chartWidth / 2;
        const y = paddingTop + chartHeight - (d.value / maxY) * chartHeight;
        return { x, y, year: d.year, value: d.value };
    });

    const buildBezierPath = (pts: { x: number; y: number }[]) => {
        if (pts.length === 0) return "";
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const current = pts[i];
            const next = pts[i + 1];
            const controlX = (current.x + next.x) / 2;
            d += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
        }
        return d;
    };

    const lineD = buildBezierPath(points);

    const areaD = lineD && points.length > 0
        ? `${lineD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
        : "";

    const yTickCount = 4;
    const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => Math.round((maxY / yTickCount) * i));

    const gradientId = `chart-gradient-${title.replace(/[^a-zA-Z0-9]/g, "")}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full"
        >
            {/* Top accent bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-80" />

            {/* Compact Header */}
            <div className="mb-3">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                        {title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
                        Upward
                    </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {subtitle}
                </p>
            </div>

            {/* Compact Canvas */}
            <div className="w-full relative">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none overflow-visible">
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={gradientTo} stopOpacity={0.0} />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {yTicks.map((val, idx) => {
                        const y = paddingTop + chartHeight - (val / maxY) * chartHeight;
                        return (
                            <g key={idx}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={svgWidth - paddingRight}
                                    y2={y}
                                    stroke="#f1f5f9"
                                    strokeWidth="1"
                                    strokeDasharray="3 3"
                                />
                                <text
                                    x={paddingLeft - 6}
                                    y={y + 3}
                                    textAnchor="end"
                                    fontSize="8.5"
                                    fill="#94a3b8"
                                    fontWeight="600"
                                >
                                    {val.toLocaleString("en-IN")}
                                </text>
                            </g>
                        );
                    })}

                    {/* Baseline */}
                    <line
                        x1={paddingLeft}
                        y1={paddingTop + chartHeight}
                        x2={svgWidth - paddingRight}
                        y2={paddingTop + chartHeight}
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                    />

                    {/* Area fill */}
                    {areaD && (
                        <motion.path
                            d={areaD}
                            fill={`url(#${gradientId})`}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    )}

                    {/* Line curve */}
                    <motion.path
                        d={lineD}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {/* Hover vertical line */}
                    {hoveredIdx !== null && points[hoveredIdx] && (
                        <line
                            x1={points[hoveredIdx].x}
                            y1={paddingTop}
                            x2={points[hoveredIdx].x}
                            y2={paddingTop + chartHeight}
                            stroke={lineColor}
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            opacity="0.4"
                        />
                    )}

                    {/* Markers */}
                    {points.map((p, idx) => {
                        const isHovered = hoveredIdx === idx;
                        return (
                            <g 
                                key={idx} 
                                className="cursor-pointer" 
                                onClick={() => setHoveredIdx(idx)}
                                onTouchStart={() => setHoveredIdx(idx)}
                            >
                                {/* Generous transparent hit area covering the entire vertical year column */}
                                <rect
                                    x={p.x - 25}
                                    y={paddingTop}
                                    width={50}
                                    height={chartHeight + paddingBottom}
                                    fill="transparent"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onTouchStart={() => setHoveredIdx(idx)}
                                    onClick={() => setHoveredIdx(idx)}
                                />

                                {/* Outer gentle pulse glow on active node */}
                                {isHovered && (
                                    <motion.circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={9}
                                        fill={lineColor}
                                        opacity={0.25}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1.35 }}
                                        transition={{ repeat: Infinity, duration: 1.6, repeatType: "reverse" }}
                                    />
                                )}

                                {/* Main visual circle node (enlarged for easy tapping & clear visibility) */}
                                <motion.circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={isHovered ? 6.5 : 5}
                                    fill="white"
                                    stroke={lineColor}
                                    strokeWidth={isHovered ? 3.5 : 2.5}
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: 0.2 + idx * 0.08 }}
                                />
                                <text
                                    x={p.x}
                                    y={paddingTop + chartHeight + 16}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill={isHovered ? lineColor : "#64748b"}
                                    fontWeight={isHovered ? "800" : "600"}
                                    className="select-none"
                                >
                                    {p.year}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Compact Tooltip */}
                {hoveredIdx !== null && points[hoveredIdx] && (() => {
                    const pctX = (points[hoveredIdx].x / svgWidth) * 100;
                    const isNearRight = pctX > 70;
                    return (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute bg-slate-900 text-white rounded-lg shadow-md px-2.5 py-1 text-[10px] z-20 pointer-events-none"
                        style={{
                            left: isNearRight ? "auto" : `${pctX}%`,
                            right: isNearRight ? "4px" : "auto",
                            top: `${(points[hoveredIdx].y / svgHeight) * 100 - 18}%`,
                            transform: isNearRight ? "translateY(-100%)" : "translate(-50%, -100%)"
                        }}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-slate-200">{points[hoveredIdx].year}</span>
                            <span className="font-bold" style={{ color: "#60a5fa" }}>{points[hoveredIdx].value.toLocaleString("en-IN")}</span>
                        </div>
                    </motion.div>
                    );
                })()}
            </div>

            {/* Footer dots */}
            <div className="flex justify-center gap-1 mt-2">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={`w-1 h-1 rounded-full ${i === 1 ? "bg-slate-400" : "bg-slate-200"}`} />
                ))}
            </div>
        </motion.div>
    );
}
