"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
    Users,
    Stethoscope,
    Activity,
    HeartHandshake,
    ShieldCheck,
    CheckCircle,
    FileText,
    ExternalLink,
    Quote,
    Megaphone,
    Info,
    Database,
    Clock,
    RefreshCcw,
    ClipboardList,
    ArrowRight
} from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

/* Fade-in-up for cards with stagger support */
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay, ease: "easeOut" as const }
    })
};

export default function AboutUs() {
    return (
        <main className="min-h-screen bg-[#f5f7fa]">
            <Navbar />

            {/* Header / Hero */}
            <section className="relative bg-primary-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                </div>
                <div className="container relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Our Commitment to <span className="text-secondary-400 font-extrabold">Excellence</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-primary-100 max-w-2xl mx-auto text-lg md:text-xl font-light"
                    >
                        Dedicated to transforming healthcare accessibility in rural India through transparency, technology, and empathy.
                    </motion.p>
                </div>
            </section>

            {/* 1. Mission, Vision & Goal Block */}
            <section className="py-20 bg-[#f5f7fa]">
                <div className="container">
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

                    {/* Vision */}
                    <motion.div
                        custom={0}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
                        transition={{ type: "tween", duration: 0.22 }}
                        className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col group cursor-default"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="text-primary-600 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed text-lg italic flex-grow">
                            "A world in which every human being's life is equally valued irrespective of caste, gender or economic status."
                        </p>
                        <div className="flex items-center gap-1 mt-6 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs font-semibold tracking-wide">Learn more</span>
                            <ArrowRight
                                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]"
                            />
                        </div>
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        custom={0.12}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
                        transition={{ type: "tween", duration: 0.22 }}
                        className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col group cursor-default"
                    >
                        <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-6">
                            <Activity className="text-secondary-600 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed text-lg flex-grow">
                            "Making healthcare services affordable and accessible for rural communities across India by leveraging technology and grassroots outreach."
                        </p>
                        <div className="flex items-center gap-1 mt-6 text-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs font-semibold tracking-wide">Learn more</span>
                            <ArrowRight
                                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]"
                            />
                        </div>
                    </motion.div>

                    {/* Goal */}
                    <motion.div
                        custom={0.22}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
                        transition={{ type: "tween", duration: 0.22 }}
                        className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col group cursor-default"
                    >
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                            <HeartHandshake className="text-amber-600 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Goal</h3>
                        <p className="text-gray-600 leading-relaxed text-lg flex-grow">
                            "To establish DigiSwasthya centers across India, especially in aspirational districts, becoming a trusted healthcare partner providing the right direction, information, and diagnosis."
                        </p>
                        <div className="flex items-center gap-1 mt-6 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs font-semibold tracking-wide">Learn more</span>
                            <ArrowRight
                                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]"
                            />
                        </div>
                    </motion.div>

                </div>
                </div>
            </section>

            {/* 2. How We Work (8 Service Pillars) */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">How We Work</h2>
                        <p className="text-gray-600 text-lg font-medium">DigiSwasthya bridges the healthcare gap in underserved communities through a structured and technology-enabled support system.</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {[
                            {
                                title: "Awareness Campaigns",
                                icon: Megaphone,
                                color: "text-blue-600",
                                bg: "bg-blue-50",
                                arrowColor: "text-blue-400",
                                desc: "We conduct community outreach and health awareness initiatives to educate rural populations about preventive care and early detection."
                            },
                            {
                                title: "Accurate Information",
                                icon: Info,
                                color: "text-indigo-600",
                                bg: "bg-indigo-50",
                                arrowColor: "text-indigo-400",
                                desc: "Our trained coordinators provide reliable health information and guidance, reducing misinformation and promoting informed decisions."
                            },
                            {
                                title: "Electronic Medical Records",
                                icon: Database,
                                color: "text-purple-600",
                                bg: "bg-purple-50",
                                arrowColor: "text-purple-400",
                                desc: "We assist in digitally recording patient health information to ensure continuity of care and better coordination with specialists."
                            },
                            {
                                title: "Primary Health Checkups",
                                icon: ClipboardList,
                                color: "text-emerald-600",
                                bg: "bg-emerald-50",
                                arrowColor: "text-emerald-400",
                                desc: "Basic health assessments are conducted at village centers to identify early symptoms and determine the need for further consultation."
                            },
                            {
                                title: "Expert Opinion",
                                icon: Stethoscope,
                                color: "text-cyan-600",
                                bg: "bg-cyan-50",
                                arrowColor: "text-cyan-400",
                                desc: "Through teleconsultation support, beneficiaries are connected with qualified medical professionals for specialist advice."
                            },
                            {
                                title: "Timely Diagnosis",
                                icon: Clock,
                                color: "text-amber-600",
                                bg: "bg-amber-50",
                                arrowColor: "text-amber-400",
                                desc: "By facilitating quicker access to professional consultation, we help reduce delays in identifying health conditions."
                            },
                            {
                                title: "Referral Pathways",
                                icon: ExternalLink,
                                color: "text-orange-600",
                                bg: "bg-orange-50",
                                arrowColor: "text-orange-400",
                                desc: "When necessary, we guide patients toward appropriate healthcare facilities or partner hospitals for advanced treatment."
                            },
                            {
                                title: "Follow-Ups",
                                icon: RefreshCcw,
                                color: "text-rose-600",
                                bg: "bg-rose-50",
                                arrowColor: "text-rose-400",
                                desc: "We support follow-up coordination to encourage adherence to prescribed treatment plans and monitor recovery progress."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                custom={i * 0.05}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
                                transition={{ type: "tween", duration: 0.2 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group cursor-default"
                            >
                                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-[1.05]`}>
                                    <item.icon className={`${item.color} w-7 h-7`} />
                                </div>
                                <h4 className="text-lg font-black text-gray-900 mb-3 leading-tight">{item.title}</h4>
                                <p className="text-gray-500 leading-relaxed text-sm font-medium">
                                    {item.desc}
                                </p>
                                <div className={`flex items-center gap-1 mt-5 ${item.arrowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Sandeep's Story Section */}
            <section className="py-16 bg-white overflow-hidden">
                <div className="container">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-12 items-start">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight underline decoration-primary-200 underline-offset-8">Sandeep’s Story</h2>
                                <div className="space-y-4 text-gray-600 leading-relaxed text-sm font-medium text-justify">
                                    <p>
                                        In 2007, Sandeep was unwell. He wandered from one hospital to another but did not get the right diagnosis due to lack of qualified doctors and under-equipped hospitals in Sant-Kabir-Nagar, a small district in Uttar Pradesh. Lack of access to guidance of what needed to be done added to the worries.
                                    </p>
                                    <p>
                                        After 6-months, he got a biopsy done and was diagnosed with Ewing-Sarcoma (a type of bone-cancer). His whole right-humerus-bone was replaced. Doctors later proclaimed that Sandeep would have become immobilized if diagnosis would have been delayed.
                                    </p>
                                    <p>
                                        Over the next few months, he recovered slowly at Tata Memorial Hospital, Mumbai. However, the journey from being completely clueless as to what was the cause of his ailment to being detected with cancer, to gradually recovering, was nothing less than a miracle for him and his family. Sandeep was determined to give back to the society and started working with social-sector organizations (health) from 2015 to 2020. He devoted himself to work for thousands of cancer patients, cancer-survivors, and their families, providing them guidance, emotional support, financial support for their diagnostics, treatment, care and education.
                                    </p>
                                    <p>
                                        While his work created a positive impact on the lives of several patients, he realized that his ultimate calling was to go back to the grassroots and address the challenges from where they initiate – villages where there is lack of awareness of health issues and lack of access to healthcare infrastructure. Sandeep took a break from his job, and started conceiving an idea around how by leveraging technology, he can address the challenges he had earlier identified and make primary healthcare affordable and accessible in rural areas, where more than 65% of India’s 1.4 Billion population live. After numerous interviews with people living in these areas, discussions with senior administrators of India’s biggest hospitals, professors and government officials and evaluation of how other developing nations are handling the problem, Sandeep conceived the idea of DigiSwasthya (Digi=Digital, Swasthya = Health). He invested most of his savings till then to establish DigiSwasthya’s 1st telemedicine clinic in July 2020 in his home district, Sant-Kabir-Nagar.
                                    </p>
                                    <p>
                                        By creating a full stack primary healthcare platform, from creating a safe and hygienic physical space for patients to come, hiring trained nursing staff, creating tie-ups with doctors from prominent city hospitals, onboarding a tele-medicine software and hardware, to getting prescriptions fulfilled from adjoining pharmacies, Sandeep created one of the state’s 1st hybrid medical consultation facility.
                                    </p>
                                    <p>
                                        By creating a network of such standardized clinics across India, Sandeep and his motivated team is on a mission “to transform the country’s primary healthcare system and make healthcare services affordable and accessible for rural communities by leveraging technology”.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative lg:sticky lg:top-24 mt-12 lg:mt-0"
                            >
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border-4 border-gray-100 shadow-xl relative max-w-[280px] mx-auto">
                                    <Image
                                        src="/images/sandeep-speaking.jpg"
                                        alt="Sandeep Kumar - Founder of DigiSwasthya"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-4 -left-2 bg-primary-600 text-white p-4 rounded-xl shadow-lg max-w-[150px]">
                                    <p className="font-bold text-sm leading-tight text-center">Founder of DigiSwasthya</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Credentials & Legitimacy Block */}
            <section className="py-20 bg-[#f5f7fa]">
                <div className="container">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center border-b border-gray-100 pb-20">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Transparency & Legitimacy</h2>
                                <p className="text-gray-600 text-lg mb-8">
                                    DigiSwasthya is a registered non-profit committed to the highest standards of accountability and regulatory compliance.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <FileText className="text-primary-600 w-5 h-5 shrink-0" />
                                        <span><strong>NGO Registration:</strong> U85300UP2020NPL130635</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4 italic underline decoration-gray-200">
                                        Registered and compliant with applicable healthcare regulations in India.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-6 text-gray-900 border-b border-gray-100 pb-4">
                                    <HeartHandshake className="text-primary-600 w-6 h-6" />
                                    <h3 className="text-xl font-black uppercase tracking-tight">Our Partners</h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {[
                                        { id: "01", image: "/images/partner-1.png" },
                                        { id: "02", image: "/images/partner-2.png" },
                                        { id: "03", image: "/images/partner-3.png" },
                                        { id: "04", image: "/images/partner-4.png" },
                                        { id: "05", image: "/images/partner-5.png" },
                                        { id: "06", image: "/images/partner-6.png" },
                                        { id: "07", image: "/images/partner-7.png" },
                                        { id: "08", image: "/images/partner-8.png" },
                                        { id: "09", image: "/images/partner-9.png", link: "https://empowerpragati.in/" },
                                        { id: "10", image: "/images/partner-10.png" },
                                        { id: "11", image: "/images/partner-11.png" },
                                        { id: "12", image: "/images/partner-12.png", link: "https://svpindia.org/" },
                                        { id: "13", image: "/images/partner-13.jpg", link: "https://linktr.ee/teamspreadingsmilesofjoy" },
                                        { id: "14", image: "/images/partner-14.jpg" },
                                        { id: "15", image: "/images/partner-15.png" },
                                        { id: "16", image: "/images/partner-16.png" }
                                    ].map((p, i) => {
                                        const CardContent = (
                                            <div
                                                className="h-24 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-4 shadow-sm"
                                            >
                                                {p.image ? (
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={p.image}
                                                            alt={`Partner ${p.id}`}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-center opacity-40">
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 text-[8px]">Partner</div>
                                                        <div className="text-xs font-black text-gray-500">ORG-{p.id}</div>
                                                    </div>
                                                )}
                                            </div>
                                        );

                                        return p.link ? (
                                            <a
                                                key={i}
                                                href={p.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block transition-transform hover:scale-[1.02]"
                                            >
                                                {CardContent}
                                            </a>
                                        ) : (
                                            <div key={i} className="cursor-default">
                                                {CardContent}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Transparency Micro-Section */}
            <section className="py-20 bg-[#f5f7fa]">
                <div className="container">
                    <motion.div
                        {...fadeIn}
                        className="max-w-4xl mx-auto bg-primary-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="w-32 h-32" />
                        </div>
                        <h2 className="text-3xl font-bold mb-6">Our Promise of Accountability</h2>
                        <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                            We are committed to ethical healthcare delivery and transparent use of funds. Every contribution is tracked to ensure maximum impact in our rural communities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <a
                                href="/annual-report.pdf"
                                className="flex items-center gap-2 text-white font-bold hover:text-secondary-400 transition-colors border-b-2 border-white/20 pb-1"
                            >
                                <FileText className="w-5 h-5" />
                                Download Annual Report 2021-22
                            </a>
                            <span className="hidden sm:inline w-1 h-8 bg-white/20" />
                            <a
                                href="/contact-us"
                                className="flex items-center gap-2 group text-white font-bold hover:text-secondary-400 transition-colors"
                            >
                                Contact Our Ethics Office
                                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
