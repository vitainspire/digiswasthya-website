"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";

export function ImpactTimeline() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data } = useImpactData();
    const milestones = data.timeline;

    const titleTranslations = {
        en: "Our Journey",
        hi: "हमारी यात्रा"
    };

    const subtitleTranslations = {
        en: "Trace DigiSwasthya's key milestones and our path forward to making quality healthcare universally accessible.",
        hi: "गुणवत्तापूर्ण स्वास्थ्य सेवा को सार्वभौमिक रूप से सुलभ बनाने के लिए डिजीस्वास्थ्य के प्रमुख मील के पत्थर और हमारे आगे के मार्ग को रेखांकित करें।"
    };

    // Separate milestones into Row 1 (first 4 items) and Row 2 (remaining 3 items)
    const row1Items = milestones.slice(0, 4);
    const row2Items = milestones.slice(4, 7);

    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
        }
    };

    return (
        <section className="relative pt-8 pb-20 md:pt-10 md:pb-28 bg-slate-50/30 border-t border-b border-slate-200/50 overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <p className="eyebrow">
                        {currentLang === "en" ? "Timeline Roadmap" : "समयरेखा रोडमैप"}
                    </p>
                    
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-900">
                        {titleTranslations[currentLang]}
                    </h2>
                    
                    <p className="text-slate-500 text-base font-light leading-relaxed">
                        {subtitleTranslations[currentLang]}
                    </p>
                </div>

                {/* Milestones Grid Rows Container */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="space-y-8"
                >
                    {/* Row 1: 4 Cards (Desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {row1Items.map((item, index) => {
                            const iconName = item.icon as keyof typeof Icons;
                            const LucideIcon = (iconName in Icons) ? (Icons[iconName] as Icons.LucideIcon) : Icons.HelpCircle;

                            return (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="group relative flex flex-col bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200/60 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        {/* Icon Container */}
                                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-primary-600 group-hover:bg-primary-50 group-hover:text-primary-700 transition-all duration-300">
                                            <LucideIcon className="h-5 w-5 stroke-[1.8]" />
                                        </div>
                                        
                                        {/* Year Badge */}
                                        <span className="text-2xl font-bold text-primary-600 tracking-tight">
                                            {item.year}
                                        </span>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary-700 transition-colors">
                                            {item.title[currentLang]}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-light">
                                            {item.description[currentLang]}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Row 2: 3 Cards (Desktop, Centered & Sized the same as Row 1) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 lg:max-w-5xl lg:mx-auto">
                        {row2Items.map((item, index) => {
                            const iconName = item.icon as keyof typeof Icons;
                            const LucideIcon = (iconName in Icons) ? (Icons[iconName] as Icons.LucideIcon) : Icons.HelpCircle;

                            return (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="group relative flex flex-col bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200/60 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        {/* Icon Container */}
                                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-primary-600 group-hover:bg-primary-50 group-hover:text-primary-700 transition-all duration-300">
                                            <LucideIcon className="h-5 w-5 stroke-[1.8]" />
                                        </div>
                                        
                                        {/* Year Badge */}
                                        <span className="text-2xl font-bold text-primary-600 tracking-tight">
                                            {item.year}
                                        </span>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary-700 transition-colors">
                                            {item.title[currentLang]}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-light">
                                            {item.description[currentLang]}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
