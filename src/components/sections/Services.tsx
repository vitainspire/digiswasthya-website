"use client";

import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, Megaphone, Stethoscope, Video, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Service {
    key: string;
    icon: LucideIcon;
    image: string;
}

const SERVICES: Service[] = [
    { key: "teleconsultation", icon: Video, image: "/images/resources/consultation.jpg" },
    { key: "primaryCheckup", icon: Stethoscope, image: "/images/resources/rural-clinic.jpg" },
    { key: "awarenessCamps", icon: Megaphone, image: "/images/impact-community.jpg" },
    { key: "diagnosticsEMR", icon: Activity, image: "/images/resources/telemedicine-team.jpg" },
];

export function Services() {
    const { t } = useLanguage();

    return (
        <section className="bg-primary-50 py-14 md:py-20" id="services">
            <div className="container max-w-6xl px-4">
                <div className="mx-auto mb-10 max-w-3xl text-center">
                    <h2 className="font-serif text-3xl font-bold leading-tight text-primary-900 md:text-4xl">
                        {t("services.titlePart1")} {t("services.titleHighlight")} {t("services.titlePart2")}
                    </h2>
                    <p className="mt-3 text-lg text-primary-900/80">{t("services.description")}</p>
                </div>

                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {SERVICES.map(({ key, icon: Icon, image }) => (
                        <li key={key} className="flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white">
                            <div className="relative h-44 w-full">
                                <Image
                                    src={image}
                                    alt={t(`services.items.${key}.title`)}
                                    fill
                                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-semibold leading-snug text-primary-900">{t(`services.items.${key}.title`)}</h3>
                                <p className="mt-2 text-base leading-relaxed text-gray-700">{t(`services.items.${key}.description`)}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-8 text-center">
                    <Link href="/about-us" className="inline-flex items-center gap-2 text-base font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                        {t("home.servicesMore")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
