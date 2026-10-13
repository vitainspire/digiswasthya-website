"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader } from "@/components/ui/section-header";
import { donationTiers, suggestedTier } from "@/data/donationTiers";

export function GiftTiers() {
    const { t } = useLanguage();
    const [monthly, setMonthly] = useState(false);

    return (
        <section className="section-y bg-white">
            <div className="container max-w-6xl px-4">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <SectionHeader eyebrow={t("home.giftsEyebrow")} title={t("home.giftsTitle")} lead={t("home.giftsSubtitle")} />

                    <div role="group" aria-label={t("home.giftFrequency")} className="flex shrink-0 gap-1 self-start rounded-xl bg-primary-50 p-1 md:self-end">
                        {[
                            { label: t("home.giftOneTime"), value: false },
                            { label: t("home.giftMonthly"), value: true },
                        ].map((option) => (
                            <button
                                key={option.label}
                                type="button"
                                aria-pressed={monthly === option.value}
                                onClick={() => setMonthly(option.value)}
                                className={`h-11 rounded-lg px-5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${
                                    monthly === option.value ? "bg-white text-primary-900 shadow-sm" : "text-primary-700 hover:text-primary-900"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                {monthly && <p className="mt-4 text-base text-gray-700">{t("home.giftMonthlyNote")}</p>}

                <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {donationTiers.map((tier) => {
                        const featured = tier.amount === suggestedTier;
                        const href = `/donate?amount=${tier.amount}${monthly ? "&frequency=monthly" : ""}`;
                        return (
                            <li
                                key={tier.amount}
                                className={`flex flex-col rounded-2xl border p-6 ${
                                    featured ? "border-2 border-primary-600 bg-white shadow-xl" : "border-primary-100 bg-primary-50"
                                }`}
                            >
                                <div className="flex items-baseline justify-between gap-2">
                                    <p className="font-serif text-3xl font-bold tabular-nums text-primary-900">
                                        ₹{tier.amount.toLocaleString("en-IN")}
                                        {monthly && <span className="ml-1 font-sans text-base font-medium text-gray-600">{t("home.perMonth")}</span>}
                                    </p>
                                    {featured && (
                                        <span className="rounded-full bg-primary-600 px-2.5 py-0.5 text-sm font-semibold text-white">{t("home.tierSuggested")}</span>
                                    )}
                                </div>
                                <p className="mt-3 flex-1 text-base leading-relaxed text-gray-700">{t(`home.tier${tier.amount}`)}</p>
                                {tier.impact && <p className="mt-2 text-base font-semibold text-primary-800">{tier.impact}</p>}
                                <Link
                                    href={href}
                                    className={`mt-5 inline-flex h-11 items-center justify-center rounded-xl border-2 border-primary-600 px-5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                                        featured ? "bg-primary-600 text-white hover:bg-primary-700" : "text-primary-700 hover:bg-primary-600 hover:text-white"
                                    }`}
                                >
                                    {t("home.giftsGive")} ₹{tier.amount.toLocaleString("en-IN")}
                                    {monthly && ` ${t("home.perMonth")}`}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
