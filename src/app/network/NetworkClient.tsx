"use client";

import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { TelemedicineCentres } from "@/components/sections/TelemedicineCentres";
import { ContactActions } from "@/components/features/ContactActions";
import { useLanguage } from "@/context/LanguageContext";

export default function NetworkPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-surface">
            <Navbar />

            {/* Page header */}
            <section className="relative bg-primary-950 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/ds-medical-camp-hd.webp"
                        alt="DigiSwasthya Rural Telemedicine Camps & Health Centres"
                        fill
                        quality={95}
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-950/88 via-primary-950/68 to-primary-900/35" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent" />
                </div>
                

                <div className="relative z-10 container px-4 py-16 sm:py-20 md:py-24">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-base font-semibold text-primary-100">{t("centres.badge")}</p>
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                            {t("network.heroTitle")}
                        </h1>
                        <p className="text-base md:text-lg text-white/90 leading-relaxed mb-6">
                            {t("network.heroSubtitle")}
                        </p>
                        <div className="bg-primary-950/80 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-md">
                            <p className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
                                <span>🩺</span> {t("network.heroHelpNote")}
                            </p>
                            <ContactActions />
                        </div>
                    </div>
                </div>
            </section>

            <TelemedicineCentres />

            <ClosingCta />
            <Footer />
        </main>
    );
}
