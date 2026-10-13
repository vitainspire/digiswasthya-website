"use client";

import { ArrowRight, CheckCircle2, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { stories, testimonials } from "@/data/beneficiaryData";

const FEATURED_NAME = "Manisha Kumari";

export function BeneficiaryStories() {
    const { t } = useLanguage();
    const featured = testimonials.find((item) => item.name === FEATURED_NAME) ?? testimonials[0];
    const others = testimonials.filter((item) => item !== featured);

    return (
        <section className="section-y bg-primary-50" id="testimonials">
            <div className="container mx-auto max-w-6xl px-4">
                <SectionHeader
                    eyebrow={t("beneficiaryStories.badge")}
                    title={`${t("beneficiaryStories.headingPart1")} ${t("beneficiaryStories.headingHighlight")}`}
                    lead={t("beneficiaryStories.subheading")}
                />

                <figure className="mt-12 grid items-center gap-8 rounded-3xl bg-primary-900 p-8 md:grid-cols-[auto_1fr] md:gap-12 md:p-12">
                    <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full ring-4 ring-primary-600 md:h-40 md:w-40">
                        {featured.image ? (
                            <Image src={featured.image} alt={featured.name} fill sizes="160px" className="object-cover" />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center bg-primary-700 font-serif text-5xl font-bold text-white" aria-hidden="true">
                                {featured.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="eyebrow eyebrow-on-dark">{featured.problem}</p>
                        <blockquote className="mt-3 font-serif text-xl leading-relaxed text-white md:text-2xl">{featured.body}</blockquote>
                        <figcaption className="mt-5 text-lg font-semibold text-primary-100">{featured.name}</figcaption>
                    </div>
                </figure>

                <div className="mt-14">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-serif text-2xl font-bold text-primary-900">{t("beneficiaryStories.videoSectionTitle")}</h3>
                        <Link href="/media?tab=videos" className="inline-flex items-center gap-1.5 text-base font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-600">
                            {t("home.storiesMore")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {stories.map((story) => (
                            <div key={story.name} className="overflow-hidden rounded-2xl border border-primary-100 bg-white">
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

                                    <p className="mt-3 text-base leading-relaxed text-gray-700">
                                        <span className="font-semibold text-primary-900">{t("beneficiaryStories.challengeLabel")} </span>
                                        {story.condition}
                                    </p>

                                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-primary-100 bg-primary-50 p-3">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" aria-hidden="true" />
                                        <p className="text-base font-medium leading-relaxed text-primary-900">{story.result}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-14">
                    <h3 className="mb-5 font-serif text-2xl font-bold text-primary-900">{t("beneficiaryStories.writtenSectionTitle")}</h3>
                    <ul
                        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:[mask-image:linear-gradient(to_right,black_88%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                        tabIndex={0}
                        aria-label={t("beneficiaryStories.writtenSectionTitle")}
                    >
                        {others.map((item) => (
                            <li key={item.name} className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-primary-100 bg-white p-6 sm:w-80">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-primary-100">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                                        ) : (
                                            <span className="flex h-full w-full items-center justify-center font-serif text-xl font-bold text-primary-700" aria-hidden="true">
                                                {item.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold leading-tight text-primary-900">{item.name}</p>
                                        <p className="mt-0.5 text-sm font-medium text-primary-700">{item.problem}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-base leading-relaxed text-gray-700">{item.body}</p>
                            </li>
                        ))}
                    </ul>
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
