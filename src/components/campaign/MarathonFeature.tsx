"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, MessageCircle, Timer } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatRaceDay, marathonCampaign } from "@/data/marathonCampaign";
import { countdownLabel, useCampaignPromoted, useDaysToRace } from "./useCampaign";
import { whatsappShareHref } from "./ShareCampaign";

const goal = `₹${marathonCampaign.goal.toLocaleString("en-IN")}`;

// `home` is the homepage feature, hidden once the campaign is over; `page` is the /marathon hero.
export function MarathonFeature({ variant }: { variant: "home" | "page" }) {
    const { t, language } = useLanguage();
    const promoted = useCampaignPromoted();
    const days = useDaysToRace();
    const isPage = variant === "page";
    const Heading = isPage ? "h1" : "h2";

    if (!isPage && !promoted) return null;

    return (
        <section className="overflow-hidden bg-primary-900 text-white" aria-labelledby={`marathon-${variant}-heading`}>
            <div className="container grid max-w-6xl items-center gap-12 px-4 py-14 md:py-20 lg:grid-cols-12 lg:gap-14">
                <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:col-span-5">
                    <div className="overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl">
                        <Image
                            src="/images/team/sandeep-kumar.jpg"
                            alt={t("campaign.photoAlt")}
                            width={609}
                            height={640}
                            sizes="(min-width: 1024px) 384px, (min-width: 640px) 384px, 320px"
                            className="h-auto w-full"
                            priority={isPage}
                        />
                    </div>

                    {/* Race bib with the date; the corner dots are its safety-pin holes. */}
                    <div className="absolute -bottom-6 -right-2 -rotate-3 rounded-xl bg-white px-5 pb-3 pt-4 text-center text-primary-950 shadow-xl sm:-right-8">
                        {["left-2 top-2", "right-2 top-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
                            <span key={pos} className={`absolute ${pos} h-1.5 w-1.5 rounded-full bg-primary-950/25`} aria-hidden="true" />
                        ))}
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-700">{t("campaign.eventName")}</p>
                        <p className="mt-1 font-serif text-3xl font-bold leading-none">{formatRaceDay(language, "short")}</p>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <p className="eyebrow eyebrow-on-dark">{t("campaign.eyebrow")}</p>
                    <Heading
                        id={`marathon-${variant}-heading`}
                        className={`mt-3 font-serif text-3xl font-bold leading-tight ${isPage ? "md:text-5xl" : "md:text-4xl"}`}
                    >
                        {t(isPage ? "campaign.pageHeading" : "campaign.featureHeading")}
                    </Heading>
                    {/* The page tells the founder story in full below, so its hero skips it. */}
                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-100">
                        {t(isPage ? "campaign.pageBody" : "campaign.featureBody").replace("{date}", formatRaceDay(language)).replace("{goal}", goal)}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                        <li className="rounded-full border border-white/25 px-4 py-2">
                            {t("campaign.goalLabel")}: {goal}
                        </li>
                        {days !== null && (
                            <li className="inline-flex items-center gap-2 rounded-full bg-secondary-400 px-4 py-2 text-primary-950">
                                <Timer className="h-4 w-4" aria-hidden="true" /> {countdownLabel(days, t)}
                            </li>
                        )}
                    </ul>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href={marathonCampaign.fundraiserUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary-400 px-7 text-base font-bold text-primary-950 shadow-sm transition-colors hover:bg-secondary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                        >
                            {t("campaign.donateCta")} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">{t("campaign.opensUnitedWay")}</span>
                        </a>
                        {isPage ? (
                            <a
                                href={whatsappShareHref(t)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/70 px-7 text-base font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                            >
                                <MessageCircle className="h-4 w-4" aria-hidden="true" /> {t("campaign.shareWhatsapp")}
                            </a>
                        ) : (
                            <Link
                                href="/marathon"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/70 px-7 text-base font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                            >
                                {t("campaign.learnMore")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        )}
                    </div>
                    <p className="mt-4 text-sm text-primary-200">{t("campaign.platformNote")}</p>
                </div>
            </div>
        </section>
    );
}
