"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { FounderStoryTeaser } from "@/components/sections/FounderStoryTeaser";
import { BeneficiaryStories } from "@/components/sections/BeneficiaryStories";
import { Collaboration } from "@/components/sections/Collaboration";
import { AwardSection } from "@/components/sections/AwardSection";
import { VideoHighlight } from "@/components/sections/VideoHighlight";
import { ImpactTeaser } from "@/components/sections/ImpactTeaser";
import { PartnersStrip } from "@/components/sections/PartnersStrip";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#f4f7f5]">
      <Navbar />
      <Hero />
      <FounderStoryTeaser />
      <Services />
      <BeneficiaryStories />
      <ImpactTeaser />
      <AwardSection />
      <VideoHighlight />
      <Collaboration />
      <PartnersStrip />

      {/* Social Media Follow Section */}
      <section className="py-14 bg-slate-900 border-t border-slate-800">
        <div className="container text-center">
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">{t("social.followTitle")}</h3>
          <div className="flex justify-center gap-3.5 sm:gap-4 flex-wrap">
            <a
              href="https://www.facebook.com/DigiSwasthya/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span>Facebook</span>
            </a>
            <a
              href="https://x.com/DigiSwasthya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <Twitter className="w-4 h-4 text-slate-900" />
              <span>Twitter</span>
            </a>
            <a
              href="https://www.instagram.com/digiswasthya/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <Instagram className="w-4 h-4 text-[#E4405F]" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.linkedin.com/company/digiswasthya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.youtube.com/channel/UC52n8c8U4jAtHsIzq7-wKvQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <Youtube className="w-4 h-4 text-[#FF0000]" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
