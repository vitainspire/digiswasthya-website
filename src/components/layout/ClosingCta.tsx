"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function ClosingCta() {
    const { t } = useLanguage();

    return (
        <section className="bg-primary-900 py-12 md:py-16">
            <div className="container flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
                <div className="text-center md:text-left">
                    <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">{t("closingCta.heading")}</h2>
                    <p className="mt-2 max-w-xl text-lg text-primary-100">{t("closingCta.body")}</p>
                </div>
                <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
                    <Button asChild variant="donate" className="h-12 gap-2 whitespace-nowrap rounded-xl px-7 text-base">
                        <Link href="/donate">
                            <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("nav.donate")}
                        </Link>
                    </Button>
                    <Link
                        href="/contact-us#donor"
                        className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-white/70 px-7 text-base font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                    >
                        {t("nav.joinUs")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
