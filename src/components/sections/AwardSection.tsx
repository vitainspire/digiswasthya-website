"use client";

import Image from "next/image";
import { Award, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function AwardSection() {
    const { t } = useLanguage();

    return (
        <section className="bg-primary-50 py-14 md:py-20" id="awards">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="rounded-3xl border border-primary-100 bg-white p-6 sm:p-8 md:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                        
                        {/* Image Side - Larger, Clearer Frame */}
                        <div className="lg:col-span-6 flex justify-center">
                            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-primary-900/10 bg-primary-50 group">
                                <Image
                                    src="/images/award-recognition.png"
                                    alt="DigiSwasthya Award Recognition"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent pointer-events-none" />
                                
                                {/* Floating Category Badge */}
                                <div className="absolute top-3.5 left-3.5">
                                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-primary-900 text-sm font-semibold px-3 py-1 rounded-full shadow-xs border border-white/60">
                                        <Award className="w-4 h-4 text-primary-600" />
                                        National Recognition
                                    </span>
                                </div>

                                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                                    <p className="text-sm font-medium text-white drop-shadow">
                                        Honoring rural healthcare innovation & technology impact
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Side - Refined & Balanced */}
                        <div className="lg:col-span-6 space-y-4">
                            <div>
                                <p className="text-base font-semibold text-primary-600">{t("award.badge")}</p>
                                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-primary-900">
                                    {t("award.titlePart1")} {t("award.titleHighlight")}
                                </h2>
                            </div>

                            {/* Quote Box */}
                            <div className="bg-primary-50 border-l-4 border-primary-600 rounded-r-xl p-4 my-2">
                                <p className="text-base text-gray-800 font-medium italic leading-relaxed">
                                    {t("award.quote")}
                                </p>
                            </div>

                            <p className="text-base text-gray-700 leading-relaxed">
                                {t("award.description")}
                            </p>

                            {/* Trust Badges */}
                            <div className="pt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-primary-800 border-t border-primary-100">
                                <span className="inline-flex items-center gap-1.5 text-primary-700">
                                    <CheckCircle2 className="w-4 h-4" /> Institutional Recognition
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-primary-700">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Non-Profit Care
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-primary-700">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> 80G Tax Exempted
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
