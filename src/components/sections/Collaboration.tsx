"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, Building2, Megaphone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function Collaboration() {
    const { t } = useLanguage();

    const cards = [
        {
            icon: TrendingUp,
            title: t("collaboration.card1Title"),
            description: t("collaboration.card1Desc"),
            image: "/images/media/augnito-partnership-1.jpg",
        },
        {
            icon: Building2,
            title: t("collaboration.card2Title"),
            description: t("collaboration.card2Desc"),
            image: "/images/resources/rural-clinic.jpg",
        },
        {
            icon: Megaphone,
            title: t("collaboration.card3Title"),
            description: t("collaboration.card3Desc"),
            image: "/images/real-campaign.jpg",
        },
    ];

    return (
        <section className="bg-primary-50 py-14 md:py-20">
            <div className="container max-w-6xl px-4">
                <div className="mx-auto mb-10 max-w-2xl text-center">
                    <h2 className="font-serif text-3xl font-bold leading-tight text-primary-900 md:text-4xl">{t("collaboration.heading")}</h2>
                    <p className="mt-4 text-lg leading-relaxed text-primary-900/80">{t("collaboration.subheading")}</p>
                </div>

                <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {cards.map(({ icon: Icon, title, description, image }) => (
                        <li key={title} className="flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white">
                            <div className="relative h-48 w-full">
                                <Image src={image} alt={title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-semibold leading-snug text-primary-900">{title}</h3>
                                <p className="mt-2 text-base leading-relaxed text-gray-700">{description}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 rounded-3xl bg-primary-900 px-8 py-10 md:mt-12 md:px-14 md:py-12">
                    <div className="flex flex-col items-center justify-between gap-7 md:flex-row">
                        <div className="text-center md:text-left">
                            <h3 className="mb-2 font-serif text-2xl font-bold leading-tight text-white md:text-3xl">{t("collaboration.ctaHeading")}</h3>
                            <p className="max-w-xl leading-relaxed text-primary-100">{t("collaboration.ctaText")}</p>
                        </div>
                        <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
                            <Link
                                href="/join-us"
                                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-7 text-base font-bold text-primary-800 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                            >
                                {t("nav.joinUs")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <Button asChild variant="donate" className="h-12 gap-2 whitespace-nowrap rounded-xl px-7 text-base">
                                <Link href="/donate">
                                    <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("nav.donate")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
