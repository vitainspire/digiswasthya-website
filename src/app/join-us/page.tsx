import type { Metadata } from "next";
import JoinUsClient from "./JoinUsClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Support DigiSwasthya Foundation as a donor or partner, or request to join our network of doctors offering teleconsultations to rural India.",
  alternates: { canonical: "/join-us" },
  openGraph: {
    images: ogImages,
    title: "Join Us | DigiSwasthya Foundation",
    description: "Support rural healthcare as a donor, or join our network of volunteer doctors.",
    url: "/join-us",
  },
};

export default function JoinUs() {
  return <JoinUsClient />;
}
