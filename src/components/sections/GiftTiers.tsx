"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { donationTiers, suggestedTier } from "@/data/donationTiers";

export function GiftTiers() {
    const { t } = useLanguage();

    return (
        <section className="bg-white py-14 md:py-20">
            <div className="container max-w-6xl px-4">
                <div className="max-w-2xl">
                    <h2 className="font-serif text-3xl font-bold text-primary-900 md:text-4xl">{t("home.giftsTitle")}</h2>
                    <p className="mt-3 text-lg text-primary-900/80">{t("home.giftsSubtitle")}</p>
                </div>

                <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {donationTiers.map((tier) => (
                        <li key={tier.amount} className="flex flex-col rounded-2xl border border-primary-100 bg-primary-50 p-6">
                            <div className="flex items-baseline justify-between gap-2">
                                <p className="font-serif text-3xl font-bold text-primary-900">₹{tier.amount.toLocaleString("en-IN")}</p>
                                {tier.amount === suggestedTier && (
                                    <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-800">{t("home.tierSuggested")}</span>
                                )}
                            </div>
                            <p className="mt-3 flex-1 text-base leading-relaxed text-gray-700">{t(`home.tier${tier.amount}`)}</p>
                            {tier.impact && <p className="mt-2 text-base font-semibold text-primary-800">{tier.impact}</p>}
                            <Link
                                href={`/donate?amount=${tier.amount}`}
                                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border-2 border-primary-600 px-5 text-base font-semibold text-primary-700 transition-colors hover:bg-primary-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                            >
                                {t("home.giftsGive")} ₹{tier.amount.toLocaleString("en-IN")}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
