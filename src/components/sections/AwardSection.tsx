"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function AwardSection() {
    const { t } = useLanguage();

    return (
        <section className="border-y border-primary-100 bg-primary-50 py-12 md:py-14" id="awards">
            <div className="container max-w-6xl px-4">
                <div className="grid items-center gap-8 md:grid-cols-[minmax(0,14rem)_1fr_auto] md:gap-10">
                    <div className="relative mx-auto aspect-square w-full max-w-[14rem] overflow-hidden rounded-2xl ring-1 ring-primary-900/10">
                        {/* The source image has a text panel on its right; crop to the photo half. */}
                        <Image
                            src="/images/award-recognition.png"
                            alt="DigiSwasthya Foundation receiving an award certificate"
                            fill
                            sizes="14rem"
                            className="object-cover object-left"
                        />
                    </div>

                    <div>
                        <p className="eyebrow">{t("award.badge")}</p>
                        <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-primary-900 md:text-3xl">
                            {t("award.titlePart1")} {t("award.titleHighlight")}
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-gray-700">{t("award.description")}</p>
                    </div>

                    <div className="flex items-center gap-4 md:flex-col md:items-center">
                        <div className="relative h-28 w-[4.3rem] shrink-0">
                            <Image
                                src="/images/gptw-certified-2025-2026.png"
                                alt="Great Place To Work Certified, Oct 2025 to Oct 2026, India"
                                fill
                                sizes="70px"
                                className="object-contain"
                            />
                        </div>
                        <p className="max-w-[10rem] text-sm font-medium text-primary-900 md:text-center">{t("home.gptw")}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
