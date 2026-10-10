"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function VideoHighlight() {
    const { t } = useLanguage();

    return (
        <section className="bg-primary-900 py-14 md:py-20">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                    <div>
                        <h2 className="mb-5 font-serif text-3xl font-bold leading-snug text-white md:text-4xl">See DigiSwasthya in action</h2>
                        <p className="text-lg leading-relaxed text-primary-100">
                            Watch how we are bringing specialist healthcare to the doorstep of rural communities across India through technology-enabled telemedicine centres.
                        </p>
                        <Button asChild variant="donate" className="mt-7 h-12 gap-2 rounded-xl px-7 text-base">
                            <Link href="/donate">
                                <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("home.foundersDonate")}
                            </Link>
                        </Button>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-white/10">
                        <iframe
                            className="absolute inset-0 h-full w-full"
                            src="https://www.youtube.com/embed/KOQjv1xyfkg?autoplay=0&rel=0&modestbranding=1"
                            title="DigiSwasthya Impact Video"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
