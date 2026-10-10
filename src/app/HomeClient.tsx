"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { FounderStoryTeaser } from "@/components/sections/FounderStoryTeaser";
import { BeneficiaryStories } from "@/components/sections/BeneficiaryStories";
import { GiftTiers } from "@/components/sections/GiftTiers";
import { Services } from "@/components/sections/Services";
import { VideoHighlight } from "@/components/sections/VideoHighlight";
import { PressStrip } from "@/components/sections/PressStrip";
import { AwardSection } from "@/components/sections/AwardSection";
import { PartnersStrip } from "@/components/sections/PartnersStrip";
import { Collaboration } from "@/components/sections/Collaboration";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <Hero />
      <TrustStrip />
      <FounderStoryTeaser />
      <BeneficiaryStories />
      <GiftTiers />
      <Services />
      <VideoHighlight />
      <PressStrip />
      <AwardSection />
      <PartnersStrip />
      <Collaboration />
      <Footer />
    </main>
  );
}
