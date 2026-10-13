"use client";

import Link from "next/link";
import { CalendarRange } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { impactData } from "@/data/impactData";

/**
 * Explains that the portal-driven charts on Our Impact start in January 2025, so visitors
 * don't mistake them for the all-time totals (since July 2020) shown on the home page.
 */
export function DataPeriodNotice({ updatedAt }: { updatedAt?: string }) {
    const { t, language } = useLanguage();
    const allTime = impactData.kpis.find((k) => k.id === "total-consultations")?.value ?? 0;
    const updated = updatedAt ? new Date(updatedAt) : null;
    const updatedLabel =
        updated && !Number.isNaN(updated.getTime())
            ? updated.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" })
            : null;

    return (
        <aside
            aria-labelledby="data-period-title"
            className="mb-6 flex flex-col gap-4 rounded-2xl border border-primary-200 border-l-[6px] border-l-primary-600 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:p-6"
        >
            <CalendarRange className="h-7 w-7 shrink-0 text-primary-600" aria-hidden="true" />
            <div className="min-w-0">
                <h2 id="data-period-title" className="font-serif text-xl font-bold text-primary-900 md:text-2xl">
                    {t("impactNotice.title")}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-gray-700 md:text-lg">{t("impactNotice.body")}</p>
                <p className="mt-2 text-base leading-relaxed text-gray-700 md:text-lg">
                    {t("impactNotice.allTime").replace("{value}", allTime.toLocaleString("en-IN"))}{" "}
                    <Link href="/" className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                        {t("impactNotice.allTimeLink")}
                    </Link>
                </p>
                {updatedLabel && (
                    <p className="mt-3 text-sm font-medium text-primary-800">
                        {t("impactNotice.updated")} {updatedLabel}
                    </p>
                )}
            </div>
        </aside>
    );
}
