"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Heart, MapPin, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

import { stories, testimonials } from "@/data/beneficiaryData";

const ITEMS_PER_PAGE = 3;

const carouselVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 35 : direction < 0 ? -35 : 0, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const } },
    exit: (direction: number) => ({ zIndex: 0, x: direction > 0 ? -35 : 35, opacity: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] as const } }),
};

export function BeneficiaryStories() {
    const { t } = useLanguage();
    const [[page, direction], setPageWithDir] = useState<[number, number]>([0, 0]);
    const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
    const currentTestimonials = testimonials.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    const paginate = (newDirection: number) => {
        setPageWithDir(([prevPage]) => [(prevPage + newDirection + totalPages) % totalPages, newDirection]);
    };

    const goToPage = (targetPage: number) => {
        setPageWithDir(([prevPage]) => [targetPage, targetPage > prevPage ? 1 : -1]);
    };

    return (
        <section className="bg-primary-50 py-14 md:py-20" id="testimonials">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="mx-auto mb-10 max-w-2xl text-center">
                    <h2 className="font-serif text-3xl font-bold leading-tight text-primary-900 md:text-4xl">
                        {t("beneficiaryStories.headingPart1")} {t("beneficiaryStories.headingHighlight")}
                    </h2>
                    <p className="mt-3 text-lg leading-relaxed text-primary-900/80">{t("beneficiaryStories.subheading")}</p>
                </div>

                <div className="mb-12">
                    <h3 className="mb-5 font-serif text-xl font-bold text-primary-900">{t("beneficiaryStories.writtenSectionTitle")}</h3>

                    <div className="relative mb-6 overflow-hidden">
                        <AnimatePresence mode="wait" custom={direction} initial={false}>
                            <motion.div
                                key={page}
                                custom={direction}
                                variants={carouselVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="grid grid-cols-1 gap-5 md:grid-cols-3"
                            >
                                {currentTestimonials.map((item, i) => (
                                    <div key={i} className="flex flex-col rounded-2xl border border-primary-100 bg-white p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-primary-100">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                                                ) : (
                                                    <span className="flex h-full w-full items-center justify-center font-serif text-2xl font-bold text-primary-700" aria-hidden="true">
                                                        {item.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold leading-tight text-primary-900">{item.name}</p>
                                                <p className="mt-0.5 text-sm font-medium text-primary-700">{item.problem}</p>
                                            </div>
                                        </div>
                                        <Quote className="mb-1 mt-5 h-5 w-5 flex-shrink-0 text-primary-300" aria-hidden="true" />
                                        <p className="font-serif text-base italic leading-relaxed text-gray-700">{item.body}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => paginate(-1)}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-700 transition-colors hover:border-primary-600 hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                            aria-label="Previous stories"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i)}
                                className="flex h-8 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-full"
                                aria-label={`Stories page ${i + 1}`}
                                aria-current={page === i}
                            >
                                <span className={`h-2 rounded-full transition-all duration-300 ${page === i ? "w-6 bg-primary-600" : "w-2 bg-primary-300"}`} />
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(1)}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-700 transition-colors hover:border-primary-600 hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                            aria-label="Next stories"
                        >
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div className="border-t border-primary-100 pt-10">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-serif text-xl font-bold text-primary-900">{t("beneficiaryStories.videoSectionTitle")}</h3>
                        <Link href="/media?tab=videos" className="inline-flex items-center gap-1.5 text-base font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                            More lives changed <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {stories.map((story, idx) => (
                            <div key={idx} className="overflow-hidden rounded-2xl border border-primary-100 bg-white">
                                <div className="flex aspect-video w-full items-center justify-center bg-primary-950">
                                    <video controls preload="metadata" className="block h-full w-full">
                                        <source src={story.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                <div className="p-5">
                                    <h4 className="text-lg font-semibold leading-tight text-primary-900">{story.name}</h4>
                                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary-600" aria-hidden="true" />
                                        {story.role} &bull; {story.age}
                                    </div>

                                    <p className="mt-3 text-sm leading-relaxed text-gray-700">
                                        <span className="font-semibold text-primary-900">{t("beneficiaryStories.challengeLabel")} </span>
                                        {story.condition}
                                    </p>

                                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-primary-100 bg-primary-50 p-3">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" aria-hidden="true" />
                                        <p className="text-sm font-medium leading-relaxed text-primary-900">{story.result}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Button asChild variant="donate" className="h-14 gap-2 rounded-xl px-9 text-lg">
                        <Link href="/donate">
                            <Heart className="h-5 w-5 fill-current" aria-hidden="true" /> {t("home.storiesDonate")}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
