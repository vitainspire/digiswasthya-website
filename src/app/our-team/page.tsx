import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TeamCard } from "@/components/ui/cards";
import { VolunteerCTA } from "@/components/sections/VolunteerCTA";
import {
    board,
    coreTeam as core,
    foundingTeam as founding,
    advisoryBoard as advisory,
    doctors,
    onGroundTeam as onGround,
} from "@/data/teamData";

export const metadata: Metadata = {
    title: "Our Team",
    description:
        "Meet the board, core team, doctors, and on-ground staff behind DigiSwasthya Foundation's rural healthcare mission. Join us as a volunteer.",
    alternates: { canonical: "/our-team" },
    openGraph: {
        title: "Our Team | DigiSwasthya Foundation",
        description: "Meet the people behind DigiSwasthya Foundation's rural healthcare mission.",
        url: "/our-team",
    },
};


function Section({ title, members }: { title: string, members: { name: string, role: string, image?: string }[] }) {
    return (
        <section className="py-6 sm:py-8 border-b border-gray-200/60 last:border-b-0">
            <div className="text-center mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 border-b-2 border-primary-600/40 pb-2 inline-block mx-auto">
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

export default function OurTeam() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Header (Luminous & Professional Light Design) */}
            <section className="relative bg-gradient-to-b from-[#f4f9f6] via-[#ebf6f0] to-[#f8fcf9] border-b border-emerald-100/80 py-8 sm:py-10 lg:py-12 overflow-hidden text-center">
                {/* Subtle background ambient mesh & glows */}
                <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#059669_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-emerald-200/35 blur-3xl pointer-events-none rounded-full" />
                <div className="absolute top-1/3 right-10 w-[260px] h-[160px] bg-teal-200/25 blur-3xl pointer-events-none rounded-full" />

                <div className="container max-w-3xl relative z-10 px-4 mx-auto space-y-2.5">
                    {/* Decorative Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider shadow-xs border border-emerald-200/80 backdrop-blur-sm mx-auto">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Dedicated Leadership & Caregivers
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                        Our <span className="bg-gradient-to-r from-emerald-700 via-primary-700 to-teal-700 bg-clip-text text-transparent">Team</span>
                    </h1>

                    <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
                        The compassionate minds, specialist doctors, and grassroots leaders behind DigiSwasthya.
                    </p>
                </div>
            </section>

            {/* Certification Banner */}
            <div className="max-w-4xl mx-auto px-4 mt-8">
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        <svg width="80" height="96" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-sm rounded">
                            {/* Top Red Square */}
                            <rect width="80" height="60" rx="4" fill="#DA291C" />
                            <text x="10" y="16" fill="white" fontFamily="sans-serif" fontWeight="900" fontSize="10" letterSpacing="-0.2">Great</text>
                            <text x="10" y="27" fill="white" fontFamily="sans-serif" fontWeight="900" fontSize="10" letterSpacing="-0.2">Place</text>
                            <text x="10" y="38" fill="white" fontFamily="sans-serif" fontWeight="900" fontSize="10" letterSpacing="-0.2">To</text>
                            <text x="10" y="49" fill="white" fontFamily="sans-serif" fontWeight="900" fontSize="10" letterSpacing="-0.2">Work®</text>
                            
                            {/* Bottom Blue Banner */}
                            <path d="M0 60 H80 V88 L40 96 L0 88 Z" fill="#0A2240" />
                            <text x="40" y="71" fill="white" fontFamily="sans-serif" fontWeight="bold" fontSize="8" textAnchor="middle" letterSpacing="0.5">Certified</text>
                            <text x="40" y="80" fill="#FFC72C" fontFamily="sans-serif" fontWeight="bold" fontSize="5" textAnchor="middle">AUG 2023 - AUG 2024</text>
                            <text x="40" y="87" fill="white" fontFamily="sans-serif" fontWeight="bold" fontSize="5" textAnchor="middle">INDIA</text>
                        </svg>
                    </div>
                    <div className="text-center sm:text-left space-y-1.5">
                        <h3 className="text-lg font-bold text-gray-900">Great Place to Work Certified™</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl font-medium">
                            We are delighted to share that DigiSwasthya Foundation was certified as a <span className="text-gray-700 font-semibold">Great Place to Work (2023–2024)</span> under the category of Non-profit and Charity Organizations. This recognition highlights our team&apos;s commitment to building a workplace rooted in trust, respect, and mutual support.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container">
                <Section title="Board of Directors" members={board} />
                <Section title="Core Team" members={core} />
                <Section title="Founding Team" members={founding} />
                <Section title="Advisory Board" members={advisory} />
                <Section title="Doctors Onboard" members={doctors} />
                <Section title="On-Ground Team" members={onGround} />
            </div>

            {/* Volunteer CTA Section */}
            <VolunteerCTA />

            <Footer />
        </main>
    );
}
