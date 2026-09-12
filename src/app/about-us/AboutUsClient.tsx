"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
    Users,
    Stethoscope,
    Activity,
    HeartHandshake,
    ShieldCheck,
    FileText,
    ExternalLink,
    Megaphone,
    Info,
    Database,
    Clock,
    RefreshCcw,
    ClipboardList,
    ArrowRight,
    Cpu,
    Smartphone,
    TrendingUp,
    AlertTriangle,
    Sparkles,
    Compass,
    Target,
    ChevronDown,
    ChevronUp,
    Heart
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const fadeIn = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay, ease: "easeOut" as const }
    })
};

// 100% UNCHANGED ORIGINAL TRANSLATION CONTENT
const contentDict = {
    section1: {
        title: { en: "Who We Are", hi: "हम कौन हैं" },
        text: {
            en: "DigiSwasthya Foundation is a technology-enabled healthcare organization committed to making quality healthcare accessible, affordable, and inclusive for underserved communities across India. By combining digital healthcare, expert medical professionals, and community outreach initiatives, DigiSwasthya works to bridge the gap between healthcare services and the people who need them the most.",
            hi: "डिजीस्वास्थ्य फाउंडेशन एक प्रौद्योगिकी-सक्षम स्वास्थ्य सेवा संगठन है जो भारत भर के वंचित समुदायों के लिए गुणवत्तापूर्ण स्वास्थ्य सेवा को सुलभ, किफायती और समावेशी बनाने के लिए प्रतिबद्ध है। डिजिटल स्वास्थ्य सेवा, विशेषज्ञ चिकित्सा पेशेवरों और सामुदायिक संपर्क पहलों को मिलाकर, डिजीस्वास्थ्य स्वास्थ्य सेवाओं और उन लोगों के बीच की खाई को पाटने का काम करता है जिन्हें इनकी सबसे अधिक आवश्यकता है।"
        }
    },
    section2: {
        title: { en: "The Healthcare Challenge", hi: "स्वास्थ्य सेवा चुनौती" },
        text: {
            en: "Millions of people across India continue to face barriers in accessing quality healthcare. Rural and underserved communities often experience shortages of specialist doctors, delayed diagnosis, limited healthcare infrastructure, financial constraints, and low health awareness. These challenges prevent timely treatment and negatively impact overall community health.",
            hi: "भारत भर में लाखों लोग गुणवत्तापूर्ण स्वास्थ्य सेवा प्राप्त करने में बाधाओं का सामना कर रहे हैं। ग्रामीण और वंचित समुदायों में अक्सर विशेषज्ञ डॉक्टरों की कमी, निदान में देरी, सीमित स्वास्थ्य सेवा बुनियादी ढांचा, वित्तीय बाधाएं और कम स्वास्थ्य जागरूकता का अनुभव होता है। ये चुनौतियाँ समय पर उपचार को रोकती हैं और समग्र सामुदायिक स्वास्थ्य को नकारात्मक रूप से प्रभावित करती हैं।"
        },
        challenges: [
            { icon: Users, title: { en: "Doctor Shortages", hi: "डॉक्टरों की कमी" }, desc: { en: "Critical shortage of medical specialists in remote primary centers.", hi: "दूरदराज के प्राथमिक केंद्रों में चिकित्सा विशेषज्ञों की भारी कमी।" } },
            { icon: Clock, title: { en: "Delayed Diagnosis", hi: "निदान में देरी" }, desc: { en: "Inability to detect symptoms early, leading to severe health complications.", hi: "लक्षणों का जल्दी पता न चल पाना, जिससे गंभीर स्वास्थ्य समस्याएं पैदा होती हैं।" } },
            { icon: Activity, title: { en: "Limited Infrastructure", hi: "सीमित बुनियादी ढांचा" }, desc: { en: "Lack of advanced testing laboratories and clinics in rural areas.", hi: "ग्रामीण क्षेत्रों में उन्नत परीक्षण प्रयोगशालाओं और क्लीनिकों की कमी।" } },
            { icon: ShieldCheck, title: { en: "Low Health Awareness", hi: "कम स्वास्थ्य जागरूकता" }, desc: { en: "Inadequate knowledge about preventive care and correct treatment paths.", hi: "निवारक देखभाल और सही उपचार मार्गों के बारे में अपर्याप्त ज्ञान।" } }
        ]
    },
    section3: {
        title: { en: "Why DigiSwasthya Exists", hi: "डिजीस्वास्थ्य क्यों अस्तित्व में है" },
        text: {
            en: "DigiSwasthya was established to reduce the gap between healthcare providers and underserved communities. Through technology-driven healthcare solutions, medical expertise, health camps, preventive screening programs, and awareness initiatives, the organization aims to ensure that quality healthcare reaches people regardless of their location or financial background.",
            hi: "डिजीस्वास्थ्य की स्थापना स्वास्थ्य सेवा प्रदाताओं और वंचित समुदायों के बीच के अंतर को कम करने के लिए की गई थी। प्रौद्योगिकी संचालित स्वास्थ्य सेवा समाधानों, चिकित्सा विशेषज्ञता, स्वास्थ्य शिविरों, निवारक स्क्रीनिंग कार्यक्रमों और जागरूकता पहलों के माध्यम से, संगठन का उद्देश्य यह सुनिश्चित करना है कि गुणवत्तापूर्ण स्वास्थ्य सेवा लोगों तक पहुंचे, चाहे उनका स्थान या वित्तीय पृष्ठभूमि कुछ भी हो।"
        }
    },
    section4: {
        title: { en: "How We Create Impact", hi: "हम कैसे प्रभाव पैदा करते हैं" },
        process: [
            { icon: Megaphone, label: { en: "Community Outreach", hi: "सामुदायिक संपर्क" }, desc: { en: "Regular engagement with rural communities to identify local health issues and build trust.", hi: "स्थानीय स्वास्थ्य मुद्दों की पहचान करने और विश्वास बनाने के लिए ग्रामीण समुदायों के साथ नियमित जुड़ाव।" } },
            { icon: Activity, label: { en: "Health Camps", hi: "स्वास्थ्य शिविर" }, desc: { en: "Conducting periodic health camps in remote areas to provide on-the-ground checkups.", hi: "जमीनी स्तर पर जांच प्रदान करने के लिए दूरदराज के क्षेत्रों में समय-समय पर स्वास्थ्य शिविर आयोजित करना।" } },
            { icon: ClipboardList, label: { en: "Health Screening", hi: "स्वास्थ्य स्क्रीनिंग" }, desc: { en: "Basic diagnostic screenings to check vitals and check for symptoms early.", hi: "महत्वपूर्ण संकेतों और लक्षणों की शीघ्र पहचान के लिए बुनियादी नैदानिक स्क्रीनिंग।" } },
            { icon: Stethoscope, label: { en: "Doctor Consultation", hi: "चिकित्सक परामर्श" }, desc: { en: "Connecting patients via telemedicine video links with specialist city doctors.", hi: "शहर के विशेषज्ञ डॉक्टरों के साथ टेलीमेडिसिन वीडियो लिंक के माध्यम से रोगियों को जोड़ना।" } },
            { icon: RefreshCcw, label: { en: "Digital Follow-up", hi: "डिजिटल फॉलो-अप" }, desc: { en: "Ensuring continuity of care with digital EMR tracking and routine check-ins.", hi: "डिजिटल ईएमआर ट्रैकिंग और नियमित चेक-इन के साथ देखभाल की निरंतरता सुनिश्चित करना।" } },
            { icon: HeartHandshake, label: { en: "Healthier Communities", hi: "स्वस्थ समुदाय" }, desc: { en: "Empowering families with preventive knowledge and timely interventions.", hi: "निवारक ज्ञान और समय पर हस्तक्षेप के साथ परिवारों को सशक्त बनाना।" } }
        ]
    },
    section5_6: {
        mission: {
            title: { en: "Our Mission", hi: "हमारा मिशन" },
            text: {
                en: "To make quality healthcare accessible to every individual by leveraging technology, medical expertise, preventive care, and community-driven healthcare initiatives that improve health outcomes and promote well-being.",
                hi: "प्रौद्योगिकी, चिकित्सा विशेषज्ञता, निवारक देखभाल और समुदाय-संचालित स्वास्थ्य पहलों का लाभ उठाकर हर व्यक्ति के लिए गुणवत्तापूर्ण स्वास्थ्य सेवा सुलभ बनाना जो स्वास्थ्य परिणामों में सुधार करती हैं और कल्याण को बढ़ावा देती हैं।"
            }
        },
        vision: {
            title: { en: "Our Vision", hi: "हमारा विजन" },
            text: {
                en: "To build a healthier and more inclusive India where every individual, regardless of geography or financial background, has access to timely, affordable, and quality healthcare.",
                hi: "एक स्वस्थ और अधिक समावेशी भारत का निर्माण करना जहाँ हर व्यक्ति, चाहे वह किसी भी भूगोल या वित्तीय पृष्ठभूमि का हो, समय पर, किफायती और गुणवत्तापूर्ण स्वास्थ्य सेवा प्राप्त कर सके।"
            }
        }
    },
    section7: {
        title: { en: "Why Our Work Matters", hi: "हमारा काम क्यों मायने रखता है" },
        text: {
            en: "Every healthcare consultation, awareness campaign, and community health initiative contributes toward building healthier communities. DigiSwasthya believes that healthcare should not be a privilege but a fundamental right. By improving accessibility, promoting preventive healthcare, and connecting communities with trusted medical professionals, the organization is creating long-term social impact across India.",
            hi: "प्रत्येक स्वास्थ्य परामर्श, जागरूकता अभियान और सामुदायिक स्वास्थ्य पहल स्वस्थ समुदायों के निर्माण में योगदान देती है। डिजीस्वास्थ्य का मानना है कि स्वास्थ्य सेवा एक विशेषाधिकार नहीं बल्कि एक मौलिक अधिकार होना चाहिए। पहुंच में सुधार करके, निवारक स्वास्थ्य सेवा को बढ़ावा देकर और समुदायों को विश्वसनीय चिकित्सा पेशेवरों से जोड़कर, संगठन पूरे भारत में दीर्घकालिक सामाजिक प्रभाव पैदा कर रहा है।"
        },
        cards: [
            { title: { en: "Improving Healthcare Accessibility", hi: "स्वास्थ्य सेवा पहुंच में सुधार" }, desc: { en: "Bringing quality medical consultations and diagnostics to the doorsteps of rural communities.", hi: "ग्रामीण समुदायों के दरवाजे पर गुणवत्तापूर्ण चिकित्सा परामर्श और निदान लाना।" } },
            { title: { en: "Promoting Preventive Care", hi: "निवारक देखभाल को बढ़ावा देना" }, desc: { en: "Catching symptoms early through health screenings and educational health camps.", hi: "स्वास्थ्य जांच और शैक्षिक स्वास्थ्य शिविरों के माध्यम से लक्षणों को जल्दी पकड़ना।" } },
            { title: { en: "Empowering Communities", hi: "समुदायों को सशक्त बनाना" }, desc: { en: "Educating families on hygiene, nutrition, and correct medical pathways.", hi: "स्वच्छता, पोषण और सही चिकित्सा मार्गों पर परिवारों को शिक्षित करना।" } },
            { title: { en: "Leveraging Technology", hi: "प्रौद्योगिकी का लाभ उठाना" }, desc: { en: "Using hybrid telemedicine software to bridge the gap between villages and expert city doctors.", hi: "गांवों और शहर के विशेषज्ञ डॉक्टरों के बीच की दूरी को पाटने के लिए हाइब्रिड टेलीमेडिसिन सॉफ्टवेयर का उपयोग करना।" } }
        ]
    }
};

