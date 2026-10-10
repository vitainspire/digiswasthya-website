"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export function FounderStoryTeaser() {
    const { t } = useLanguage();

    return (
        <section className="bg-white py-14 md:py-20">
            <div className="container px-4">
                <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
                    <div className="mx-auto flex flex-col items-center lg:mx-0">
                        <div className="relative h-60 w-60 overflow-hidden rounded-3xl border-4 border-white shadow-xl ring-1 ring-primary-100 lg:h-72 lg:w-72">
                            <Image
                                src="/images/sandeep-founder.webp"
                                alt="Sandeep Kumar, Founder, DigiSwasthya Foundation"
                                fill
                                sizes="288px"
                                className="object-cover object-top"
                            />
                        </div>
                        <p className="mt-5 text-center text-base font-semibold text-primary-900">{t("founderTeaser.signature")}</p>
                    </div>

                    <div>
                        <p className="text-base font-semibold text-primary-600">{t("founderTeaser.badge")}</p>
                        <h2 className="mb-5 mt-2 font-serif text-3xl font-bold leading-snug text-primary-900 md:text-4xl">
                            {t("founderTeaser.heading")}
                        </h2>
                        <div className="space-y-3 border-l-4 border-primary-200 pl-5 text-base leading-relaxed text-gray-700">
                            <p>{t("founderTeaser.paragraph1")}</p>
                            <p>{t("founderTeaser.paragraph2")}</p>
                        </div>
                        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                            <Button asChild variant="donate" className="h-12 gap-2 rounded-xl px-7 text-base">
                                <Link href="/donate">
                                    <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("home.foundersDonate")}
                                </Link>
                            </Button>
                            <Link
                                href="/about-us#sandeeps-story"
                                className="inline-flex items-center gap-2 text-base font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600"
                            >
                                {t("founderTeaser.readMore")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
