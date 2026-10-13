"use client";

import { BadgeCheck, Building2, FileText, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { websiteConfig } from "@/data/websiteConfig";
import { donorLogos, partnerLogos } from "@/data/logosData";
import { LogoWall } from "@/components/sections/LogoWall";

export function TrustStrip() {
    const { t } = useLanguage();

    return (
        <section className="border-b border-primary-100 bg-white" aria-label={t("home.supportedBy")}>
            <ul className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-primary-100 px-4 py-5 text-sm font-medium text-primary-900">
                <li className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary-600" aria-hidden="true" /> {t("home.trust80g")}
                </li>
                <li className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary-600" aria-hidden="true" /> {t("home.trustSection8")}
                </li>
                <li className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary-600" aria-hidden="true" /> {t("home.trustCsr")}
                </li>
                <li>CIN U85300UP2021NPL146867</li>
                <li>
                    <a href={websiteConfig.annualReportsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline underline-offset-4 hover:text-primary-600">
                        <FileText className="h-5 w-5 text-primary-600" aria-hidden="true" /> {t("home.trustAnnual")}
                    </a>
                </li>
                <li>
                    <a href={websiteConfig.balanceSheetsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline underline-offset-4 hover:text-primary-600">
                        <FileText className="h-5 w-5 text-primary-600" aria-hidden="true" /> {t("home.trustBalance")}
                    </a>
                </li>
            </ul>

            <div className="container flex flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:gap-8">
                <p className="eyebrow shrink-0 text-center md:w-40 md:text-left">{t("home.supportedBy")}</p>
                <LogoWall logos={[...donorLogos, ...partnerLogos]} className="min-w-0 flex-1" />
            </div>
        </section>
    );
}