export default function AboutUs() {
    const { t, language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const [isStoryExpanded, setIsStoryExpanded] = useState(false);

    return (
        <main className="min-h-screen bg-slate-50 selection:bg-primary-500 selection:text-white font-sans text-slate-800">
            <Navbar />

            {/* SECTION 1 — WHO WE ARE (Hero Section: Compact & Fitted) */}
            <section className="relative bg-gradient-to-br from-[#f8fafc] via-[#edf7f0] to-[#fef9ee] border-b border-slate-200/80 py-8 sm:py-10 lg:py-12 overflow-hidden text-slate-900">
                {/* Soft ambient aura lighting */}
                <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#059669_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

                <div className="container max-w-7xl relative z-10 px-4 sm:px-6">
                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                        
                        {/* Left Column: Heading & Text */}
                        <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 bg-white/95 border border-emerald-200/80 px-3.5 py-1 rounded-full shadow-sm backdrop-blur-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                                    {contentDict.section1.title[currentLang]}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight text-slate-900"
                            >
                                {currentLang === "hi" ? (
                                    <>
                                        गुणवत्तापूर्ण स्वास्थ्य सेवा <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700">
                                            सभी के लिए सुलभ
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Quality Healthcare <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700">
                                            For Every Rural Family
                                        </span>
                                    </>
                                )}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.12 }}
                                className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal"
                            >
                                {contentDict.section1.text[currentLang]}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start"
                            >
                                <a
                                    href="#sandeeps-story"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-900 via-primary-800 to-emerald-800 hover:from-primary-950 hover:to-emerald-900 text-white font-bold px-5.5 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-primary-950/20 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <span>{currentLang === "hi" ? "संस्थापक की कहानी पढ़ें" : "Read Founder's Story"}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                                <Link
                                    href="/donate"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary-500 to-amber-500 hover:from-secondary-600 hover:to-amber-600 text-white font-bold px-5.5 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-amber-500/25 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <Heart className="w-3.5 h-3.5 fill-white text-white" />
                                    <span>{currentLang === "hi" ? "हमारे मिशन का समर्थन करें" : "Support Our Mission"}</span>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right Column: Balanced Photo with Floating Stat */}
                        <div className="lg:col-span-5 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 aspect-[16/10] sm:aspect-[4/3] group bg-white p-1.5 max-w-lg mx-auto lg:max-w-none"
                            >
                                <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden">
                                    <Image
                                        src="/images/about/who-we-are.jpg"
                                        alt="DigiSwasthya Health Camp - Serving rural communities"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 2 — THE HEALTHCARE CHALLENGE (Compact 2-Col Height-Balanced) */}
            <section className="relative py-12 sm:py-16 bg-gradient-to-b from-[#f8fafc] via-[#f1f7f4] to-[#f8fafc] border-b border-slate-200/80 overflow-hidden">
                {/* Soft decorative aura glows */}
                <div className="absolute -top-20 left-1/4 w-80 h-80 bg-emerald-100/35 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-100/35 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px]" />

                <div className="container max-w-7xl relative z-10 px-4 sm:px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Left Side: Photo */}
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 aspect-[16/10] sm:aspect-[4/3] group bg-white p-2">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                    <Image
                                        src="/images/about/healthcare-challenge.jpg"
                                        alt="DigiSwasthya Health Awareness Camp at rural school"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side: Challenges Compact 2x2 */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="space-y-2 text-center lg:text-left">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full shadow-sm">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                    {currentLang === "hi" ? "भारत में चुनौती" : "The Gap In India"}
                                </span>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 leading-tight">
                                    {contentDict.section2.title[currentLang]}
                                </h2>
                                <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                                    {contentDict.section2.text[currentLang]}
                                </p>
                            </div>

                            {/* 4 Elevated Challenge Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {contentDict.section2.challenges.map((challenge, index) => {
                                    const Icon = challenge.icon;
                                    const iconStyles = [
                                        "bg-emerald-50 border-emerald-200 text-emerald-700",
                                        "bg-amber-50 border-amber-200 text-amber-700",
                                        "bg-teal-50 border-teal-200 text-teal-700",
                                        "bg-primary-50 border-primary-200 text-primary-700"
                                    ];
                                    const iconStyle = iconStyles[index % iconStyles.length];

                                    return (
                                        <div 
                                            key={index} 
                                            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5"
                                        >
                                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconStyle}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                                                    {challenge.title[currentLang]}
                                                </h4>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    {challenge.desc[currentLang]}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 3 — WHY DIGISWASTHYA EXISTS & OUR MISSION/VISION */}
            <section className="py-12 sm:py-16 bg-gradient-to-br from-emerald-50/30 via-white to-slate-50 border-b border-slate-200/60">
                <div className="container max-w-7xl px-4 sm:px-6">
                    
                    {/* Top: Why We Exist */}
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
                        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200/80 px-3 py-0.5 rounded-full">
                                <Compass className="w-3 h-3 text-emerald-700" />
                                {contentDict.section3.title[currentLang]}
                            </span>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-slate-900 leading-tight">
                                {currentLang === "hi" ? "हमारा दृष्टिकोण" : "Bridging the Distance to Specialist Healthcare"}
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                {contentDict.section3.text[currentLang]}
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 relative"
                        >
                            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md ring-1 ring-slate-200 aspect-[16/10] sm:aspect-[4/3] group">
                                <Image
                                    src="/images/about/why-digiswasthya-exists.jpg"
                                    alt="DigiSwasthya Telemedicine Consultation"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom: Mission & Vision (Dual Cards Compact) */}
                    <div className="pt-8 border-t border-slate-200/70">
                        <div className="grid lg:grid-cols-12 gap-8 items-center">
                            
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="lg:col-span-5 relative"
                            >
                                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md ring-1 ring-slate-200 aspect-[16/10] sm:aspect-[4/3] group">
                                    <Image
                                        src="/images/about/healthy-communities.jpg"
                                        alt="DigiSwasthya Foundation community health camp"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                                </div>
                            </motion.div>

                            <div className="lg:col-span-7 space-y-4">
                                
                                {/* Mission Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Target className="w-4 h-4 text-emerald-600" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                            {contentDict.section5_6.mission.title[currentLang]}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mb-1">
                                        {currentLang === "hi" ? "गुणवत्ता और समावेशी स्वास्थ्य सेवा" : "Accessible Quality Healthcare"}
                                    </h3>
                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                        {contentDict.section5_6.mission.text[currentLang]}
                                    </p>
                                </motion.div>

                                {/* Vision Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 shadow-sm relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Sparkles className="w-4 h-4 text-amber-600" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                                            {contentDict.section5_6.vision.title[currentLang]}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mb-1">
                                        {currentLang === "hi" ? "स्वस्थ एवं खुशहाल ग्रामीण भारत" : "Healthy & Happy Rural India"}
                                    </h3>
                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                        {contentDict.section5_6.vision.text[currentLang]}
                                    </p>
                                </motion.div>

                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* SECTION 4 — SANDEEP'S STORY (Balanced 50/50 Layout with Larger Video & Lower Top Margin) */}
            <section id="sandeeps-story" className="relative py-14 sm:py-18 bg-gradient-to-br from-[#fafcf8] via-[#f3f8f5] to-[#fdfaf5] border-b border-slate-200/80 scroll-mt-20 overflow-hidden">
                {/* Soft ambient light glows */}
                <div className="absolute -top-24 -left-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-amber-100/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px]" />

                <div className="container max-w-7xl relative z-10 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            
                            {/* Narrative Text Column */}
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="lg:col-span-7 space-y-4"
                            >
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/95 border border-emerald-200/90 text-emerald-800 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm backdrop-blur-sm mb-2.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Founder Journey</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
                                        Sandeep's Story
                                    </h3>
                                </div>

                                {/* Core Inspiring Opening (Always Visible) */}
                                <div className="space-y-3.5 text-slate-700 leading-relaxed text-sm sm:text-[15px] font-normal border-l-2 border-emerald-500/40 pl-4">
                                    <p>
                                        In 2007, Sandeep was unwell. He wandered from one hospital to another but did not get the right diagnosis due to lack of qualified doctors and under-equipped hospitals in Sant-Kabir-Nagar, a small district in Uttar Pradesh. Lack of access to guidance of what needed to be done added to the worries.
                                    </p>
                                    <p>
                                        After 6-months, he got a biopsy done and was diagnosed with Ewing-Sarcoma (a type of bone-cancer). His whole right-humerus-bone was replaced. Doctors later proclaimed that Sandeep would have become immobilized if diagnosis would have been delayed.
                                    </p>
                                    <p>
                                        Over the next few months, he recovered slowly at Tata Memorial Hospital, Mumbai. However, the journey from being clueless as to what was the cause of his ailment to being detected with cancer, to gradually recovering, was nothing less than a miracle for him and his family.
                                    </p>
                                </div>

                                {/* Expandable Additional Narrative (Preserves 100% Text) */}
                                <AnimatePresence>
                                    {isStoryExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-3.5 text-slate-700 leading-relaxed text-sm sm:text-[15px] font-normal pt-2 border-l-2 border-emerald-500/40 pl-4"
                                        >
                                            <p>
                                                Sandeep was determined to give back to the society and started working with social-sector organizations (health) from 2015 to 2020. He devoted himself to work for thousands of cancer patients, cancer-survivors, and their families, providing them guidance, emotional support, financial support for their diagnostics, treatment, care and education.
                                            </p>
                                            <p>
                                                While his work created a positive impact on the lives of several patients, he realized that his ultimate calling was to go back to the grassroots and address the challenges from where they initiate – villages where there is lack of awareness of health issues and lack of access to healthcare infrastructure. Sandeep took a break from his job, and started conceiving an idea around how by leveraging technology, he can address the challenges he had earlier identified and make primary healthcare affordable and accessible in rural areas, where more than 65% of India's 1.4 Billion population live. After numerous interviews with people living in these areas, discussions with senior administrators of India's biggest hospitals, professors and government officials and evaluation of how other developing nations are handling the problem, Sandeep conceived the idea of DigiSwasthya (Digi=Digital, Swasthya = Health). He invested most of his savings till then to establish DigiSwasthya's 1st telemedicine clinic in July 2020 in his home district, Sant-Kabir-Nagar.
                                            </p>
                                            <p>
                                                By creating a full stack primary healthcare platform, from creating a safe and hygienic physical space for patients to come, hiring trained nursing staff, creating tie-ups with doctors from prominent city hospitals, onboarding a tele-medicine software and hardware, to getting prescriptions fulfilled from adjoining pharmacies, Sandeep created one of the state's 1st hybrid medical consultation facility.
                                            </p>
                                            <p>
                                                By creating a network of such standardized clinics across India, Sandeep and his motivated team is on a mission "to transform the country's primary healthcare system and make healthcare services affordable and accessible for rural communities by leveraging technology".
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Toggle Button */}
                                <div className="pt-2">
                                    <button
                                        onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200/90 px-5 py-2.5 rounded-full transition-all shadow-sm hover:-translate-y-0.5"
                                    >
                                        {isStoryExpanded ? (
                                            <>Show Less <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>Read Full Story <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Balanced Video Column */}
                            <motion.div
                                initial={{ opacity: 0, x: 15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="lg:col-span-5 relative mt-4 sm:mt-6 lg:mt-2 flex flex-col justify-start"
                            >
                                <div className="w-full max-w-lg mx-auto rounded-3xl overflow-hidden bg-white shadow-xl ring-1 ring-slate-900/10 p-2 sm:p-2.5 border border-slate-200/80">
                                    <video
                                        controls
                                        className="w-full h-auto rounded-2xl aspect-[4/3] object-contain bg-black"
                                        preload="metadata"
                                    >
                                        <source src="/Videos/Motive (Digiswasthya).mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="mt-3.5 text-center">
                                    <span className="inline-flex items-center gap-2 bg-white/95 border border-emerald-200/70 rounded-full px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-sm">
                                        <span>🎥</span> Why Sandeep Started DigiSwasthya
                                    </span>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5 — HOW WE WORK (Mobile Horizontal Swipe / Desktop Grid) */}
            <section className="relative py-12 sm:py-16 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] border-b border-slate-200/80 overflow-hidden">
                {/* Soft ambient lighting */}
                <div className="absolute -top-24 right-1/4 w-80 h-80 bg-emerald-100/35 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px]" />

                <div className="container max-w-7xl relative z-10 px-4 sm:px-6">
                    
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full shadow-sm">
                            Process & Delivery
                        </span>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
                            How We Work
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            DigiSwasthya bridges the healthcare gap in underserved communities through a structured and technology-enabled support system.
                        </p>
                        <p className="text-[10px] text-slate-400 sm:hidden italic">👉 Swipe left to explore all 8 pillars</p>
                    </div>

                    {/* Horizontal Scroll on Mobile, 4-Col Grid on Desktop (Compact, Fitted Design) */}
                    <div className="flex overflow-x-auto pb-4 gap-3.5 snap-x sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
                        {[
                            { num: "01", title: "Awareness Campaigns", icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50", desc: "We conduct community outreach and health awareness initiatives to educate rural populations about preventive care and early detection." },
                            { num: "02", title: "Accurate Information", icon: Info, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Our trained coordinators provide reliable health information and guidance, reducing misinformation and promoting informed decisions." },
                            { num: "03", title: "Electronic Medical Records", icon: Database, color: "text-purple-600", bg: "bg-purple-50", desc: "We assist in digitally recording patient health information to ensure continuity of care and better coordination with specialists." },
                            { num: "04", title: "Primary Health Checkups", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Basic health assessments are conducted at village centers to identify early symptoms and determine the need for further consultation." },
                            { num: "05", title: "Expert Opinion", icon: Stethoscope, color: "text-cyan-600", bg: "bg-cyan-50", desc: "Through teleconsultation support, beneficiaries are connected with qualified medical professionals for specialist advice." },
                            { num: "06", title: "Timely Diagnosis", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", desc: "By facilitating quicker access to professional consultation, we help reduce delays in identifying health conditions." },
                            { num: "07", title: "Referral Pathways", icon: ExternalLink, color: "text-orange-600", bg: "bg-orange-50", desc: "When necessary, we guide patients toward appropriate healthcare facilities or partner hospitals for advanced treatment." },
                            { num: "08", title: "Follow-Ups", icon: RefreshCcw, color: "text-rose-600", bg: "bg-rose-50", desc: "We support follow-up coordination to encourage adherence to prescribed treatment plans and monitor recovery progress." }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group min-w-[260px] sm:min-w-0 snap-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-lg hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-9 h-9 sm:w-10 sm:h-10 ${item.bg} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                                            <item.icon className={`${item.color} w-4 h-4 sm:w-5 sm:h-5`} />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-emerald-500 transition-colors">
                                            {item.num}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-emerald-700 transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Our Care Model (Mobile Horizontal Swipe / Desktop 4+3 Grid) */}
                    <div className="border-t border-slate-200/70 pt-10 mt-10">
                        <div className="text-center max-w-2xl mx-auto mb-7 space-y-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full shadow-sm">
                                Rural Care Architecture
                            </span>
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
                                Our Care Model
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                How every DigiSwasthya centre delivers safe, continuous, and trusted care — designed for the realities of rural India.
                            </p>
                            <p className="text-[10px] text-slate-400 sm:hidden italic">👉 Swipe left to explore all 7 care pillars</p>
                        </div>

                        {/* Mobile Horizontal Swipe Carousel (Visible only on mobile < sm) */}
                        <div className="flex sm:hidden overflow-x-auto pb-4 gap-3.5 snap-x">
                            {[
                                { title: "Bringing Healthcare Closer to Communities", lead: "Trusted care, within your community.", icon: Users, color: "text-blue-600", bg: "bg-blue-50", desc: "A trained coordinator welcomes each patient, records their history and vital signs, and connects them with a qualified doctor over live video — followed by a digital prescription, counselling, and a clear follow-up plan, all without travelling long distances." },
                                { title: "Delivering Better Care Through Technology", lead: "Technology strengthens care — it never replaces it.", icon: Cpu, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Doctors instantly review a patient's past consultations, diagnoses, and medications, while AI summarises histories, highlights key clinical information, and checks prescriptions for interactions before they are issued — so clinicians can focus on the patient. AI enhances clinical judgement; it never replaces it." },
                                { title: "Caring Beyond a Single Consultation", lead: "Continuity, not isolated visits.", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Chronic conditions like diabetes and hypertension need ongoing care. Patients receive regular follow-ups and a complete longitudinal health record, and coordinators reach out to those who miss appointments — turning episodic visits into lasting care relationships." },
                                { title: "Understanding the Whole Person", lead: "Health is shaped by more than symptoms.", icon: HeartHandshake, color: "text-teal-600", bg: "bg-teal-50", desc: "Our model considers family health history, household conditions, water and sanitation, and nutrition — giving clinicians a fuller picture, helping identify risks earlier within families, and supporting healthier communities." },
                                { title: "Built for Rural India", lead: "Designed for real-world conditions.", icon: Smartphone, color: "text-cyan-600", bg: "bg-cyan-50", desc: "Our systems work reliably even where connectivity is limited — coordinators keep registering patients and recording information offline, with data securely synced once back online. The platform runs in English and Hindi on affordable Android devices." },
                                { title: "Protecting Every Patient's Trust", lead: "Privacy is fundamental to how we work.", icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50", desc: "Patient information is encrypted, securely stored, and accessible only to authorised healthcare professionals involved in a patient's care. Strong security and controlled access keep confidentiality and dignity central to every consultation." },
                                { title: "Scaling Quality Healthcare", lead: "Every improvement reaches every community.", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", desc: "As our network grows, new clinical guidance, enhanced safety features, improved AI capabilities, and better workflows roll out across all centres — so patients receive a consistent standard of care wherever they seek treatment." }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="group min-w-[260px] snap-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-lg hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                                >
                                    <div>
                                        <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-105 shadow-2xs`}>
                                            <item.icon className={`${item.color} w-4 h-4`} />
                                        </div>
                                        <h4 className="text-[13.5px] font-bold text-slate-900 mb-0.5 leading-snug group-hover:text-emerald-700 transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className={`text-[10px] font-bold mb-1.5 ${item.color} tracking-wide uppercase`}>
                                            {item.lead}
                                        </p>
                                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Layout (Hidden on mobile, 4 in Row 1 + 3 Centered in Row 2) */}
                        <div className="hidden sm:block">
                            {/* Row 1: 4 Cards */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-3 sm:mb-3.5">
                                {[
                                    { title: "Bringing Healthcare Closer to Communities", lead: "Trusted care, within your community.", icon: Users, color: "text-blue-600", bg: "bg-blue-50", desc: "A trained coordinator welcomes each patient, records their history and vital signs, and connects them with a qualified doctor over live video — followed by a digital prescription, counselling, and a clear follow-up plan, all without travelling long distances." },
                                    { title: "Delivering Better Care Through Technology", lead: "Technology strengthens care — it never replaces it.", icon: Cpu, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Doctors instantly review a patient's past consultations, diagnoses, and medications, while AI summarises histories, highlights key clinical information, and checks prescriptions for interactions before they are issued — so clinicians can focus on the patient. AI enhances clinical judgement; it never replaces it." },
                                    { title: "Caring Beyond a Single Consultation", lead: "Continuity, not isolated visits.", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Chronic conditions like diabetes and hypertension need ongoing care. Patients receive regular follow-ups and a complete longitudinal health record, and coordinators reach out to those who miss appointments — turning episodic visits into lasting care relationships." },
                                    { title: "Understanding the Whole Person", lead: "Health is shaped by more than symptoms.", icon: HeartHandshake, color: "text-teal-600", bg: "bg-teal-50", desc: "Our model considers family health history, household conditions, water and sanitation, and nutrition — giving clinicians a fuller picture, helping identify risks earlier within families, and supporting healthier communities." }
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="group bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between cursor-pointer"
                                    >
                                        <div>
                                            <div className={`w-8 h-8 sm:w-8.5 sm:h-8.5 ${item.bg} rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-105 shadow-2xs`}>
                                                <item.icon className={`${item.color} w-4 h-4`} />
                                            </div>
                                            <h4 className="text-xs sm:text-[13.5px] font-bold text-slate-900 mb-0.5 leading-snug group-hover:text-emerald-700 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className={`text-[9.5px] sm:text-[10px] font-bold mb-1.5 ${item.color} tracking-wide uppercase`}>
                                                {item.lead}
                                            </p>
                                            <p className="text-[11px] sm:text-[11.5px] text-slate-600 leading-relaxed font-normal">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Row 2: 3 Cards Centered */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 lg:w-[75%] lg:mx-auto">
                                {[
                                    { title: "Built for Rural India", lead: "Designed for real-world conditions.", icon: Smartphone, color: "text-cyan-600", bg: "bg-cyan-50", desc: "Our systems work reliably even where connectivity is limited — coordinators keep registering patients and recording information offline, with data securely synced once back online. The platform runs in English and Hindi on affordable Android devices." },
                                    { title: "Protecting Every Patient's Trust", lead: "Privacy is fundamental to how we work.", icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50", desc: "Patient information is encrypted, securely stored, and accessible only to authorised healthcare professionals involved in a patient's care. Strong security and controlled access keep confidentiality and dignity central to every consultation." },
                                    { title: "Scaling Quality Healthcare", lead: "Every improvement reaches every community.", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", desc: "As our network grows, new clinical guidance, enhanced safety features, improved AI capabilities, and better workflows roll out across all centres — so patients receive a consistent standard of care wherever they seek treatment." }
                                ].map((item, i) => (
                                    <div
                                        key={i + 4}
                                        className={`group bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between cursor-pointer ${i === 2 ? "sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full lg:col-span-1" : ""}`}
                                    >
                                        <div>
                                            <div className={`w-8 h-8 sm:w-8.5 sm:h-8.5 ${item.bg} rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-105 shadow-2xs`}>
                                                <item.icon className={`${item.color} w-4 h-4`} />
                                            </div>
                                            <h4 className="text-xs sm:text-[13.5px] font-bold text-slate-900 mb-0.5 leading-snug group-hover:text-emerald-700 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className={`text-[9.5px] sm:text-[10px] font-bold mb-1.5 ${item.color} tracking-wide uppercase`}>
                                                {item.lead}
                                            </p>
                                            <p className="text-[11px] sm:text-[11.5px] text-slate-600 leading-relaxed font-normal">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* SECTION 6 — WHY OUR WORK MATTERS */}
            <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
                <div className="container max-w-7xl px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full">
                            {contentDict.section7.title[currentLang]}
                        </span>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-slate-900 leading-tight">
                            {currentLang === "hi" ? "हमारा काम क्यों मायने रखता है" : "The Core of Our Mission"}
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {contentDict.section7.text[currentLang]}
                        </p>
                    </div>

                    {/* 4 Value Cards Compact with Matching Hover Animations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
                        {contentDict.section7.cards.map((card, index) => {
                            const icons = [TrendingUp, ShieldCheck, Users, Cpu];
                            const Icon = icons[index];
                            return (
                                <div
                                    key={index}
                                    className="group bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-300 hover:bg-white transition-all duration-300 flex flex-col justify-between cursor-pointer"
                                >
                                    <div>
                                        <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-3 text-emerald-700 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-sm">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 leading-tight group-hover:text-emerald-700 transition-colors">
                                            {card.title[currentLang]}
                                        </h3>
                                        <p className="text-slate-500 text-[11px] sm:text-xs leading-normal font-normal">
                                            {card.desc[currentLang]}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 7 — CREDENTIALS, PARTNERS & TRANSPARENCY */}
            <section id="our-partners" className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white scroll-mt-24">
                <div className="container max-w-6xl px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-10 items-start border-b border-slate-200/60 pb-12">
                        <div>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full mb-2.5">
                                Trust & Governance
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mb-3">
                                Transparency & Legitimacy
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                                DigiSwasthya is a registered non-profit committed to the highest standards of accountability and regulatory compliance.
                            </p>
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-3 text-slate-800 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                                    <FileText className="text-emerald-600 w-4 h-4 shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium"><strong>NGO Registration:</strong> U85300UP2020NPL130635</span>
                                </div>
                                <p className="text-[11px] text-slate-400 italic">
                                    Registered Section 8 NGO, compliant with applicable healthcare regulations in India.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-4 text-slate-900 border-b border-slate-200 pb-2.5">
                                <HeartHandshake className="text-emerald-600 w-5 h-5" />
                                <h3 className="text-base font-black uppercase tracking-tight">Our Partners</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
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
                                        <div className="h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2.5 shadow-sm hover:border-emerald-200 transition-all">
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
                                                    <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Partner</div>
                                                    <div className="text-[10px] font-black text-slate-500">ORG-{p.id}</div>
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
            </section>

            {/* SECTION 8 — TRANSPARENCY & ANNUAL REPORT */}
            <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white relative overflow-hidden">
                <div className="container px-4 sm:px-6">
                    <motion.div
                        {...fadeIn}
                        className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-300">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black mb-3">
                            Our Promise of Accountability
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-xl mx-auto leading-relaxed">
                            We are committed to ethical healthcare delivery and transparent use of funds. Every contribution is tracked to ensure maximum impact in our rural communities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <a
                                href="/annual-report.pdf"
                                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full px-5 py-2.5 text-xs sm:text-sm transition-colors shadow-md shadow-emerald-500/25"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Download Annual Report 2021-22
                            </a>
                            <a
                                href="/contact-us"
                                className="inline-flex items-center gap-2 text-white font-bold hover:text-emerald-300 transition-colors border border-white/20 hover:border-emerald-300 rounded-full px-5 py-2.5 text-xs sm:text-sm hover:bg-white/5"
                            >
                                Contact Our Ethics Office
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
