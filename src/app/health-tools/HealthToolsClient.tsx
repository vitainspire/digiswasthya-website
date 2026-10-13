"use client";

import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { BMICalculator } from "@/components/features/BMICalculator";
import { NcdRiskCheck } from "@/components/features/NcdRiskCheck";
import { SectionHeader } from "@/components/ui/section-header";
import { useLanguage } from "@/context/LanguageContext";
import { healthGuides, healthServices, type HealthServiceIcon } from "@/data/healthServices";
import {
    Activity,
    Ambulance,
    BookOpen,
    Brain,
    CigaretteOff,
    ClipboardList,
    CreditCard,
    ExternalLink,
    Fingerprint,
    Phone,
    Syringe,
    Video,
} from "lucide-react";

const serviceIcons: Record<HealthServiceIcon, typeof Activity> = {
    card: CreditCard,
    id: Fingerprint,
    video: Video,
    syringe: Syringe,
    mind: Brain,
    quit: CigaretteOff,
};

function ToolHeader({ icon, title, subtitle, label }: { icon: ReactNode; title: string; subtitle: string; label: string }) {
    return (
        <div className="mx-auto mb-8 max-w-4xl">
            <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">{icon}</span>
                <span className="eyebrow">{label}</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary-900 md:text-4xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-base text-gray-700 sm:text-lg">{subtitle}</p>
        </div>
    );
}

export default function HealthToolsPage() {
    const { t, language } = useLanguage();
    const lang = language === "hi" ? "hi" : "en";

    const jumpLinks = [
        { href: "#bmi", label: t("healthTools.jumpBmi") },
        { href: "#risk-check", label: t("healthTools.jumpRisk") },
        { href: "#services", label: t("healthTools.jumpServices") },
    ];

    return (
        <main className="min-h-screen bg-surface">
            <Navbar />

            <PageHero title={t("healthTools.title")} subtitle={t("healthTools.subtitle")}>
                <nav aria-label={t("healthTools.jumpLabel")} className="flex flex-wrap gap-2">
                    {jumpLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:border-primary-600 hover:bg-primary-50"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </PageHero>

            {/* Disclaimer Banner */}
            <div className="border-b border-primary-100 bg-white">
                <div className="container py-4">
                    <p className="text-center text-sm font-medium text-primary-900">
                        <span className="font-bold">{t("healthTools.disclaimerLabel")}</span> {t("healthTools.disclaimer")}
                    </p>
                </div>
            </div>

            <section id="bmi" className="scroll-mt-24 py-16 md:py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <ToolHeader
                        icon={<Activity className="h-4 w-4" aria-hidden="true" />}
                        label={t("healthTools.toolLabel")}
                        title={t("bmi.title")}
                        subtitle={t("bmi.subtitle")}
                    />
                    <BMICalculator />
                </div>
            </section>

            <section id="risk-check" className="scroll-mt-24 border-y border-primary-100 bg-primary-50 py-16 md:py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <ToolHeader
                        icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
                        label={t("healthTools.toolLabel")}
                        title={t("healthTools.riskTitle")}
                        subtitle={t("healthTools.riskSubtitle")}
                    />
                    <NcdRiskCheck />
                </div>
            </section>

            <section id="services" className="scroll-mt-24 py-16 md:py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="mx-auto max-w-4xl">
                        <SectionHeader
                            eyebrow={t("healthTools.servicesEyebrow")}
                            title={t("healthTools.servicesTitle")}
                            lead={t("healthTools.servicesLead")}
                        />

                        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {healthServices.map((service) => {
                                const Icon = serviceIcons[service.icon];
                                return (
                                    <li key={service.name.en} className="flex flex-col rounded-2xl border border-primary-100 bg-white p-6">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <h3 className="mt-4 text-lg font-semibold text-primary-900">{service.name[lang]}</h3>
                                        <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-700">{service.description[lang]}</p>
                                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                                            {service.href && (
                                                <a
                                                    href={service.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-primary-700 hover:text-primary-900 hover:underline"
                                                >
                                                    {t("healthTools.openWebsite")}
                                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                                    <span className="sr-only">{t("healthTools.newTab")}</span>
                                                </a>
                                            )}
                                            {service.phone && (
                                                <a href={`tel:${service.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-primary-700 hover:text-primary-900 hover:underline">
                                                    <Phone className="h-4 w-4" aria-hidden="true" />
                                                    {t("healthTools.call")} <span className="tabular-nums">{service.phone}</span>
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        <p className="mt-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-800">
                            <Ambulance className="h-5 w-5 shrink-0" aria-hidden="true" />
                            <a href="tel:108" className="hover:underline">{t("healthTools.emergency")}</a>
                        </p>

                        <div className="mt-16">
                            <h3 className="font-serif text-2xl font-bold text-primary-900 md:text-3xl">{t("healthTools.guidesTitle")}</h3>
                            <p className="mt-2 text-base text-gray-700 sm:text-lg">{t("healthTools.guidesLead")}</p>
                            <ul className="mt-6 grid gap-4 md:grid-cols-3">
                                {healthGuides.map((guide) => (
                                    <li key={guide.title.en}>
                                        <a
                                            href={guide.href[lang]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-6 transition-colors hover:border-primary-600"
                                        >
                                            <BookOpen className="h-5 w-5 text-primary-600" aria-hidden="true" />
                                            <span className="mt-3 text-sm font-medium text-gray-600">{guide.source[lang]}</span>
                                            <span className="mt-1 text-lg font-semibold text-primary-900">{guide.title[lang]}</span>
                                            <span className="mt-2 flex-1 text-sm leading-relaxed text-gray-700">{guide.description[lang]}</span>
                                            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:underline">
                                                {t("healthTools.readGuide")}
                                                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                                <span className="sr-only">{t("healthTools.newTab")}</span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <ClosingCta />
            <Footer />
        </main>
    );
}
