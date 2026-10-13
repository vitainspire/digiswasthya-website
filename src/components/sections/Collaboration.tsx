"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, FileText, Heart, Megaphone, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { useLanguage } from "@/context/LanguageContext";
import { websiteConfig } from "@/data/websiteConfig";

export function Collaboration() {
    const { t } = useLanguage();

    const cards = [
        {
            id: "centre",
            icon: Building2,
            title: t("collaboration.card2Title"),
            description: t("collaboration.card2Desc"),
            image: "/images/resources/rural-clinic.jpg",
        },
        {
            id: "campaign",
            icon: Megaphone,
            title: t("collaboration.card3Title"),
            description: t("collaboration.card3Desc"),
            image: "/images/real-campaign.jpg",
        },
        {
            id: "invest",
            icon: TrendingUp,
            title: t("collaboration.card1Title"),
            description: t("collaboration.card1Desc"),
            image: "/images/resources/telemedicine-team.jpg",
        },
    ];

    return (
        <section className="section-y bg-primary-900">
            <div className="container max-w-6xl px-4">
                <SectionHeader tone="dark" eyebrow={t("collaboration.badge")} title={t("collaboration.heading")} lead={t("collaboration.subheading")} />

                <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {cards.map(({ id, icon: Icon, title, description, image }) => (
                        <li key={id} className="flex flex-col overflow-hidden rounded-2xl bg-white">
                            <div className="relative h-44 w-full">
                                <Image src={image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold leading-snug text-primary-900">{title}</h3>
                                <p className="mt-2 flex-1 text-base leading-relaxed text-gray-700">{description}</p>
                                <Link
                                    href={`/partner#${id}`}
                                    className="mt-5 inline-flex items-center gap-1.5 text-base font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600"
                                >
                                    {t("collaboration.explore")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 flex flex-col gap-6 border-t border-primary-700 pt-8 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="eyebrow eyebrow-on-dark">{t("collaboration.dueDiligence")}</p>
                        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-base font-medium text-white">
                            <li className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary-300" aria-hidden="true" /> {t("home.trust80g")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary-300" aria-hidden="true" /> {t("home.trustCsr")}
                            </li>
                            <li>
                                <a href={websiteConfig.balanceSheetsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline underline-offset-4 hover:text-primary-200">
                                    <FileText className="h-5 w-5 text-primary-300" aria-hidden="true" /> {t("home.trustBalance")}
                                </a>
                            </li>
                            <li>
                                <a href={websiteConfig.annualReportsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline underline-offset-4 hover:text-primary-200">
                                    <FileText className="h-5 w-5 text-primary-300" aria-hidden="true" /> {t("home.trustAnnual")}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
                        <Link
                            href="/partner"
                            className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-7 text-base font-bold text-primary-800 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                        >
                            {t("hero.partner")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Button asChild variant="donate" className="h-12 gap-2 whitespace-nowrap rounded-xl px-7 text-base">
                            <Link href="/donate">
                                <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("nav.donate")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
