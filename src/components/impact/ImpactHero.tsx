"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";

export function ImpactHero() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data } = useImpactData();
    const heroContent = data.hero;

    return (
        <section className="border-b border-primary-100 bg-primary-50 py-12 md:py-16">
            <div className="container max-w-7xl px-4">
                <p className="eyebrow">{heroContent.badge[currentLang]}</p>
                <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight text-primary-900 md:text-5xl">
                    {currentLang === "en" ? "Our Measurable Healthcare Impact" : "हमारा मापने योग्य स्वास्थ्य प्रभाव"}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-900/80">{heroContent.subtitle[currentLang]}</p>
            </div>
        </section>
    );
}
