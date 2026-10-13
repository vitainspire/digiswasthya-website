"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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

export function FounderStory() {
    const { t } = useLanguage();
    const [expanded, setExpanded] = useState(false);
    const shown = expanded ? PARAGRAPHS : [t("founderTeaser.paragraph1"), t("founderTeaser.paragraph2")];

    return (
        <section id="founders-story" className="section-y scroll-mt-20 bg-white">
            <div className="container max-w-6xl px-4">
                <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-7">
                        <p className="eyebrow">{t("founderTeaser.badge")}</p>
                        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-primary-900 md:text-4xl">{t("founderTeaser.heading")}</h2>

                        <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
                            {shown.map((paragraph) => (
                                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setExpanded(!expanded)}
                            aria-expanded={expanded}
                            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl border-2 border-primary-600 px-5 text-base font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                        >
                            {expanded ? (
                                <>{t("home.founderShowLess")} <ChevronUp className="h-4 w-4" aria-hidden="true" /></>
                            ) : (
                                <>{t("home.founderReadFull")} <ChevronDown className="h-4 w-4" aria-hidden="true" /></>
                            )}
                        </button>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-primary-100 bg-white p-2 shadow-lg">
                            <video controls preload="metadata" className="aspect-[4/3] h-auto w-full rounded-2xl bg-black object-contain">
                                <source src="/Videos/Motive (Digiswasthya).mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <p className="mt-3 text-center text-base font-medium text-primary-800">{t("home.founderVideoCaption")}</p>
                    </div>
                </div>

                <figure className="mt-14 border-l-4 border-primary-600 pl-6 md:mt-16 md:pl-8">
                    <blockquote className="font-serif text-2xl font-medium italic leading-snug text-primary-900 md:text-3xl">
                        &ldquo;{t("home.founderQuote")}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 text-base font-semibold text-primary-700">{t("founderTeaser.signature")}</figcaption>
                </figure>
            </div>
        </section>
    );
}
