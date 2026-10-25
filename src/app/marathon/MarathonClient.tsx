"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarathonFeature } from "@/components/campaign/MarathonFeature";
import { ShareCampaign } from "@/components/campaign/ShareCampaign";
import { useLanguage } from "@/context/LanguageContext";
import { impactAsOf, impactData } from "@/data/impactData";
import { marathonCampaign, teamRunners } from "@/data/marathonCampaign";

const IMPACT_KPI_IDS = ["total-consultations", "villages-covered", "health-camps", "cancer-screenings"];

export default function MarathonClient() {
    const { t, language } = useLanguage();
    const lang = language === "hi" ? "hi" : "en";

    const kpis = IMPACT_KPI_IDS.flatMap((id) => {
        const kpi = impactData.kpis.find((k) => k.id === id);
        return kpi ? [{ id, value: kpi.value, label: kpi.label[lang] }] : [];
    });
    const steps = [t("campaign.howStep1"), t("campaign.howStep2"), t("campaign.howStep3")];

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <MarathonFeature variant="page" />

            <section className="section-y bg-white">
                <div className="container max-w-3xl px-4">
                    <p className="eyebrow">{t("campaign.storyEyebrow")}</p>
                    <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-primary-900 md:text-4xl">{t("campaign.storyTitle")}</h2>
                    <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
                        <p>{t("founderTeaser.paragraph1")}</p>
                        <p>{t("founderTeaser.paragraph2")}</p>
                        <p>{t("campaign.storyRun")}</p>
                    </div>
                    <Link
                        href="/#founders-story"
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900"
                    >
                        {t("founderTeaser.readMore")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>

            <section className="section-y bg-primary-50">
                <div className="container max-w-6xl px-4">
                    <div className="max-w-2xl">
                        <h2 className="font-serif text-3xl font-bold leading-tight text-primary-900 md:text-4xl">{t("campaign.impactTitle")}</h2>
                        <p className="mt-4 text-lg leading-relaxed text-gray-700">{t("campaign.impactBody")}</p>
                    </div>
                    <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {kpis.map(({ id, value, label }) => (
                            <div key={id} className="rounded-2xl border border-primary-100 bg-white p-5 md:p-6">
                                <dt className="text-sm font-semibold text-gray-700 md:text-base">{label}</dt>
                                <dd className="mt-2 font-serif text-3xl font-bold text-primary-700 md:text-4xl">{value.toLocaleString("en-IN")}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-4 text-sm text-gray-600">{impactAsOf[lang]}</p>
                </div>
            </section>

            <section className="section-y bg-white">
                <div className="container grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:gap-14">
                    <div>
                        <h2 className="font-serif text-3xl font-bold leading-tight text-primary-900 md:text-4xl">{t("campaign.howTitle")}</h2>
                        <ol className="mt-6 space-y-5">
                            {steps.map((step, i) => (
                                <li key={step} className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800">
                                        {i + 1}
                                    </span>
                                    <p className="pt-1 text-lg leading-relaxed text-gray-800">{step}</p>
                                </li>
                            ))}
                        </ol>
                        <a
                            href={marathonCampaign.fundraiserUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary-400 px-7 text-base font-bold text-primary-950 shadow-sm transition-colors hover:bg-secondary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                        >
                            {t("campaign.donateCta")} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">{t("campaign.opensUnitedWay")}</span>
                        </a>
                        <p className="mt-6 text-base text-gray-700">
                            {t("campaign.directLead")}{" "}
                            <Link href="/donate" className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900">
                                {t("campaign.directCta")}
                            </Link>
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6 md:p-8">
                        <h2 className="font-serif text-2xl font-bold text-primary-900">{t("campaign.shareTitle")}</h2>
                        <p className="mb-6 mt-2 leading-relaxed text-gray-700">{t("campaign.shareBody")}</p>
                        <ShareCampaign />
                    </div>
                </div>
            </section>

            <section className="section-y bg-primary-50">
                <div className="container max-w-6xl px-4">
                    <div className="max-w-2xl">
                        <p className="eyebrow">{t("campaign.teamEyebrow")}</p>
                        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-primary-900 md:text-4xl">{t("campaign.teamTitle")}</h2>
                        <p className="mt-4 text-lg leading-relaxed text-gray-700">{t("campaign.teamBody")}</p>
                    </div>
                    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {teamRunners.map(({ name, fundraiserUrl }) => (
                            <li key={fundraiserUrl} className="flex items-center gap-4 rounded-2xl border border-primary-100 bg-white p-5">
                                <span
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 font-serif text-xl font-bold text-primary-800"
                                    aria-hidden="true"
                                >
                                    {name[lang].charAt(0)}
                                </span>
                                <div className="min-w-0">
                                    <p className="font-serif text-xl font-bold text-primary-900">{name[lang]}</p>
                                    <a
                                        href={fundraiserUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-flex items-center gap-1.5 font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                                    >
                                        {t("campaign.teamCta").replace("{name}", name[lang])} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                        <span className="sr-only">{t("campaign.opensUnitedWay")}</span>
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <Footer />
        </main>
    );
}
