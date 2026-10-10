"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useImpactData } from "@/hooks/useImpactData";
import { websiteConfig } from "@/data/websiteConfig";

const SLIDES = [
    "/images/hero/hero-1.webp",
    "/images/hero/hero-2.webp",
    "/images/hero/hero-3.webp",
    "/images/hero/hero-4.webp",
];

const HERO_STAT_IDS = ["total-consultations", "villages-covered", "health-camps", "cancer-screenings"];

function Counter({ value }: { value: number }) {
    const count = useSpring(0, { stiffness: 50, damping: 30 });
    const display = useTransform(count, (latest) => Math.floor(latest).toLocaleString("en-IN"));

    useEffect(() => {
        count.set(value);
    }, [count, value]);

    return <motion.span>{display}</motion.span>;
}

export function Hero() {
    const { t, language } = useLanguage();
    const lang = language === "hi" ? "hi" : "en";
    const { data: impact } = useImpactData();
    const reduced = useReducedMotion();

    const [current, setCurrent] = useState(0);
    const [baseMounted, setBaseMounted] = useState(1);
    const mounted = Math.min(SLIDES.length, Math.max(baseMounted, current + 2));

    useEffect(() => {
        const timer = setTimeout(() => setBaseMounted(2), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (reduced) return;
        const timer = setInterval(() => setCurrent((prev) => (prev + 1) % SLIDES.length), 6000);
        return () => clearInterval(timer);
    }, [reduced, current]);

    const stats = HERO_STAT_IDS.flatMap((id) => {
        const kpi = impact.kpis.find((k) => k.id === id);
        return kpi ? [{ id, value: kpi.value, label: kpi.label[lang] }] : [];
    });
    const subtitle = t("hero.subtitle");
    const whatsappLink = `https://wa.me/${websiteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hello DigiSwasthya, I have a query.")}`;

    return (
        <section className="flex w-full flex-col bg-primary-950">
            <div className="relative flex min-h-[600px] items-center overflow-hidden md:min-h-[680px]">
                <div className="absolute inset-0">
                    {SLIDES.slice(0, mounted).map((src, index) => (
                        <Image
                            key={src}
                            src={src}
                            alt=""
                            fill
                            sizes="100vw"
                            priority={index === 0}
                            className={`object-cover transition-opacity duration-1000 ${current === index ? "opacity-100" : "opacity-0"}`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
                </div>

                <div className="relative z-10 container px-6 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <motion.h1
                            initial={reduced ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="font-serif text-4xl font-bold leading-[1.12] text-white drop-shadow-lg md:text-5xl lg:text-[3.5rem]"
                        >
                            {t("hero.title")}
                        </motion.h1>
                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">{subtitle}</p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
                            <div className="flex flex-col items-start gap-2">
                                <Button asChild variant="donate" className="h-14 gap-2 rounded-xl px-9 text-lg">
                                    <Link href="/donate">
                                        <Heart className="h-5 w-5 fill-current" aria-hidden="true" /> {t("nav.donate")}
                                    </Link>
                                </Button>
                                <p className="text-sm text-white/80">{t("hero.donateNote")}</p>
                            </div>
                            <Link
                                href="/network"
                                className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/70 bg-black/50 px-8 text-lg font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
                            >
                                {t("hero.bookConsultation")}
                            </Link>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-base text-white">
                            <Link href="/join-us" className="font-semibold underline underline-offset-4 hover:text-secondary-300">
                                {t("hero.joinUs")}
                            </Link>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 font-semibold underline underline-offset-4 hover:text-secondary-300"
                            >
                                <MessageCircle className="h-4 w-4" aria-hidden="true" /> {t("hero.whatsapp")}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1">
                    <button
                        onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        aria-label="Previous photo"
                    >
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className="flex h-6 w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
                            aria-label={`Show photo ${index + 1}`}
                            aria-current={current === index}
                        >
                            <span className={`h-2.5 rounded-full transition-all duration-300 ${current === index ? "w-8 bg-secondary-400" : "w-2.5 bg-white/50"}`} />
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        aria-label="Next photo"
                    >
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="bg-primary-900">
                <div className="container px-6 py-6">
                    <dl className="grid max-w-4xl grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.id}>
                                <dd className="font-serif text-3xl font-bold text-white md:text-4xl">
                                    {reduced ? stat.value.toLocaleString("en-IN") : <Counter value={stat.value} />}
                                </dd>
                                <dt className="mt-1 text-sm font-medium text-primary-100">{stat.label}</dt>
                            </div>
                        ))}
                    </dl>
                    <Link href="/our-impact" className="mt-5 inline-block text-sm font-semibold text-white underline underline-offset-4 hover:text-secondary-300">
                        {t("hero.seeImpact")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
