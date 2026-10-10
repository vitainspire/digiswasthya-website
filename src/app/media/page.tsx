import type { Metadata } from "next";
import MediaClient from "./MediaClient";
import { ogImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Media Gallery",
  description:
    "Photos and videos from DigiSwasthya Foundation's health camps, telemedicine centres, and community outreach across rural India.",
  alternates: { canonical: "/media" },
  openGraph: {
    images: ogImages,
    title: "Media Gallery | DigiSwasthya Foundation",
    description: "Photos and videos from DigiSwasthya's health camps and community outreach.",
    url: "/media",
  },
};

export default function Media() {
  return <MediaClient />;
}
