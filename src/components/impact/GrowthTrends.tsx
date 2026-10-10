"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";
import { LineChart } from "./LineChart";

export function GrowthTrends() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data } = useImpactData();
    const trends = data.growthTrends;
    const teleconsult = data.teleconsultationGrowth;

    const titleTranslations = {
        en: "Growth Over the Years",
        hi: "वर्षों के दौरान विकास"
    };

    const subtitleTranslations = {
        en: "From 2020 to 2025, DigiSwasthya's growth across patients, consultations, camps, and doctors demonstrates the accelerating demand for digital healthcare in rural India.",
        hi: "2020 से 2025 तक, रोगियों, परामर्शों, शिविरों और डॉक्टरों में डिजीस्वास्थ्य की वृद्धि ग्रामीण भारत में डिजिटल स्वास्थ्य सेवा की बढ़ती मांग को दर्शाती है।"
    };

    const chartsConfig = [
        {
            title: { en: "Patients Served Growth", hi: "मरीजों की सेवा में वृद्धि" },
            data: trends.map(d => ({ label: d.year, value: d.patients })),
            color: "#1d7a72",
            gradientColor: "#d2e1df",
            suffix: "+"
        },
        {
            title: { en: "Teleconsultation Growth", hi: "टेलीपरामर्श में वृद्धि" },
            data: teleconsult.map(d => ({ label: d.year, value: d.consultations })),
            color: "#d97706",
            gradientColor: "#fef3c7",
            suffix: ""
        },
        {
            title: { en: "Health Camps Growth", hi: "स्वास्थ्य शिविरों में वृद्धि" },
            data: trends.map(d => ({ label: d.year, value: d.camps })),
            color: "#003f3a",
            gradientColor: "#e8efee",
            suffix: ""
        },
        {
            title: { en: "Doctors Onboard Growth", hi: "संबंधित डॉक्टरों में वृद्धि" },
            data: trends.map(d => ({ label: d.year, value: d.doctors })),
            color: "#b45309",
            gradientColor: "#fef3c7",
            suffix: ""
        }
    ];

    return (
        <section className="py-10 md:py-16 bg-white border-b border-gray-100">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                    <div className="inline-flex items-center gap-2 text-secondary-500 text-xs font-bold uppercase tracking-widest">
                        <span className="h-px w-6 bg-secondary-400" />
                        {currentLang === "en" ? "Historical Data" : "ऐतिहासिक डेटा"}
                        <span className="h-px w-6 bg-secondary-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                        {titleTranslations[currentLang]}
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed">
                        {subtitleTranslations[currentLang]}
                    </p>
                </div>

                {/* 2×2 chart grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {chartsConfig.map((config, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.55, delay: index * 0.1 }}
                        >
                            <LineChart
                                data={config.data}
                                title={config.title[currentLang]}
                                color={config.color}
                                gradientColor={config.gradientColor}
                                valueSuffix={config.suffix}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
