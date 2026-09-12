"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";
import initialMediaData from "@/data/mediaData.json";

type MediaTab = "all" | "videos" | "news" | "photos";

function MediaContent() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as MediaTab | null;

    const [activeTab, setActiveTab] = useState<MediaTab>("all");
    const [mediaState, setMediaState] = useState(initialMediaData);

    useEffect(() => {
        if (tabParam && ["all", "videos", "news", "photos"].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    // Live sync with updated mediaData
    useEffect(() => {
        fetch("/api/admin/media")
            .then(res => res.json())
            .then(fresh => {
                if (fresh && fresh.videos) {
                    setMediaState(fresh);
                }
            })
            .catch(() => console.log("Using local media data"));
    }, []);

    const projectImages = mediaState.projectImages || initialMediaData.projectImages;
    const infographics = mediaState.infographics || initialMediaData.infographics;
    const mediaCoverage = mediaState.mediaCoverage || initialMediaData.mediaCoverage;
    const videos = mediaState.videos || initialMediaData.videos;

    const tabs: { id: MediaTab; label: string; count: number; icon: string }[] = [
        { id: "all", label: "All", count: mediaCoverage.length + videos.length + projectImages.length, icon: "✨" },
        { id: "news", label: "News & Press Coverage", count: mediaCoverage.length, icon: "📰" },
        { id: "photos", label: "Field Work Photos", count: projectImages.length + infographics.length, icon: "📸" },
        { id: "videos", label: "Videos & Documentaries", count: videos.length, icon: "🎥" }
    ];

    const showNews = activeTab === "all" || activeTab === "news";
    const showPhotos = activeTab === "all" || activeTab === "photos";
    const showVideos = activeTab === "all" || activeTab === "videos";

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#e8edf2] via-[#e2e8f0] to-[#dbe4ec] text-slate-900 flex flex-col relative">
            <Navbar />

            {/* Hero Section */}
            <section className="relative text-white py-12 md:py-16 overflow-hidden">
                {/* High-Resolution Background Photography */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-bg.png"
                        alt="DigiSwasthya Official Media Center"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    {/* Balanced contrast overlay */}
                    <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]" />
                </div>

                <div className="container relative z-10 text-center px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-orange-200 border border-white/20 text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-sm"
                    >
                        Official Media Center
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tight text-white drop-shadow-md"
                    >
                        Media & Resources
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-slate-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-xs"
                    >
                        Discover our stories, press coverage, patient documentaries, and field work across rural India.
                    </motion.p>
                </div>
            </section>

            {/* Sticky Interactive Filter Tabs Bar */}
            <div className="sticky top-24 z-30 bg-[#e2e8f0]/85 backdrop-blur-xl border-b border-slate-300/80 shadow-sm py-3">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                                        isActive
                                            ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/30 ring-2 ring-orange-600/30"
                                            : "bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-300/80 shadow-xs"
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            isActive
                                                ? "bg-white/25 text-white"
                                                : "bg-slate-200 text-slate-700"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}

                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-grow">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* 1. NEWS & PRESS COVERAGE SECTION (FIRST) */}
                        {showNews && (
                            <section className="py-16 md:py-20">
                                <div className="container max-w-6xl mx-auto px-4">
                                    <div className="flex flex-col items-center mb-12 text-center">
                                        <span className="px-4 py-1.5 bg-blue-100/90 text-blue-800 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                                            📰 News & Press Coverage
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                            DigiSwasthya in the News
                                        </h2>
                                        <p className="text-slate-600 text-sm md:text-base mt-2 max-w-xl font-medium">
                                            Recognized across national newspapers, government ministries, and international platforms.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {mediaCoverage.map((item, i) => (
                                            <div
                                                key={i}
                                                className="bg-white/85 backdrop-blur-xl rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-300/70 hover:border-blue-400/60 group transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                                            >
                                                <div className="relative h-56 overflow-hidden bg-slate-100/80 flex items-center justify-center p-4 border-b border-slate-200/60">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-blue-800 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs border border-blue-200">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-grow flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 mb-2.5 leading-snug group-hover:text-blue-700 transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-slate-600 font-normal text-sm leading-relaxed">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 2. FIELD WORK PHOTOS & INFOGRAPHICS (SECOND) */}
                        {showPhotos && (
                            <section className="py-16 md:py-20 border-t border-slate-300/80">
                                <div className="container max-w-6xl mx-auto px-4">
                                    <div className="flex flex-col items-center mb-12 text-center">
                                        <span className="px-4 py-1.5 bg-orange-100/90 text-orange-800 border border-orange-200 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                                            📸 Field Work & Infographics
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                            Our Work on the Ground
                                        </h2>
                                        <p className="text-slate-600 text-sm md:text-base mt-2 max-w-xl font-medium">
                                            Glimpses of daily consultations, doctor visits, and healthcare model frameworks.
                                        </p>
                                    </div>

                                    {/* Field Images */}
                                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                                        {projectImages.map((item, i) => (
                                            <div
                                                key={i}
                                                className="bg-white/85 backdrop-blur-xl rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-300/70 hover:border-orange-400/60 group transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                                            >
                                                <div className="relative h-60 overflow-hidden bg-slate-900">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-orange-800 border border-orange-200 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-grow">
                                                    <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug group-hover:text-orange-600 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-slate-600 text-sm leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Infographics Sub-Grid */}
                                    <div className="pt-8 border-t border-slate-300/80">
                                        <h3 className="text-xl font-bold text-slate-900 text-center mb-8">
                                            Healthcare Models & Mission Frameworks
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {infographics.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl shadow-md border border-slate-300/70 hover:border-orange-400/60 group hover:shadow-2xl transition-all duration-300"
                                                >
                                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-slate-200 bg-slate-100/80 flex items-center justify-center p-4">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.title}
                                                            width={800}
                                                            height={500}
                                                            className="object-contain max-h-full transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <h4 className="font-bold text-xl text-slate-900 mb-2">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-slate-600 text-sm max-w-md mx-auto">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 3. YOUTUBE VIDEOS & DOCUMENTARIES (THIRD) */}
                        {showVideos && (
                            <section className="py-16 md:py-20 border-t border-slate-300/80">
                                <div className="container max-w-6xl mx-auto px-4">
                                    <div className="flex flex-col items-center mb-12 text-center">
                                        <span className="px-4 py-1.5 bg-red-100/90 text-red-800 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                                            🎥 Videos & Documentaries
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                                            Watch DigiSwasthya in Action
                                        </h2>
                                        <p className="text-slate-600 text-sm md:text-base mt-2 max-w-xl font-medium">
                                            Real patient recoveries, doctor interviews, and on-ground telemedicine camps.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {videos.map((vid, i) => (
                                            <div
                                                key={i}
                                                className="group bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-slate-300/70 hover:border-red-400 hover:shadow-2xl transition-all duration-300 shadow-md flex flex-col"
                                            >
                                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm bg-black">
                                                    <iframe
                                                        className="absolute inset-0 w-full h-full"
                                                        src={`https://www.youtube.com/embed/${vid.id}?rel=0&modestbranding=1`}
                                                        title={vid.title}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                <div className="pt-4 pb-2 px-2 flex items-center justify-between gap-3">
                                                    <div>
                                                        <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                                                            {vid.category}
                                                        </span>
                                                        <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                                                            {vid.title}
                                                        </h3>
                                                    </div>
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium shrink-0 border border-slate-200">
                                                        ⏱️ {vid.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* YouTube Channel Banner CTA */}
                                    <div className="mt-12 text-center">
                                        <a
                                            href="https://www.youtube.com/channel/UC52n8c8U4jAtHsIzq7-wKvQ"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all duration-200 hover:-translate-y-0.5"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                            Watch All Stories on YouTube Channel (50+ Videos) →
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}

export default function Media() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-gradient-to-b from-[#e8edf2] via-[#e2e8f0] to-[#dbe4ec] flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </main>
        }>
            <MediaContent />
        </Suspense>
    );
}
