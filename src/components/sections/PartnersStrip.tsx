"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { donorLogos, partnerLogos, type LogoItem } from "@/data/logosData";

function LogoGrid({ items }: { items: LogoItem[] }) {
    return (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {items.map((logo) => {
                const card = (
                    <div className="flex h-20 items-center justify-center rounded-xl border border-primary-100 bg-white p-3">
                        <div className="relative h-full w-full">
                            <Image
                                src={logo.image}
                                alt={logo.name}
                                fill
                                sizes="160px"
                                className="object-contain"
                            />
                        </div>
                    </div>
                );
                return (
                    <li key={logo.name}>
                        {logo.link ? (
                            <a href={logo.link} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
                                {card}
                            </a>
                        ) : (
                            card
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

export function PartnersStrip() {
    const { t } = useLanguage();

    return (
        <section className="bg-white py-14 md:py-20">
            <div className="container max-w-6xl px-4">
                <h2 className="max-w-2xl font-serif text-3xl font-bold text-primary-900 md:text-4xl">{t("home.supportersTitle")}</h2>

                <h3 className="mb-4 mt-10 text-lg font-semibold text-primary-800">{t("home.donorsLabel")}</h3>
                <LogoGrid items={donorLogos} />

                <h3 className="mb-4 mt-10 text-lg font-semibold text-primary-800">{t("home.partnersLabel")}</h3>
                <LogoGrid items={partnerLogos} />

                <Link href="/about-us#our-partners" className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                    {t("home.supportersCta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}
