"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, ExternalLink, FileText, Heart, Mail, Megaphone, Phone, Stethoscope, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { CareModel } from "@/components/sections/CareModel";
import { LogoWall } from "@/components/sections/LogoWall";
import { AwardSection } from "@/components/sections/AwardSection";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { impactAsOf, impactData } from "@/data/impactData";
import { STATIC_CENTRES } from "@/data/centreData";
import { donorLogos, partnerLogos } from "@/data/logosData";
import { registrations, transparencyDocs } from "@/data/registrations";
import { websiteConfig } from "@/data/websiteConfig";

const HEADLINE_KPI_IDS = ["total-consultations", "villages-covered", "health-camps", "cancer-screenings"];

function kpiValue(id: string) {
    return impactData.kpis.find((k) => k.id === id)?.value ?? 0;
}

export default function PartnerClient() {
    const { t, language } = useLanguage();
    const lang = language === "hi" ? "hi" : "en";

    const headlineKpis = HEADLINE_KPI_IDS.flatMap((id) => {
        const kpi = impactData.kpis.find((k) => k.id === id);
        return kpi ? [{ id, value: kpi.value, label: kpi.label[lang] }] : [];
    });

    const activeCentres = STATIC_CENTRES.filter((c) => c.isActive);
    const centreStates = [...new Set(activeCentres.map((c) => (lang === "hi" ? c.stateHi : c.state)))];

    const pathways = [
        {
            id: "centre",
            icon: Building2,
            title: t("collaboration.card2Title"),
            description: t("collaboration.card2Desc"),
            proof: t("partnerPage.centreProof")
                .replace("{count}", String(activeCentres.length))
                .replace("{states}", centreStates.join(", ")),
            image: "/images/resources/rural-clinic.jpg",
            cta: t("partnerPage.ctaCentre"),
            href: "/join-us?interest=sponsor-centre#donor",
        },
        {
            id: "campaign",
            icon: Megaphone,
            title: t("collaboration.card3Title"),
            description: t("collaboration.card3Desc"),
            proof: t("partnerPage.campaignProof")
                .replace("{screenings}", kpiValue("cancer-screenings").toLocaleString("en-IN"))
                .replace("{camps}", kpiValue("cancer-screening-camps").toLocaleString("en-IN")),
            image: "/images/real-campaign.jpg",
            cta: t("partnerPage.ctaCampaign"),
            href: "/join-us?interest=csr#donor",
        },
        {
            id: "invest",
            icon: TrendingUp,
            title: t("collaboration.card1Title"),
            description: t("collaboration.card1Desc"),
            proof: null,
            image: "/images/hero/hero-2.webp",
            cta: t("partnerPage.ctaInvest"),
            href: "/join-us?interest=impact-investment#donor",
        },
        {
            id: "doctors",
            icon: Stethoscope,
            title: t("partnerPage.doctorsTitle"),
            description: t("partnerPage.doctorsDesc"),
            proof: null,
            image: "/images/resources/consultation.jpg",
            cta: t("hero.joinDoctor"),
            href: "/join-us#doctor",
        },
    ];

    return (
        <main className="min-h-screen bg-surface">
            <Navbar />

            <PageHero title={t("partnerPage.heroTitle")} subtitle={t("partnerPage.heroSubtitle")}>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                        href="#contact"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 text-base font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                    >
                        {t("partnerPage.heroCta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                        href="#due-diligence"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-primary-600 px-7 text-base font-semibold text-primary-700 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                    >
                        <FileText className="h-4 w-4" aria-hidden="true" /> {t("partnerPage.kitTitle")}
                    </a>
                </div>
            </PageHero>

            <section className="border-b border-primary-100 bg-white py-10" aria-label={t("partnerPage.statsEyebrow")}>
                <div className="container max-w-6xl px-4">
                    <p className="eyebrow">{t("partnerPage.statsEyebrow")}</p>
                    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
                        {headlineKpis.map((kpi) => (
                            <div key={kpi.id} className="border-l-2 border-primary-600 pl-4">
                                <dd className="font-serif text-3xl font-bold tabular-nums text-primary-900 md:text-4xl">{kpi.value.toLocaleString("en-IN")}</dd>
                                <dt className="mt-1 text-sm font-medium text-gray-700 md:text-base">{kpi.label}</dt>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-5 text-sm text-gray-600">{impactAsOf[lang]}</p>
                </div>
            </section>

            <CareModel compact />

            <section className="section-y bg-white">
                <div className="container max-w-6xl px-4">
                    <SectionHeader eyebrow={t("partnerPage.pathwaysEyebrow")} title={t("partnerPage.pathwaysTitle")} lead={t("partnerPage.pathwaysLead")} />

                    <div className="mt-14 space-y-16 md:space-y-20">
                        {pathways.map(({ id, icon: Icon, title, description, proof, image, cta, href }, i) => (
                            <article key={id} id={id} className="grid scroll-mt-28 items-center gap-8 md:grid-cols-2 md:gap-12">
                                <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${i % 2 === 1 ? "md:order-2" : ""}`}>
                                    <Image src={image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                                </div>
                                <div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-5 font-serif text-2xl font-bold text-primary-900 md:text-3xl">{title}</h3>
                                    <p className="mt-4 text-lg leading-relaxed text-gray-700">{description}</p>
                                    {proof && (
                                        <p className="mt-5 border-l-4 border-primary-600 bg-primary-50 px-4 py-3 text-base font-semibold text-primary-900">{proof}</p>
                                    )}
                                    <Link
                                        href={href}
                                        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 text-base font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                                    >
                                        {cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="due-diligence" className="section-y scroll-mt-20 bg-primary-50">
                <div className="container max-w-6xl px-4">
                    <SectionHeader eyebrow={t("partnerPage.kitEyebrow")} title={t("partnerPage.kitTitle")} lead={t("partnerPage.kitLead")} />

                    <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
                        <div className="rounded-2xl border border-primary-100 bg-white p-6">
                            <h3 className="text-lg font-semibold text-primary-900">{t("partnerPage.kitRegistrations")}</h3>
                            <dl className="mt-4 divide-y divide-primary-100">
                                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                                    <dt className="text-base text-gray-700">{t("partnerPage.legalStatus")}</dt>
                                    <dd className="text-base font-semibold text-primary-900">{t("partnerPage.section8")}</dd>
                                </div>
                                {registrations.map((reg) => (
                                    <div key={reg.value} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                                        <dt className="text-base text-gray-700">{reg.label[lang]}</dt>
                                        <dd className="font-mono text-base font-semibold text-primary-900">{reg.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="rounded-2xl border border-primary-100 bg-white p-6">
                            <h3 className="text-lg font-semibold text-primary-900">{t("partnerPage.kitDocuments")}</h3>
                            <ul className="mt-4 space-y-3">
                                {transparencyDocs.map((doc) => (
                                    <li key={doc.href}>
                                        <a
                                            href={doc.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-xl border border-primary-100 p-4 transition-colors hover:border-primary-600 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                                        >
                                            <FileText className="h-6 w-6 shrink-0 text-primary-600" aria-hidden="true" />
                                            <span className="flex-1">
                                                <span className="block text-base font-semibold text-primary-900">{doc.label[lang]}</span>
                                                <span className="block text-sm text-gray-600">{t("partnerPage.kitDocNote")}</span>
                                            </span>
                                            <ExternalLink className="h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
                                        </a>
                                    </li>
                                ))}
                                <li className="pt-1 text-base">
                                    <Link href="/privacy-policy" className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                                        {t("nav.privacy")}
                                    </Link>
                                    <span className="mx-2 text-gray-400" aria-hidden="true">·</span>
                                    <Link href="/terms-and-conditions" className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                                        {t("nav.terms")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-y bg-white">
                <div className="container max-w-6xl px-4">
                    <SectionHeader eyebrow={t("partnerPage.supportersEyebrow")} title={t("partnerPage.supportersTitle")} />
                    <h3 className="mt-10 text-lg font-semibold text-primary-900">{t("partnerPage.donorsLabel")}</h3>
                    <LogoWall logos={donorLogos} variant="grid" className="mt-4 justify-start" />
                    <h3 className="mt-10 text-lg font-semibold text-primary-900">{t("partnerPage.partnersLabel")}</h3>
                    <LogoWall logos={partnerLogos} variant="grid" className="mt-4 justify-start" />
                </div>
            </section>

            <AwardSection />

            <section id="contact" className="section-y scroll-mt-20 bg-primary-900">
                <div className="container grid max-w-6xl gap-10 px-4 lg:grid-cols-[3fr_2fr] lg:items-center">
                    <div>
                        <SectionHeader tone="dark" title={t("partnerPage.contactTitle")} lead={t("partnerPage.contactBody")} />
                        <Link
                            href="/join-us?interest=csr#donor"
                            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-base font-bold text-primary-800 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                        >
                            {t("partnerPage.contactForm")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-primary-700 p-6">
                        <p className="eyebrow eyebrow-on-dark">{t("partnerPage.contactOr")}</p>
                        <ul className="mt-4 space-y-3 text-base text-white">
                            <li>
                                <a href={`mailto:${websiteConfig.supportEmail}?subject=${encodeURIComponent("Partnership enquiry")}`} className="inline-flex items-center gap-3 underline underline-offset-4 hover:text-primary-200">
                                    <Mail className="h-5 w-5 text-primary-300" aria-hidden="true" /> {websiteConfig.supportEmail}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${websiteConfig.supportPhone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-3 underline underline-offset-4 hover:text-primary-200">
                                    <Phone className="h-5 w-5 text-primary-300" aria-hidden="true" /> {websiteConfig.supportPhone}
                                </a>
                            </li>
                        </ul>
                        <div className="mt-6 border-t border-primary-700 pt-5">
                            <p className="text-base text-primary-100">{t("partnerPage.individualDonate")}</p>
                            <Button asChild variant="donate" className="mt-3 h-11 gap-2 rounded-xl px-6 text-base">
                                <Link href="/donate">
                                    <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("nav.donate")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
