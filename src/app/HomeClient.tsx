"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { MarathonFeature } from "@/components/campaign/MarathonFeature";
import { CareModel } from "@/components/sections/CareModel";
import { FounderStory } from "@/components/sections/FounderStory";
import { BeneficiaryStories } from "@/components/sections/BeneficiaryStories";
import { GiftTiers } from "@/components/sections/GiftTiers";
import { AwardSection } from "@/components/sections/AwardSection";
import { Collaboration } from "@/components/sections/Collaboration";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <Hero />
      <TrustStrip />
      <MarathonFeature variant="home" />
      <CareModel />
      <FounderStory />
      <BeneficiaryStories />
      <GiftTiers />
      <AwardSection />
      <Collaboration />
      <Footer />
    </main>
  );
}
