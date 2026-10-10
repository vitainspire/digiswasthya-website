"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const PARAGRAPHS = [
    "In 2007, Sandeep was unwell. He wandered from one hospital to another but did not get the right diagnosis due to lack of qualified doctors and under-equipped hospitals in Sant-Kabir-Nagar, a small district in Uttar Pradesh. Lack of access to guidance of what needed to be done added to the worries.",
    "After 6-months, he got a biopsy done and was diagnosed with Ewing-Sarcoma (a type of bone-cancer). His whole right-humerus-bone was replaced. Doctors later proclaimed that Sandeep would have become immobilized if diagnosis would have been delayed.",
    "Over the next few months, he recovered slowly at Tata Memorial Hospital, Mumbai. However, the journey from being clueless as to what was the cause of his ailment to being detected with cancer, to gradually recovering, was nothing less than a miracle for him and his family.",
    "Sandeep was determined to give back to the society and started working with social-sector organizations (health) from 2015 to 2020. He devoted himself to work for thousands of cancer patients, cancer-survivors, and their families, providing them guidance, emotional support, financial support for their diagnostics, treatment, care and education.",
    "While his work created a positive impact on the lives of several patients, he realized that his ultimate calling was to go back to the grassroots and address the challenges from where they initiate – villages where there is lack of awareness of health issues and lack of access to healthcare infrastructure. Sandeep took a break from his job, and started conceiving an idea around how by leveraging technology, he can address the challenges he had earlier identified and make primary healthcare affordable and accessible in rural areas, where more than 65% of India's 1.4 Billion population live. After numerous interviews with people living in these areas, discussions with senior administrators of India's biggest hospitals, professors and government officials and evaluation of how other developing nations are handling the problem, Sandeep conceived the idea of DigiSwasthya (Digi=Digital, Swasthya = Health). He invested most of his savings till then to establish DigiSwasthya's 1st telemedicine clinic in July 2020 in his home district, Sant-Kabir-Nagar.",
    "By creating a full stack primary healthcare platform, from creating a safe and hygienic physical space for patients to come, hiring trained nursing staff, creating tie-ups with doctors from prominent city hospitals, onboarding a tele-medicine software and hardware, to getting prescriptions fulfilled from adjoining pharmacies, Sandeep created one of the state's 1st hybrid medical consultation facility.",
    "By creating a network of such standardized clinics across India, Sandeep and his motivated team is on a mission \"to transform the country's primary healthcare system and make healthcare services affordable and accessible for rural communities by leveraging technology\".",
];

const VISIBLE_PARAGRAPHS = 3;

export function FounderStory() {
    const { t } = useLanguage();
    const [expanded, setExpanded] = useState(false);
    const shown = expanded ? PARAGRAPHS : PARAGRAPHS.slice(0, VISIBLE_PARAGRAPHS);

    return (
        <section id="founders-story" className="scroll-mt-20 bg-white py-14 md:py-20">
            <div className="container max-w-6xl px-4">
                <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-7">
                        <h2 className="font-serif text-3xl font-bold text-primary-900 md:text-4xl">Our Founder&apos;s Story</h2>
                        <p className="mt-2 text-lg font-medium text-primary-700">Sandeep Kumar, Founder and CEO</p>

                        <div className="mt-6 space-y-4 border-l-4 border-primary-200 pl-5 text-base leading-relaxed text-gray-700">
                            {shown.map((paragraph) => (
                                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setExpanded(!expanded)}
                                aria-expanded={expanded}
                                className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-primary-600 px-5 text-base font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                            >
                                {expanded ? (
                                    <>Show less <ChevronUp className="h-4 w-4" aria-hidden="true" /></>
                                ) : (
                                    <>Read full story <ChevronDown className="h-4 w-4" aria-hidden="true" /></>
                                )}
                            </button>
                            <Button asChild variant="donate" className="h-12 gap-2 rounded-xl px-7 text-base">
                                <Link href="/donate">
                                    <Heart className="h-4 w-4 fill-current" aria-hidden="true" /> {t("home.foundersDonate")}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-primary-100 bg-white p-2 shadow-lg">
                            <video controls preload="metadata" className="aspect-[4/3] h-auto w-full rounded-2xl bg-black object-contain">
                                <source src="/Videos/Motive (Digiswasthya).mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <p className="mt-3 text-center text-base font-medium text-primary-800">Why Sandeep Started DigiSwasthya</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
