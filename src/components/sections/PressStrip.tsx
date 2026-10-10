"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import mediaData from "@/data/mediaData.json";

const FEATURED_IMAGES = [
    "/images/media/nmc-agreement-mahasagar.jpeg",
    "/images/media/breast-screening-launch-bhaskar.jpeg",
    "/images/media/world-cancer-day-toi.jpeg",
    "/images/media/gorewada-hitavada.jpg",
];

export function PressStrip() {
    const { t } = useLanguage();
    const items = FEATURED_IMAGES.flatMap((image) => {
        const item = mediaData.mediaCoverage.find((entry) => entry.image === image);
        return item ? [item] : [];
    });

    return (
        <section className="bg-white py-14 md:py-20">
            <div className="container max-w-6xl px-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="font-serif text-3xl font-bold text-primary-900 md:text-4xl">{t("home.pressTitle")}</h2>
                        <p className="mt-3 text-lg text-primary-900/80">{t("home.pressSubtitle")}</p>
                    </div>
                    <Link href="/media?tab=news" className="inline-flex items-center gap-2 text-base font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                        {t("home.pressCta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>

                <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => (
                        <li key={item.image}>
                            <Link href="/media?tab=news" className="group block h-full overflow-hidden rounded-2xl border border-primary-100 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
                                <div className="relative aspect-[4/3] bg-primary-50">
                                    <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                                </div>
                                <div className="p-4">
                                    <p className="text-sm font-medium text-primary-700">{item.description.split(". ")[0]}</p>
                                    <h3 className="mt-1 text-base font-semibold leading-snug text-primary-900 group-hover:underline">{item.title}</h3>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
