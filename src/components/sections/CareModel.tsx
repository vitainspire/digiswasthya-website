"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";
import { STATIC_CENTRES } from "@/data/centreData";
import { SectionHeader } from "@/components/ui/section-header";

// Each step's proof figure deliberately avoids the four KPIs already shown in the hero stats bar.
const STEPS = [
    { key: "step1", image: "/images/hero/hero-1.webp", kpiId: "vitals-checkups" },
    { key: "step2", image: "/images/resources/consultation.jpg", kpiId: null },
    { key: "step3", image: "/images/impact-community.jpg", kpiId: "ayushman-cards" },
    { key: "step4", image: "/images/ds-community-outreach.jpg", kpiId: "cancer-patients-served" },
] as const;

export function CareModel({ compact = false }: { compact?: boolean }) {
    const { t, language } = useLanguage();
    const lang = language === "hi" ? "hi" : "en";
    const { data: impact } = useImpactData();

    const steps = STEPS.map((step) => {
        const kpi = step.kpiId ? impact.kpis.find((k) => k.id === step.kpiId) : null;
        return {
            ...step,
            statValue: kpi ? kpi.value : STATIC_CENTRES.filter((c) => c.isActive).length,
            statLabel: kpi ? kpi.label[lang] : t("home.modelCentres"),
        };
    });

    return (
        <section id="how-it-works" className={`scroll-mt-20 bg-primary-50 ${compact ? "py-14 md:py-16" : "section-y"}`}>
            <div className="container max-w-6xl px-4">
                <SectionHeader eyebrow={t("home.modelEyebrow")} title={t("home.modelTitle")} lead={t("home.modelLead")} />

                <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, i) => (
                        <li key={step.key} className="flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white">
                            {!compact && (
                                <div className="relative aspect-video w-full sm:aspect-[4/3]">
                                    <Image src={step.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                                </div>
                            )}
                            <div className="flex flex-1 flex-col p-5">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 font-serif text-lg font-bold text-white" aria-hidden="true">
                                    {i + 1}
                                </span>
                                <h3 className="mt-4 text-lg font-semibold leading-snug text-primary-900">{t(`home.model${i + 1}Title`)}</h3>
                                <p className="mt-2 flex-1 text-base leading-relaxed text-gray-700">{t(`home.model${i + 1}Desc`)}</p>
                                <p className="mt-5 border-t border-primary-100 pt-4">
                                    <span className="block font-serif text-2xl font-bold tabular-nums text-primary-700">{step.statValue.toLocaleString("en-IN")}</span>
                                    <span className="text-sm font-medium text-gray-600">{step.statLabel}</span>
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-base font-semibold">
                    <Link href="/network" className="inline-flex items-center gap-1.5 text-primary-700 underline underline-offset-4 hover:text-primary-600">
                        {t("home.modelFindCentre")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link href="/our-impact" className="inline-flex items-center gap-1.5 text-primary-700 underline underline-offset-4 hover:text-primary-600">
                        {t("home.modelSeeData")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
