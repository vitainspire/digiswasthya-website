"use client";

import { motion } from "framer-motion";
import { KPICard } from "./KPICard";
import { useImpactData } from "@/hooks/useImpactData";
import { useLanguage } from "@/context/LanguageContext";

export function StatsGrid() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data } = useImpactData();
    const kpiList = data.kpis;

    const containerVariants = {
        hidden: {},
        show: {
            transition: { staggerChildren: 0.08 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 24 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
        }
    };

    return (
        <section className="relative py-12 md:py-16 bg-slate-50/50 border-b border-slate-200/60 overflow-hidden">
            {/* Subtle dot pattern matching Our Journey */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, #003f3a 1px, transparent 1px)",
                    backgroundSize: "28px 28px"
                }}
            />

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                {/* Section header — Matching Our Journey header format */}
                <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                    <div className="inline-flex items-center gap-2 text-secondary-600 text-xs font-bold uppercase tracking-widest">
                        <span className="h-px w-6 bg-secondary-400" />
                        {currentLang === "en" ? "At a Glance" : "एक नज़र में"}
                        <span className="h-px w-6 bg-secondary-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                        {currentLang === "en" ? "Our Measurable Impact" : "हमारा मापने योग्य प्रभाव"}
                    </h2>
                    <p className="text-slate-500 text-sm font-light leading-relaxed">
                        {currentLang === "en"
                            ? "Hover or tap any card to reveal the exact metrics empowering rural healthcare."
                            : "ग्रामीण स्वास्थ्य सेवा को सशक्त बनाने वाले सटीक मेट्रिक्स को देखने के लिए किसी भी कार्ड पर होवर या टैप करें।"
                        }
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6"
                >
                    {kpiList.map((kpi) => (
                        <motion.div key={kpi.id} variants={cardVariants} className="w-full">
                            <KPICard data={kpi} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
