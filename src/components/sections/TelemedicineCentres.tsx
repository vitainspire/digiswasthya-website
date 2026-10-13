"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ExternalLink, Phone, MessageCircle, Stethoscope, ClipboardCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { LiveCentre } from "@/data/centreData";
import { STATIC_CENTRES, CENTRE_PHONE } from "@/data/centreData";


const STATE_ORDER = ["Uttar Pradesh", "Maharashtra", "Bihar"];

function mapHref(centre: LiveCentre): string {
    if (centre.mapLink) return centre.mapLink;
    const query = `DigiSwasthya Telemedicine Centre ${centre.name}, ${centre.district}, ${centre.state} ${centre.pincode}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}


const JOURNEY_STEPS = [
    { icon: MessageCircle, key: "step1" },
    { icon: MapPin, key: "step2" },
    { icon: Stethoscope, key: "step3" },
    { icon: ClipboardCheck, key: "step4" },
];

export function TelemedicineCentres() {
    const { t } = useLanguage();
    const allCentres = STATIC_CENTRES;

    const grouped = STATE_ORDER.map((state) => ({
        state,
        centres: allCentres.filter((c) => c.state === state),
    })).filter((g) => g.centres.length > 0);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container px-4">
                <div className="max-w-2xl mb-14">
                    <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold uppercase tracking-widest mb-4">
                        <span className="h-px w-6 bg-primary-600" /> {t("centres.badge")}
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                        {t("centres.headingPart1")} <span className="text-primary-600">DigiSwasthya</span> {t("centres.headingPart2")}
                    </h2>
                    <p className="mt-4 text-gray-500 leading-relaxed">
                        {t("centres.subheading")}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-primary-700">
                        {allCentres.length} {t("centres.countSuffix")}
                    </p>
                </div>

                {/* How It Works — patient journey, so addresses below aren't just a wall of text */}
                <div className="mb-20 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-8">
                            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
                                {t("centres.howItWorksTitle")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {JOURNEY_STEPS.map((step, i) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={step.key} className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-600 text-white font-bold text-xs shrink-0">
                                                    {i + 1}
                                                </div>
                                                <Icon className="h-4.5 w-4.5 text-primary-600" />
                                            </div>
                                            <h4 className="text-base font-bold text-gray-900">
                                                {t(`centres.${step.key}Title`)}
                                            </h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {t(`centres.${step.key}Desc`)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-[420px] aspect-[4/3] sm:aspect-[16/12] rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-900/10 group bg-gray-950">
                                <Image
                                    src="/images/about/who-we-are.jpg"
                                    alt="DigiSwasthya Telemedicine Clinic Consultation in Action"
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/15 to-transparent" />
                                
                                {/* Floating Live Badge */}
                                <div className="absolute top-3.5 left-3.5">
                                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-primary-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white/50">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                        Live Clinic Desk
                                    </span>
                                </div>

                                {/* Bottom Caption Overlay */}
                                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                                    <p className="text-xs font-medium text-gray-100 flex items-center gap-1.5 drop-shadow">
                                        <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                                        Nurse-assisted consultation with specialist doctors
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Centres grouped by state */}
                <div className="space-y-12">
                    {grouped.map((group) => (
                        <div key={group.state}>
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-900">{group.state}</h3>
                                <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-2.5 py-0.5">
                                    {group.centres.length}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {group.centres.map((centre) => (
                                    <motion.div
                                        key={centre.code}
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.99 }}
                                        transition={{ duration: 0.2 }}
                                        className="group bg-white border border-gray-200/90 hover:border-primary-500 hover:ring-2 hover:ring-primary-500/15 shadow-sm hover:shadow-xl hover:shadow-gray-900/5 p-6 sm:p-7 rounded-2xl flex flex-col justify-between transition-all duration-300"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <span className="inline-block text-[11px] font-bold text-primary-700 bg-primary-50 border border-primary-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                        {centre.code}
                                                    </span>
                                                    <h4 className="text-xl font-bold text-primary-900 group-hover:text-primary-800 transition-colors mt-2">
                                                        {centre.name}
                                                    </h4>
                                                </div>
                                                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 group-hover:scale-125 transition-transform duration-200 mt-2 flex-shrink-0" />
                                            </div>

                                            <div className="space-y-2.5 my-5">
                                                <div className="flex items-start gap-2.5">
                                                    <MapPin className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors mt-0.5 flex-shrink-0" />
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {centre.address ? `${centre.address} – ` : ""}{centre.district}, {centre.state} &ndash; {centre.pincode}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Phone className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                                                    <a href={`tel:${CENTRE_PHONE.replace(/\s/g, "")}`} className="text-sm text-gray-600 hover:text-primary-600 font-medium">{CENTRE_PHONE}</a>
                                                </div>
                                            </div>
                                        </div>

                                        <a
                                            href={mapHref(centre)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-primary-600 group-hover:text-primary-700 text-sm font-bold border-t border-gray-100 pt-4 transition-colors"
                                        >
                                            {t("centres.viewOnMap")}{" "}
                                            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
