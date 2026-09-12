"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ContactActions } from "@/components/features/ContactActions";

import { useImpactData } from "@/hooks/useImpactData";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const count = useSpring(0, { stiffness: 50, damping: 30 });
    const display = useTransform(count, (latest) => Math.floor(latest).toLocaleString() + suffix);

    useEffect(() => {
        count.set(value);
    }, [count, value]);

    return <motion.span>{display}</motion.span>;
}

export function Hero() {
    const { t } = useLanguage();
    const { data: impact } = useImpactData();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = next (right-to-left), -1 = prev (left-to-right)

    const images = [
        "/images/Hero Image 1.png",
        "/images/Hero_Image 3.png",
        "/images/Hero_image4.png",
        "/images/Hero_image 5.png"
    ];

    const getVal = (id: string, fallback: number) => {
        const item = impact.kpis.find((k) => k.id === id);
        return item ? item.value : fallback;
    };

    const stats = [
        { label: "Patients Served", value: getVal("patients-served", 43418), suffix: "+" },
        { label: "Teleconsultations", value: getVal("total-consultations", 59674), suffix: "+" },
        { label: "Expert Doctors Onboard", value: getVal("expert-doctors", 125), suffix: "+" },
        { label: "Health Camps", value: getVal("health-camps", 5), suffix: "+" },
        { label: "Districts Covered", value: 60, suffix: "+" },
        { label: "Lives Impacted", value: getVal("lives-impacted", 2850000), suffix: "+" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [currentImageIndex, images.length]);

    const handleNext = () => {
        setDirection(1);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleDotClick = (index: number) => {
        setDirection(index > currentImageIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const setCurrentIndex = (index: number) => {
        setCurrentImageIndex(index);
    };

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? "8%" : "-8%",
            opacity: 0,
            scale: 1.03
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (dir: number) => ({
            x: dir < 0 ? "8%" : "-8%",
            opacity: 0,
            scale: 0.98
        })
    };

    return (
        <section className="relative min-h-[840px] sm:min-h-[780px] w-full flex items-center overflow-hidden bg-gray-950 group/hero pb-56 sm:pb-24">
            {/* Background Photo Slideshow with Smooth Medium Glide & Fade */}
            <div className="absolute inset-0 overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentImageIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "tween", ease: [0.25, 0.1, 0.25, 1.0], duration: 1.0 },
                            opacity: { duration: 0.85, ease: "easeInOut" },
                            scale: { duration: 1.0, ease: "easeOut" }
                        }}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('${images[currentImageIndex]}')`,
                        }}
                    />
                </AnimatePresence>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Static Navigation Arrow Buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Dot Indicators — positioned nicely above the stats bar on both mobile & desktop */}
            <div className="absolute bottom-[210px] sm:bottom-36 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-2.5 rounded-full transition-all duration-400 ${
                            currentImageIndex === index ? "bg-secondary-400 w-9 shadow-lg shadow-secondary-500/40" : "bg-white/30 hover:bg-white/60 w-2.5"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Content — Left aligned */}
            <div className="relative z-10 container mx-auto px-6 pt-24 pb-20 sm:py-28">
                <div className="max-w-2xl">

                    {/* Eyebrow label */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center gap-2.5 mb-6"
                    >
                        <span className="h-px w-10 bg-secondary-400" />
                        <span className="text-secondary-400 text-xs font-bold uppercase tracking-[0.2em]">
                            DigiSwasthya Foundation
                        </span>
                    </motion.div>

                    {/* Main headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                        className="font-serif text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.12] mb-6 drop-shadow-lg"
                    >
                        {t("hero.titlePart1")}{" "}
                        <span className="text-secondary-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                            {t("hero.titleHighlight")}
                        </span>{" "}
                        {t("hero.titlePart2")}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="text-base md:text-lg text-gray-300 font-normal mb-10 leading-relaxed max-w-xl"
                    >
                        {t("hero.subtitle")}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="/donate"
                            className="inline-block bg-secondary-500 hover:bg-secondary-400 text-white font-bold text-base px-9 py-4 rounded-xl transition-all duration-200 shadow-[0_4px_24px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_32px_rgba(245,158,11,0.5)] hover:-translate-y-0.5"
                        >
                            {t("nav.donate")}
                        </Link>
                        <Link
                            href="/network"
                            className="inline-block bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white font-semibold text-base px-9 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm hover:-translate-y-0.5"
                        >
                            {t("hero.bookConsultation")}
                        </Link>
                    </motion.div>

                    {/* Low-friction patient path: skip the page entirely, go straight to WhatsApp */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                        className="mt-6"
                    >
                        <ContactActions variant="compact" />
                        <p className="text-gray-400 text-xs mt-2">{t("hero.chatNowLabel")}</p>
                    </motion.div>
                </div>
            </div>

            {/* Stats bar — anchored to bottom, clickable bridge link with pulsing indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 hover:bg-black/65 backdrop-blur-md border-t border-white/10 transition-colors duration-300 group/stats"
            >
                <Link href="/our-impact" className="block cursor-pointer pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 relative">
                    {/* Pulsing Highlight Button centered & lifted upwards into the hero banner space */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[85%] sm:-translate-y-[60%] bg-secondary-500 hover:bg-secondary-400 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-xl shadow-secondary-500/40 border border-secondary-300 flex items-center gap-2 whitespace-nowrap transition-all duration-300 hover:scale-105">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span>{t("nav.impact") ? `${t("nav.impact")} - Click to View Details` : "Click to view detailed charts"}</span>
                    </div>

                    <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-6 relative">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center md:text-left">
                                <div className="text-2xl md:text-3xl font-bold text-secondary-400 group-hover/stats:text-secondary-300 transition-colors drop-shadow-sm">
                                    <Counter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                        
                        {/* Hover Hint Link */}
                        <div className="absolute right-0 bottom-[-14px] opacity-0 group-hover/stats:opacity-100 transition-opacity duration-300 text-[10px] font-bold text-secondary-400 tracking-widest hidden lg:block uppercase">
                            {t("nav.impact")} &rarr;
                        </div>
                    </div>
                </Link>
            </motion.div>
        </section>
    );
}
