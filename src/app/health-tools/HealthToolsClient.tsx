"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BMICalculator } from "@/components/features/BMICalculator";
import { useLanguage } from "@/context/LanguageContext";
import { Activity } from "lucide-react";

export default function HealthToolsPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#f4f7f5]">
            <Navbar />

            {/* Page Hero */}
            <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 py-20 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />

                <div className="container relative text-center">
                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-white/20">
                        <Activity className="h-3.5 w-3.5" />
                        Resources
                    </span>

                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Health Tools
                    </h1>
                    <p className="text-primary-100 text-lg max-w-2xl mx-auto leading-relaxed">
                        Simple health awareness tools designed to help you better understand your health and wellness.
                    </p>
                </div>
            </section>

            {/* Disclaimer Banner */}
            <div className="bg-blue-50 border-b border-blue-100">
                <div className="container py-4">
                    <p className="text-center text-sm text-blue-700 font-medium">
                        <span className="font-bold">Disclaimer:</span>{" "}
                        These tools are provided for educational and awareness purposes only and do not replace professional medical advice. Please consult a qualified healthcare professional for personalised guidance.
                    </p>
                </div>
            </div>

            {/* Tools Content */}
            <section className="py-16 md:py-20">
                <div className="container max-w-5xl mx-auto px-4">

                    {/* BMI Calculator Card */}
                    <div>
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
                                        <Activity className="h-4 w-4" />
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary-600">
                                        Health Tool
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                                    {t("bmi.title")}
                                </h2>
                                <p className="text-gray-500 mt-1 text-sm max-w-lg">
                                    {t("bmi.subtitle")}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-auto">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Available Now
                            </span>
                        </div>

                        {/* BMI Calculator Component */}
                        <BMICalculator />
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
