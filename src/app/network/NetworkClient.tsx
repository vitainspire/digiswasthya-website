"use client";

import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TelemedicineCentres } from "@/components/sections/TelemedicineCentres";
import { ContactActions } from "@/components/features/ContactActions";
import { useLanguage } from "@/context/LanguageContext";

export default function NetworkPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#f4f7f5]">
            <Navbar />

            {/* Page header */}
            <section className="relative bg-slate-950 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/ds-medical-camp-hd.png"
                        alt="DigiSwasthya Rural Telemedicine Camps & Health Centres"
                        fill
                        quality={95}
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/68 to-slate-900/35" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>
                
                {/* Decorative lighting */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 container px-4 py-16 sm:py-20 md:py-24">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            {t("centres.badge")}
                        </div>
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                            {t("network.heroTitle")}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed mb-6">
                            {t("network.heroSubtitle")}
                        </p>
                        <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-md shadow-2xl">
                            <p className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
                                <span>🩺</span> {t("network.heroHelpNote")}
                            </p>
                            <ContactActions />
                        </div>
                    </div>
                </div>
            </section>

            <TelemedicineCentres />

            <Footer />
        </main>
    );
}
