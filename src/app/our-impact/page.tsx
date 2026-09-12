import type { Metadata } from "next";
import OurImpactClient from "./OurImpactClient";

export const metadata: Metadata = {
  title: "Our Impact",
  description:
    "Explore DigiSwasthya Foundation's scale of operations, growth trends, and geographical footprint in rural India — patients served, consultations, and health camps.",
  alternates: { canonical: "/our-impact" },
  openGraph: {
    title: "Our Impact | DigiSwasthya Foundation",
    description: "DigiSwasthya's growth, reach, and healthcare impact across rural India.",
    url: "/our-impact",
  },
};

export default function OurImpact() {
  return <OurImpactClient />;
}
