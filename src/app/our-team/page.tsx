import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TeamCard } from "@/components/ui/cards";
import { VolunteerCTA } from "@/components/sections/VolunteerCTA";
import { ogImages } from "@/lib/seo";
import {
    board,
    coreTeam as core,
    foundingTeam as founding,
    advisoryBoard as advisory,
    doctorGroups,
    onGroundTeam as onGround,
} from "@/data/teamData";

export const metadata: Metadata = {
    title: "Our Team",
    description:
        "Meet the board, core team, doctors, and on-ground staff behind DigiSwasthya Foundation's rural healthcare mission. Join us as a volunteer.",
    alternates: { canonical: "/our-team" },
    openGraph: {
    images: ogImages,
        title: "Our Team | DigiSwasthya Foundation",
        description: "Meet the people behind DigiSwasthya Foundation's rural healthcare mission.",
        url: "/our-team",
    },
};


function Section({ title, members }: { title: string, members: { name: string, role: string, image?: string }[] }) {
    return (
        <section className="py-6 sm:py-8 border-b border-gray-200/60 last:border-b-0">
            <div className="text-center mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary-900 border-b-2 border-primary-600/40 pb-2 inline-block mx-auto">
                    {title}
                </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {members.map((m, i) => (
                    <TeamCard key={i} name={m.name} role={m.role} image={m.image} />
                ))}
            </div>
        </section>
    );
}

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function DoctorsSection({ groups }: { groups: typeof doctorGroups }) {
    return (
        <section id="doctors" className="py-6 sm:py-8 border-b border-gray-200/60">
            <div className="text-center mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary-900 border-b-2 border-primary-600/40 pb-2 inline-block mx-auto">
                    Doctors Onboard
                </h2>
            </div>

            <nav aria-label="Jump to a speciality" className="mb-8 flex flex-wrap justify-center gap-2">
                {groups.map((group) => (
                    <a
                        key={group.speciality}
                        href={`#${slug(group.speciality)}`}
                        className="rounded-full border border-primary-200 bg-white px-3 py-1 text-sm font-medium text-primary-800 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                    >
                        {group.speciality}
                    </a>
                ))}
            </nav>

            <div className="space-y-10">
                {groups.map((group) => (
                    <div key={group.speciality} id={slug(group.speciality)} className="scroll-mt-28">
                        <div className="mb-4 flex items-center gap-4">
                            <h3 className="font-serif text-xl font-bold text-primary-900">{group.speciality}</h3>
                            <span className="h-px flex-1 bg-primary-200" aria-hidden="true" />
                            <span className="text-sm font-medium text-primary-700">{group.members.length}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                            {group.members.map((m, i) => (
                                <TeamCard key={i} name={m.name} role={m.role} image={m.image} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function OurTeam() {
    return (
        <main className="min-h-screen bg-surface">
            <Navbar />

            <PageHero
                title="Our Team"
                subtitle="The compassionate minds, specialist doctors, and grassroots leaders behind DigiSwasthya."
            />

            {/* Certification Banner */}
            <div className="max-w-4xl mx-auto px-4 mt-8">
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        <Image
                            src="/images/gptw-certified-2025-2026.png"
                            alt="Great Place to Work Certified, October 2025 to October 2026, India"
                            width={96}
                            height={157}
                            className="h-auto w-24"
                        />
                    </div>
                    <div className="text-center sm:text-left space-y-1.5">
                        <h3 className="text-lg font-bold text-gray-900">Great Place to Work Certified™</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl font-medium">
                            We are delighted to share that DigiSwasthya Foundation was certified as a <span className="text-gray-700 font-semibold">Great Place to Work (2025–2026)</span> under the category of Non-profit and Charity Organizations. This recognition highlights our team&apos;s commitment to building a workplace rooted in trust, respect, and mutual support.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container">
                <Section title="Board of Directors" members={board} />
                <Section title="Core Team" members={core} />
                <Section title="Founding Team" members={founding} />
                <Section title="Advisory Board" members={advisory} />
                <DoctorsSection groups={doctorGroups} />
                <Section title="On-Ground Team" members={onGround} />
            </div>

            {/* Volunteer CTA Section */}
            <VolunteerCTA />

            <Footer />
        </main>
    );
}
